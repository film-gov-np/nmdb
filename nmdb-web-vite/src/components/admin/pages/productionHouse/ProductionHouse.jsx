import { DataTableAdvancedServerControlled } from "@/components/ui/custom/data-table/data-table-advanced-server-controlled";
import { Paths } from "@/constants/routePaths";
import { columns } from "./dataColumns";
import { ApiPaths } from "@/constants/apiPaths";

export const facetedFilters = [
  {
    name: "isRunning",
    title: "Is Running",
    accessorKey: "IsRunning",
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
  },
];

const ProductionHouse = () => {
  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
      <DataTableAdvancedServerControlled
        apiPath={ApiPaths.Path_ProductionHouse}
        columns={columns}
        nameLabel="production house"
        queryKey="datatable-production-house"
        facetedFilters={facetedFilters}
        addNewPath={Paths.Route_Admin_ProductionHouse_Add}
      />
    </main>
  );
};

export default ProductionHouse;
