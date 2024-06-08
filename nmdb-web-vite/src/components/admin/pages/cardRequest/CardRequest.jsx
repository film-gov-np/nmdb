import { DataTableAdvancedServerControlled } from "@/components/ui/custom/data-table/data-table-advanced-server-controlled";
import { ApiPaths } from "@/constants/apiPaths";
import { columns } from "./DataColumns";

export const facetedFilters = [
  {
    name: "isApproved",
    title: "Is Approved",
    accessorKey: "IsApproved",
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

const CardRequest = () => {
  return (
      <DataTableAdvancedServerControlled
        apiPath={ApiPaths.Path_CardRequest}
        columns={columns}
        nameLabel="card request"
        queryKey="datatable-card-request"
        facetedFilters={facetedFilters}
        withHeader={false}
        // addNewPath={Paths.Route_Admin_ProductionHouse_Add}
      />
  );
};

export default CardRequest;
