import { buttonVariants } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTableAdvanced } from "@/components/ui/custom/data-table/data-table-advanced";
import { movies } from "./data";
import { columns, facetedFilters } from "./dataColumns";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";
import { Paths } from "@/constants/routePaths";
import React from "react";
import MultipleSelector from "@/components/ui/custom/multiple-selector/multiple-selector";
import MultipleSelectorWithList from "./MultipleSelectionWithList";

let OPTIONS = [
  // { name: 'nextjs', id: 'Nextjs' },
  // { name: 'React', id: 'react' },
  // { name: 'Remix', id: 'remix' },
  // { name: 'Vite', id: 'vite' },
  // { name: 'Nuxt', id: 'nuxt' },
  // { name: 'Vue', id: 'vue' },
  // { name: 'Vue', id: 'vue2' },
  // { name: 'Vue', id: 'vue1' },
  // { name: 'Svelte', id: 'svelte' },
  // { name: 'Angular', id: 'angular' },
  // { name: 'Ember', id: 'ember' },
  // { name: 'Gatsby', id: 'gatsby' },
  // { name: 'Astro', id: 'astro' },
];
const fetchPost = async (value) => {
  await fetch(
    `https://api.slingacademy.com/v1/sample-data/users?search=${value}&limit=100`,
  )
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      OPTIONS = res?.users;
    });
};

const mockSearch = async (value) => {
  await fetchPost(value);
  return new Promise((resolve) => {
    console.log(OPTIONS);
    const res = OPTIONS?.filter((option) =>
      option.first_name.toLowerCase().includes(value.toLowerCase()),
    );
    resolve(res);
  });
};
const Movies = () => {
  const [isTriggered, setIsTriggered] = React.useState(false);

  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">

        <MultipleSelectorWithList
          onSearch={async (value) => {
            setIsTriggered(true);
            console.log(value);
            const res = await mockSearch(value);
            console.log(res);
            setIsTriggered(false);
            return res;
          }}
          keyValue="id"
          keyLabel="first_name"
          placeholder="Begin typing to search crew member..."
          loadingIndicator={
            <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
              loading...
            </p>
          }
          emptyIndicator={
            <p className="w-full text-center text-lg leading-10 text-muted-foreground">
              no results found.
            </p>
          }
        />

      {movies && movies.length ? (
        <>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Movies</h2>
              <p className="text-sm text-muted-foreground">
                List of all the movies
              </p>
            </div>
            <NavLink
              to={Paths.Route_Admin}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Movie
            </NavLink>
          </div>
          <Separator />
          <DataTableAdvanced
            data={movies}
            columns={columns}
            facetedFilters={facetedFilters}
          />
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no movies
            </h3>

            <p className="text-sm text-muted-foreground">
              You can start managing as soon as you add a movie.
            </p>
            <NavLink
              to={Paths.Route_Admin}
              className={cn(buttonVariants({ variant: "default" }), "mt-4")}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Movie
            </NavLink>
          </div>
        </div>
      )}
    </main>
  );
};

export default Movies;
