import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  ExclamationTriangleIcon,
  Half1Icon,
  LinkNone2Icon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { Film, SquarePen, Trash, Video } from "lucide-react";
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
  const movie = row.original;
  return (
    <div className="flex">
      <TooltipProvider>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <NavLink
                to="#"
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
                onClick={() => console.log(movie.id)}
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "nepali_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nepali Name" />
    ),
    cell: ({ row }) => <div className="">{row.getValue("nepali_name")}</div>,
    enableGlobalFilter: true,
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableGlobalFilter: false,
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableGlobalFilter: false,
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
