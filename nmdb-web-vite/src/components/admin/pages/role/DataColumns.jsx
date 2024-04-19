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
import {
  CheckIcon,
  LinkNone2Icon,
} from "@radix-ui/react-icons";
import { SquarePen, Trash, View } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const facetedFilters = [

];

function DataTableRowActions({ row }) {
  // const movie = row.original;
  const [showDeleteTaskDialog, setShowDeleteTaskDialog] = useState(false);
  return (
    <div className="flex">
      <DeleteItemsDialog
        open={showDeleteTaskDialog}
        onOpenChange={setShowDeleteTaskDialog}
        selectedData={[row]}
        showTrigger={false}
        onSuccess={() => setShowDeleteTaskDialog(false)}
      />
      <TooltipProvider>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to={`/admin/role/${row.original.id}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  " text-blue-500",
                )}
              >
                <View className="h-4 w-4" />
                <span className="sr-only">View Details</span>
              </NavLink>
            </TooltipTrigger>
            <TooltipContent side="top">Edit</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to={`/admin/role/${row.original.id}/edit`}
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
    accessorKey: "roleName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("roleName")}</div>,
  },
  {
    accessorKey: "categoryName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("categoryName")}</div>,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "createdBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created By" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("createdBy")}</div>,
    enableGlobalFilter: true,
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
