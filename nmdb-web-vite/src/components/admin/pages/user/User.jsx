import { columns } from "./dataColumns";
import { Paths } from "@/constants/routePaths";
import { ApiPaths } from "@/constants/apiPaths";
import { DataTableAdvancedServerControlled } from "@/components/ui/custom/data-table/data-table-advanced-server-controlled";

export const facetedFilters = [{
  name: "emailConfirmed",
  title: "Email Confirmed",
  accessorKey:"EmailConfirmed",
  filters: [
    {
      value: true,
      label: "Yes",
    },
    {
      value: false,
      label: "No",
    },
  ],
}];

const User = () => {

  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
      <DataTableAdvancedServerControlled
        apiPath={ApiPaths.Path_Users}
        columns={columns}
        facetedFilters={facetedFilters}
        queryKey="datatable-user"
        nameLabel="user"
        addNewPath={Paths.Route_Admin_User_Add}
        pageSizeOptions={[10, 25, 50, 75, 100]}
      />
    </main>
  );
};

export default User;
