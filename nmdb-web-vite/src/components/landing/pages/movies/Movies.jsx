import { Paths } from "@/constants/routePaths";
import { useEffect, useState } from "react";
import InfoCardWithImage from "../../InfoCardWithImage";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import SimplePagination from "@/components/common/SimplePagination";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/helpers/axiosSetup";
import { ApiPaths } from "@/constants/apiPaths";
import { cn } from "@/lib/utils";
import CommonAlertBanner from "../../CommonAlertBanner";

const getCelebList = async (page, debouncedSearchTerm, itemsPerPage) => {
  let apiPath = `${ApiPaths.Path_Front_Movies}?PageNumber=${page}&PageSize=${itemsPerPage}`;
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
    movies: data,
    totalData,
  };
};

const Movies = ({
  search = "",
  showFilters = true,
  showBackButton = true,
  itemsPerPage = 25,
  className,
}) => {
  const [searchMovies, setSearchMovies] = useState(search);
  const debouncedSearchTerm = useDebouncedState(searchMovies, 500);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    setSearchMovies(search);
  }, [search]);

  const { isLoading, data, isError, isFetching, isPreviousData, error } =
    useQuery({
      queryKey: ["movies" + currentPage, "searchMovies" + debouncedSearchTerm],
      queryFn: () =>
        getCelebList(currentPage, debouncedSearchTerm, itemsPerPage),
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
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-primary"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
              </NavLink>
            )}

            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-primary md:text-5xl">
                Movies
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
                value={searchMovies}
                onChange={(e) => {
                  setSearchMovies(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search movies..."
                className="border-primary pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
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
        ) : data.movies?.length === 0 ? (
          <CommonAlertBanner
            type="NoData"
            message="No movies found."
            className={search ? "" : "min-h-[38rem]"}
          />
        ) : (
          <div className="">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 lg:gap-6 xl:grid-cols-9">
              {data?.movies.map((movie) => (
                <InfoCardWithImage
                  key={"movie-list-" + movie.id}
                  title={movie.name}
                  description={movie.status}
                  imgPath={movie.thumbnailImageUrl}
                  className=""
                  aspectRatio="portrait"
                  width={220}
                  height={280}
                  navigateTo={Paths.Route_Movies + "/" + movie.id}
                  forceReload= {!showFilters}
                />
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

export default Movies;
