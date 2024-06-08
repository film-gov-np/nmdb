import { columns } from "./dataColumns";
import { buttonVariants } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Paths } from "@/constants/routePaths";
import { cn } from "@/lib/utils";
import { DataTableAdvanced } from "@/components/ui/custom/data-table/data-table-advanced";
import { Separator } from "@/components/ui/separator";
import { ApiPaths } from "@/constants/apiPaths";
import { DataTableAdvancedServerControlled } from "@/components/ui/custom/data-table/data-table-advanced-server-controlled";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/helpers/axiosSetup";


export const facetedFilters = [{
  name: "isVerified",
  title: "Is Verified",
  accessorKey:"IsVerified",
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

const Crew = () => {

  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
      <DataTableAdvancedServerControlled
        apiPath={ApiPaths.Path_Crews}
        columns={columns}
        facetedFilters={facetedFilters}
        queryKey="datatable-crew"
        nameLabel="crew"
        addNewPath={Paths.Route_Admin_Crew_Add}
        pageSizeOptions={[10, 25, 50, 75, 100]}
      />
    </main>
  );
};

export default Crew;
