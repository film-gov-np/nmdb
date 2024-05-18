import { Button, buttonVariants } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/custom/data-table/data-table-column-header";
import { DeleteItemsDialog } from "@/components/ui/custom/data-table/delete-items-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ApiPaths } from "@/constants/apiPaths";
import { Paths } from "@/constants/routePaths";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  ExclamationTriangleIcon,
  Half1Icon,
  LinkNone2Icon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { Film, SquarePen, Trash, Video, View } from "lucide-react";
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
  {
    name: "status",
    filters: [
      {
        value: "Released",
        label: "Released",
        icon: CheckIcon,
      },
      {
        value: "Post-Production",
        label: "Post-Production",
        icon: LinkNone2Icon,
      },
      {
        value: "Un-Released",
        label: "Un-Released",
        icon: Half1Icon,
      },
      {
        value: "Coming Soon",
        label: "Coming Soon",
        icon: StopwatchIcon,
      },
      {
        value: "Unknown",
        label: "Unknown",
        icon: ExclamationTriangleIcon,
      },
    ],
  },
  {
    name: "category",
    filters: [
      {
        label: "Movie",
        value: "Movie",
        icon: Video,
      },
      {
        label: "Documentary",
        value: "Documentary",
        icon: Film,
      },
    ],
  },
];

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
        apiBasePath={ApiPaths.Path_Movies}
        onSuccess={() => setShowDeleteTaskDialog(false)}
      />
      <TooltipProvider>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to={Paths.Route_Admin_Movie + "/" + row.original.id}
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
                to={Paths.Route_Admin_Movie + "/" + row.original.id + "/edit"}
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col space-y-2">
          {row.getValue("name")}
          {row.original.nepaliName && (
            <span className="text-xs text-muted-foreground">
              {row.original.nepaliName}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const categories = facetedFilters.find(
        (filter) => filter.name === "category",
      );
      const category = categories?.filters?.find(
        (category) => category.value === row.getValue("category"),
      );

      if (!category) {
        return null;
      }

      return (
        <div className="flex items-center">
          {category.icon && (
            <category.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{category.label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const statuses = facetedFilters.find(
        (filter) => filter.name === "status",
      );
      const status = statuses?.filters?.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
