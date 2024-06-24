import { Button, buttonVariants } from "@/components/ui/button";
import { DeleteItemsDialog } from "@/components/ui/custom/data-table/delete-items-dialog";
import { DataTableColumnHeader } from "@/components/ui/custom/data-table/data-table-column-header";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, extractInitials } from "@/lib/utils";
import { SquarePen, Trash, View } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ApiPaths } from "@/constants/apiPaths";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function DataTableRowActions({ row }) {
  const [showDeleteTaskDialog, setShowDeleteTaskDialog] = useState(false);

  return (
    <div className="flex justify-center">
      <DeleteItemsDialog
        open={showDeleteTaskDialog}
        onOpenChange={setShowDeleteTaskDialog}
        selectedData={[row]}
        showTrigger={false}
        apiBasePath={ApiPaths.Path_Users}
        onSuccess={() => setShowDeleteTaskDialog(false)}
      />
      <TooltipProvider>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to={`/admin/user/${row.original.id}`}
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
                to={`/admin/user/${row.original.id}/edit`}
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
    accessorKey: "name",
    meta: "Name",
    header: ({ column }) => (
      <DataTableColumnHeader className="ps-12" column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-start space-x-4">
        <Avatar className="flex h-8 w-8 text-center">
          <AvatarImage src={row.original.profilePhotoUrl} alt="Avatar" />
          <AvatarFallback className="bg-muted-foreground/90 text-xs font-semibold text-input">
            {row.getValue("name") && extractInitials(row.getValue("name"))}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col space-y-2">{row.getValue("name")}</div>
      </div>
    ),
  },
  {
    accessorKey: "email",
    meta: "Email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("email")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "role",
    meta: "Role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("role")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "phoneNumber",
    meta: "Contact Number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Number" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("phoneNumber")}</div>,
    enableSorting: false,
  },
  {
    id: "actions",
    meta: "Actions",
    header: () => (
      <div className="flex items-center justify-center space-x-2">
        <span>Actions</span>
      </div>
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
