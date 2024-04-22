import { DataTableAdvancedWithServerPagination } from "@/components/ui/custom/data-table/data-table-advanced-server-paginated";
import { Paths } from "@/constants/routePaths";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { columns, facetedFilters } from "./DataColumns";
import { DataTableSkeleton } from "@/components/ui/custom/data-table/data-table-skeleton";
import NoDataComponent from "../../NoDataComponent";
import ListPageHeader from "../../ListPageHeader";

const ProductionHouse = () => {
  const [searchParams] = useSearchParams();
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [employeeRes, setEmployeeRes] = useState({});
  const page = Number(searchParams.get("page")) || 1;
  const pageLimit = Number(searchParams.get("limit")) || 10;
  const country = searchParams.get("search") || null;
  const offset = (page - 1) * pageLimit;
  const fetchPost = () => {
    fetch(
      `https://api.slingacademy.com/v1/sample-data/users?offset=${offset}&limit=${pageLimit}` +
        (country ? `&search=${country}` : ""),
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setEmployeeRes(res);
        setIsFetchingData(false);
      });
  };
  useEffect(() => {
    fetchPost();
  }, [searchParams]);
  const totalUsers = employeeRes.total_users; //1000
  const pageCount = Math.ceil(totalUsers / pageLimit);
  const employee = employeeRes.users;
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
      ) : employee && employee.length ? (
        <>
          <ListPageHeader
            label={"production house"}
            pathTo={Paths.Route_Admin_ProductionHouse_Add}
          />
          <DataTableAdvancedWithServerPagination
            searchKey="country"
            pageNo={page}
            columns={columns}
            totalUsers={totalUsers}
            data={employee}
            pageCount={pageCount}
            facetedFilters={facetedFilters}
          />
        </>
      ) : (
        <NoDataComponent
          label={"production house"}
          pathTo={Paths.Route_Admin_ProductionHouse_Add}
        />
      )}
    </main>
  );
};

export default ProductionHouse;
