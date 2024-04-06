import { buttonVariants } from "@/components/ui/button";
import { DataTableAdvancedWithServerPagination } from "@/components/ui/custom/data-table-advanced-server-paginated";
import { Separator } from "@/components/ui/separator";
import { Paths } from "@/constants/routePaths";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { columns, facetedFilters } from "./dataColumns";
import { DataTableSkeleton } from "@/components/ui/custom/data-table-skeleton";
import NoDataComponent from "../../NoDataComponent";

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
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Production House
              </h2>
              <p className="text-sm text-muted-foreground">
                This is server side paginated data
              </p>
            </div>
            <NavLink
              to={Paths.Route_Admin + Paths.Route_Admin_ProductionHouse + Paths.Route_Admin_ProductionHouse_Add}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Add Production House
            </NavLink>
          </div>
          <Separator />
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
        (
          <NoDataComponent
            label={"production house"}
            pathTo={Paths.Route_Admin + Paths.Route_Admin_ProductionHouse + Paths.Route_Admin_ProductionHouse_Add}
          />
        )
      )}
    </main>
  );
};

export default ProductionHouse;
