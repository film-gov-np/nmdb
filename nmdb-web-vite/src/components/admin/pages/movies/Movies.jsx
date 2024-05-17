import { columns } from "./dataColumns";
import { Paths } from "@/constants/routePaths";
import { DataTableAdvancedServerControlled } from "@/components/ui/custom/data-table/data-table-advanced-server-controlled";
import { ApiPaths } from "@/constants/apiPaths";

const Movies = () => {
  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
    <DataTableAdvancedServerControlled
      apiPath={ApiPaths.Path_Movies}
      columns={columns}
      nameLabel="movies"
      queryKey="datatable-movies"
      // facetedFilters={facetedFilters}
      addNewPath={Paths.Route_Admin_Movie_Add}
    />
  </main>
  );
};

export default Movies;
