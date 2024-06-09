import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DeleteItemsDialog } from "@/components/ui/custom/data-table/delete-items-dialog";
import { DataTableColumnHeader } from "@/components/ui/custom/data-table/data-table-column-header";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
// import { DataTableRowActions } from "@/components/ui/custom/data-table-row-actions";
import { SquarePen, Trash, View } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Paths } from "@/constants/routePaths";
import { ApiPaths } from "@/constants/apiPaths";
import { Badge } from "@/components/ui/badge";

export const labels = [];

export const facetedFilters = [];

function DataTableRowActions({ row }) {
  // const movie = row.original;
  const [showDeleteTaskDialog, setShowDeleteTaskDialog] = useState(false);
  return (
    <div className="flex justify-center">
      <DeleteItemsDialog
        open={showDeleteTaskDialog}
        onOpenChange={setShowDeleteTaskDialog}
        selectedData={[row]}
        showTrigger={false}
        apiBasePath={ApiPaths.Path_ProductionHouse}
        onSuccess={() => setShowDeleteTaskDialog(false)}
      />
      <TooltipProvider>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to={Paths.Route_Admin_ProductionHouse + "/" + row.original.id}
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  " text-blue-500",
                )}
              >
                <View className="h-4 w-4" />
                <span className="sr-only">View Details</span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="top">Details</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to={
                  Paths.Route_Admin_ProductionHouse +
                  "/" +
                  row.original.id +
                  "/edit"
                }
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  " text-green-500",
                )}
              >
                <SquarePen className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="top">Edit</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className=" text-destructive"
                onClick={() => setShowDeleteTaskDialog(true)}
                variant="outline"
                size="icon"
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Delete</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}

export const columns = [
  {
    accessorKey: "crew",
    meta: "Crew",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Crew" />
    ),
    cell: ({ row }) => {
        const currentCrew= row.getValue("crew")
      return (
        <div className="flex flex-col space-y-2">
          {currentCrew.name}
          {currentCrew.email && (
            <span className="text-xs text-muted-foreground">
              {currentCrew.email}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "approvedDate",
    meta: "Approved Date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Approved Date" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("approvedDate")}</div>,
    // enableGlobalFilter: true,
  },
  {
    accessorKey: "isApproved",
    meta: "Is Approved",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Approved" />
    ),
    cell: ({ row }) => {
      let isApproved = row.getValue("isApproved");
      return (
        <Badge
          variant={isApproved ? "secondary" : "destructive"}
          className="px-4 "
        >
          {isApproved ? "Yes" : "No"}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
