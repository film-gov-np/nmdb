import { DataTableAdvancedServerControlled } from "@/components/ui/custom/data-table/data-table-advanced-server-controlled";
import { Paths } from "@/constants/routePaths";
import { columns, facetedFilters } from "./DataColumns";
import { ApiPaths } from "@/constants/apiPaths";

const Role = () => {
  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
      <DataTableAdvancedServerControlled
        apiPath={ApiPaths.Path_FilmRoles}
        columns={columns}
        facetedFilters={facetedFilters}
        nameLabel="role"
        addNewPath={Paths.Route_Admin_Role_Add}
        pageSizeOptions={[10, 25, 50, 75, 100]}
      />
    </main>
  );
};

export default Role;
