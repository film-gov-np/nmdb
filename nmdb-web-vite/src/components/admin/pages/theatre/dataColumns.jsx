import { Button, buttonVariants } from "@/components/ui/button";
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
import { ApiPaths } from "@/constants/apiPaths";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Badge } from "@/components/ui/badge";

function DataTableRowActions({ row }) {
  const [showDeleteTaskDialog, setShowDeleteTaskDialog] = useState(false);

  return (
    <div className="flex justify-center">
      <DeleteItemsDialog
        open={showDeleteTaskDialog}
        onOpenChange={setShowDeleteTaskDialog}
        selectedData={[row]}
        showTrigger={false}
        apiBasePath={ApiPaths.Path_Theatres}
        onSuccess={() => setShowDeleteTaskDialog(false)}
      />
      <TooltipProvider>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to={`/admin/theatre/${row.original.id}`}
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
                to={`/admin/theatre/${row.original.id}/edit`}
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
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    meta: "Name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "contactPerson",
    meta: "Contact Name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Name" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("contactPerson")}</div>,    
  },
  {
    accessorKey: "contactNumber",
    meta: "Contact Number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Number" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("contactNumber")}</div>,    
    enableSorting: false,    
  },
  {
    accessorKey: "isRunning",
    meta: "Is Running",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Running" />
    ),
    cell: ({ row }) => {
      let isRunning = row.getValue("isRunning");
      return(
      <Badge variant={isRunning ? "" : "destructive"}>
        {isRunning.toString()}
      </Badge>
      );
    },
    enableSorting: false,    
  },
  {
    id: "actions",
    meta:"Actions",
    header:()=>(<div className="flex items-center space-x-2 justify-center"><span>Actions</span></div>),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
