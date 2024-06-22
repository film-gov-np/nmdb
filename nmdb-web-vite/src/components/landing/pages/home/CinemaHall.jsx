import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ApiPaths } from "@/constants/apiPaths";
import axiosInstance from "@/helpers/axiosSetup";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, CircleIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import CommonAlertBanner from "../../CommonAlertBanner";
import SimplePagination from "@/components/common/SimplePagination";
import { Paths } from "@/constants/routePaths";

const getCinemaHallList = async (page, debouncedSearchTerm, itemsPerPage) => {
  let apiPath = `${ApiPaths.Path_Front_CinemaHalls}?PageNumber=${page}&PageSize=${itemsPerPage}`;
  if (debouncedSearchTerm) {
    apiPath += `&SearchKeyword=${debouncedSearchTerm}`;
  }
  const response = await axiosInstance
    .get(apiPath)
    .then((response) => {
      let responseData = response.data;
      if (responseData.isSuccess) return response.data.data;
      else throw new Error("Something went wrong");
    })
    .catch((err) => {
      throw new Error(err);
    });
  const totalData = response.totalItems;
  const data = response.items;
  return {
    cinemaHall: data,
    totalData,
  };
};

const CinemaHall = ({
  search = "",
  showFilters = true,
  showBackButton = true,
  itemsPerPage = 38,
  className,
}) => {
  const [searchCinemaHalls, setSearchCinemaHalls] = useState(search);
  const debouncedSearchTerm = useDebouncedState(searchCinemaHalls, 500);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setSearchCinemaHalls(search);
  }, [search]);

  const { isLoading, data, isError, isFetching, isPreviousData, error } =
    useQuery({
      queryKey: [
        "CinemaHall" + currentPage,
        "searchCinemaHall" + debouncedSearchTerm,
      ],
      queryFn: () =>
        getCinemaHallList(currentPage, debouncedSearchTerm, itemsPerPage),
      keepPreviousData: true,
    });
  return (
    <main
      className={cn(
        "flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-background p-4 md:gap-8 md:p-10",
        className,
      )}
    >
      <div className="relative ">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center justify-start gap-6">
            {showBackButton && (
              <NavLink to={Paths.Route_Home}>
                <Button variant="outline" size="icon" className="h-8 w-8 text-primary">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </NavLink>
            )}

            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight md:text-5xl text-primary">
                Cinema Halls
              </h2>
            </div>
          </div>
          <form
            className={cn(
              "ml-auto flex-1 sm:flex-initial",
              showFilters ? "visible" : "hidden",
            )}
          >
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                value={searchCinemaHalls}
                onChange={(e) => {
                  setSearchCinemaHalls(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search cinema halls..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] border-primary"
              />
            </div>
          </form>
        </div>
        <Separator className="my-4" />
        {isLoading ? (
          <CommonAlertBanner
            type="Loader"
            className={search ? "" : "min-h-[38rem]"}
          />
        ) : isError ? (
          <CommonAlertBanner
            type="Error"
            className={search ? "" : "min-h-[38rem]"}
          />
        ) : isFetching ? (
          <CommonAlertBanner
            type="Loader"
            label="Fetching data"
            className={search ? "" : "min-h-[38rem]"}
          />
        ) : data.cinemaHall?.length === 0 ? (
          <CommonAlertBanner
            type="NoData"
            message="No cinema hall found."
            className={search ? "" : "min-h-[38rem]"}
          />
        ) : (
          <div className="">
            <div className="grid gap-8  p-4 md:grid-cols-2 lg:grid-cols-3">
              {data.cinemaHall.map((movie) => (
                <div
                  key={"cinema-hall-" + movie.id}
                  className="flex flex-row items-center space-x-3 "
                >
                  <CircleIcon className="h-1.5 w-1.5 fill-foreground " />
                  <div className="">
                    <h3 className="text-md font-bold ">{movie.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {movie.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 py-4">
              <SimplePagination
                currentPage={currentPage}
                totalItems={data.totalData}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => setCurrentPage(page)}
                isPreviousData={isPreviousData}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default CinemaHall;
