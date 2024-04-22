import { DataTableAdvanced } from "@/components/ui/custom/data-table/data-table-advanced";
import { movies } from "./data";
import { columns, facetedFilters } from "./dataColumns";
import { Paths } from "@/constants/routePaths";
import NoDataComponent from "../../NoDataComponent";
import ListPageHeader from "../../ListPageHeader";

const Movies = () => {
  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
      {movies && movies.length ? (
        <>
          <ListPageHeader label="movies" pathTo={Paths.Route_Admin_Movie_Add} />
          <DataTableAdvanced
            data={movies}
            columns={columns}
            facetedFilters={facetedFilters}
          />
        </>
      ) : (
        <NoDataComponent label={"movie"} pathTo={Paths.Route_Admin_Movie_Add} />
      )}
    </main>
  );
};

export default Movies;
