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
import { SquarePen, Trash, View } from "lucide-react";
import { useState } from "react";
import { ApiPaths } from "@/constants/apiPaths";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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
        apiBasePath={ApiPaths.Path_CardRequest}
        onSuccess={() => setShowDeleteTaskDialog(false)}
      />
      <TooltipProvider>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="text-destructive"
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
    cell: ({ row }) => <div className="">{row.getValue("approvedDate") && (format(row.getValue("approvedDate"), "PPP p"))}</div>,
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
