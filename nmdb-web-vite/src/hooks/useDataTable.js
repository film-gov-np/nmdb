import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebouncedState } from "./useDebouncedState";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

const useDataTable = ({ data, columns, pageCount, facetedFilters })=> {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedGlobalFilter = useDebouncedState(globalFilter, 500);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const page = searchParams?.get("page") ?? "1";
  const pageAsNumber = Number(page);
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber;
  const per_page = searchParams?.get("limit") ?? "10";
  const perPageAsNumber = Number(per_page);
  const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber;

  const createQueryString = useCallback(
    (params) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: fallbackPage - 1,
    pageSize: fallbackPerPage,
  });
  useEffect(() => {
    navigate(
      `${pathname}?${createQueryString({
        page: pageIndex + 1,
        limit: pageSize,
      })}`,
      { replace: true },
    );
  }, [pageIndex, pageSize]);
  //   const searchValue = table.getColumn(searchKey)?.getFilterValue();
  useEffect(() => {
    if (debouncedGlobalFilter?.length > 0) {
      navigate(
        `${pathname}?${createQueryString({
          page: null,
          limit: null,
          search: debouncedGlobalFilter,
        })}`,
      );
    }
    if (
      debouncedGlobalFilter?.length === 0 ||
      debouncedGlobalFilter === undefined
    ) {
      navigate(
        `${pathname}?${createQueryString({
          page: null,
          limit: null,
          search: null,
        })}`,
      );
    }
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedGlobalFilter]);
  //   useEffect(() => {
  //     const filter = columnFilters.name
  //     navigate(
  //         `${pathname}?${createQueryString({
  //           page: pageIndex + 1,
  //           limit: pageSize,
  //         })}`
  //       );
  //   }, [columnFilters]);

  const table = useReactTable({
    data,
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
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
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
  });

  return { table };
}

export {useDataTable};