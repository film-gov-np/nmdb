import { flexRender } from "@tanstack/react-table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import axiosInstance from "@/helpers/axiosSetup";
import { DataTableSkeleton } from "./data-table-skeleton";
import ListPageHeader from "@/components/admin/ListPageHeader";
import NoDataComponent from "@/components/admin/NoDataComponent";

const defaultQueryParameters = {
  pageNumber: 1,
  pageSize: 10,
  searchKeyword: "",
  sortColumn: "",
  descending: false,
};

const generateQueryPath = ({
  pageIndex,
  pageSize,
  sorting,
  debouncedGlobalFilter,
  columnFilters,
}) => {
  console.log("column-filters", columnFilters);
  let queryPath = `?PageNumber=${pageIndex + 1}&PageSize=${pageSize}&id=1`;
  if (sorting[0]?.id) {
    queryPath += `&SortColumn=${sorting[0]?.id}&Descending=${sorting[0]?.desc}`;
  }
  if (debouncedGlobalFilter) {
    queryPath += `&SearchKeyword=${debouncedGlobalFilter}`;
  }
  return queryPath;
};

const getDataFromServer = async (apiPath, parameters) => {
  const data = await axiosInstance
    .get(apiPath + generateQueryPath(parameters))
    .then((response) => {
      console.log("data", response);
      return response.data;
    })
    .catch((error) => {
      console.log("error", error);
      return [];
    });
  return {
    roles: data.items,
    totalData: data.totalItems,
  };
};

export function DataTableAdvancedServerControlled({
  apiPath,
  columns,
  facetedFilters,
  queryParameters = defaultQueryParameters,
  nameLabel = "",
  addNewPath = "",
  pageSizeOptions,
}) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);

  const [globalFilter, setGlobalFilter] = useState(
    queryParameters.searchKeyword || "",
  );
  const debouncedGlobalFilter = useDebouncedState(globalFilter, 500);

  const page = queryParameters.pageNumber;
  const pageAsNumber = Number(page);
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 3 : pageAsNumber;
  const per_page = queryParameters.pageSize;
  const perPageAsNumber = Number(per_page);
  const fallbackPerPage = isNaN(perPageAsNumber) ? 12 : perPageAsNumber;
  const [column, order] = [
    queryParameters.sortColumn,
    queryParameters.descending ? "desc" : "asc",
  ];
  // Handle server side sorting
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: fallbackPage - 1,
    pageSize: fallbackPerPage,
  });
  const [sorting, setSorting] = useState([
    {
      id: column ?? "",
      desc: order === "desc",
    },
  ]);
  const { isLoading, data, isError, isFetching, isPreviousData, error } =
    useQuery({
      queryKey: [
        "flimRoles",
        pageIndex,
        pageSize,
        sorting,
        debouncedGlobalFilter,
        columnFilters,
      ],
      queryFn: () =>
        getDataFromServer(apiPath, {
          pageIndex,
          pageSize,
          sorting,
          debouncedGlobalFilter,
          columnFilters,
        }),
      keepPreviousData: true,
    });

  const totalDataCount = data?.totalData;
  const pageCount = Math.ceil(totalDataCount / pageSize);
  const onSortingChange = (data) => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setSorting(data);
  };
  const onGlobalFilterChange = (data) => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    setGlobalFilter(data);
  };
  const table = useReactTable({
    data: data?.roles,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination: { pageIndex, pageSize },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
  });
  if (isLoading || isFetching)
    return (
      <DataTableSkeleton
        columnCount={5}
        searchableColumnCount={1}
        filterableColumnCount={2}
        cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
        shrinkZero
      />
    );
  // if (totalDataCount === 0)
  //   return <NoDataComponent label={nameLabel} pathTo={addNewPath} />;
  if (isError) return `Error: ${error}`;
  return (
    <div className="space-y-4">
      <ListPageHeader label={nameLabel} pathTo={addNewPath} />
      <DataTableToolbar table={table} facetedFilters={facetedFilters} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} pageSizeOptions={pageSizeOptions} />
    </div>
  );
}
