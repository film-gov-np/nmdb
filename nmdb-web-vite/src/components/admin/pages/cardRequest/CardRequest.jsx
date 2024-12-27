import { DataTableAdvancedServerControlled } from "@/components/ui/custom/data-table/data-table-advanced-server-controlled";
import { ApiPaths } from "@/constants/apiPaths";
import { columns } from "./DataColumns";
import { cn } from "@/lib/utils";

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

const CardRequest = ({ className }) => {
  return (
    <main
      className={cn(
        "flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6",
        className,
      )}
    >
      <DataTableAdvancedServerControlled
        apiPath={ApiPaths.Path_CardRequest}
        columns={columns}
        nameLabel="card request"
        queryKey="datatable-card-request"
        facetedFilters={facetedFilters}
        withHeader={false}
      />
    </main>
  );
};

export default CardRequest;
