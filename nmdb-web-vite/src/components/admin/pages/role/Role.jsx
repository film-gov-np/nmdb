import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTableSkeleton } from "@/components/ui/custom/data-table/data-table-skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axiosInstance from "@/helpers/axiosSetup";
import { Badge } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ListPageHeader from "../../ListPageHeader";
import { DataTableAdvancedWithServerPagination } from "@/components/ui/custom/data-table/data-table-advanced-server-paginated";
import NoDataComponent from "../../NoDataComponent";
import { Paths } from "@/constants/routePaths";
import { columns, facetedFilters } from "./DataColumns";

const Role = () => {
  // useEffect(() => {
  //   axiosInstance
  //     .post("api/film/role", postData)
  //     .then((resp) => {
  //       if (resp) {
  //         const {
  //           created,
  //           email,
  //           firstName,
  //           idx,
  //           isVerified,
  //           jwtToken,
  //           lastName,
  //           updated,
  //         } = resp.data.data;
  //         //set token to cookie or localStorage
  //         localStorage.setItem("token", jwtToken);
  //         setIsAuthorized(true);
  //         navigate("/admin/dashboard");
  //       }
  //     })
  //     .catch((error) => { });

  // }, []);

  const [searchParams] = useSearchParams();
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [responseData, setResponseData] = useState({});
  const page = Number(searchParams.get("pageNo")) || 1;
  const pageLimit = Number(searchParams.get("pageSize")) || 10;
  const searchValue = searchParams.get("search") || null;
  const fetchTableData = () => {
    axiosInstance.get(
      `film/roles?pageNo=${page}&pageSize=${pageLimit}`,
    )
      .then((res) => {
        console.log(res);
        setResponseData(res.data);
        setIsFetchingData(false);
      });
  };
  useEffect(() => {
    fetchTableData();
  }, [searchParams]);
  const totalDataCount = responseData.totalItems;
  const pageCount = Math.ceil(totalDataCount / pageLimit);
  const tableData = responseData.items;
  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
      {isFetchingData ? (
        <DataTableSkeleton
          columnCount={5}
          searchableColumnCount={1}
          filterableColumnCount={2}
          cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
          shrinkZero
        />
      ) : tableData && tableData.length ? (
        <>
          <ListPageHeader
            label={"role"}
            pathTo={
              Paths.Route_Admin +
              Paths.Route_Admin_ProductionHouse +
              Paths.Route_Admin_ProductionHouse_Add
            }
          />
          <DataTableAdvancedWithServerPagination
            searchKey="country"
            pageNo={page}
            columns={columns}
            totalUsers={totalDataCount}
            data={tableData}
            pageCount={pageCount}
            // facetedFilters={facetedFilters}
          />
        </>
      ) : (
        <NoDataComponent
          label={"role"}
          pathTo={
            Paths.Route_Admin +
            Paths.Route_Admin_ProductionHouse +
            Paths.Route_Admin_ProductionHouse_Add
          }
        />
      )}
    </main>
  );
};

export default Role;
