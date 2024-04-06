import { buttonVariants } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataTableAdvanced } from "@/components/ui/custom/data-table-advanced";
import { movies } from "./data";
import { columns, facetedFilters } from "./dataColumns";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "react-router-dom";
import { Paths } from "@/constants/routePaths";

const Movies = () => {
  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
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
