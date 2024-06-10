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
// import { DataTableRowActions } from "@/components/ui/custom/data-table-row-actions";
import { SquarePen, Trash, View } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ApiPaths } from "@/constants/apiPaths";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Badge } from "@/components/ui/badge";
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
        apiBasePath={ApiPaths.Path_Crews}
        onSuccess={() => setShowDeleteTaskDialog(false)}
      />
      <TooltipProvider>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to={`/admin/crew/${row.original.id}`}
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
                to={`/admin/crew/${row.original.id}/edit`}
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
            {extractInitials(row.getValue("name"))}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col space-y-2">
          {row.getValue("name")}
          {row.original.nepaliName && (
            <span className="text-xs text-muted-foreground">
              {row.original.nepaliName}
            </span>
          )}
        </div>
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
    accessorKey: "nickName",
    meta: "Nick Name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nick Name" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("nickName")}</div>,
  },
  {
    accessorKey: "isVerified",
    meta: "Is Verified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Verified" />
    ),
    cell: ({ row }) => {
      let isVerified = row.getValue("isVerified");
      return (
        <Badge
          variant={isVerified ? "secondary" : "destructive"}
          className="px-4"
        >
          {isVerified ? "Yes" : "No"}
        </Badge>
      );
    },
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
