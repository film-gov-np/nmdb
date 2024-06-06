import { Paths } from "@/constants/routePaths";
import axios from "axios";
import { useState } from "react";
import InfoCardWithImage from "../../InfoCardWithImage";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedState } from "@/hooks/useDebouncedState";
import SimplePagination from "@/components/common/SimplePagination";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
const ITEM_PER_PAGE = 20;

const getCelebList = async (page, debouncedSearchTerm) => {
  let apiPath = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`;
  if (debouncedSearchTerm) {
    apiPath = `https://api.themoviedb.org/3/search/movie?query=${debouncedSearchTerm}&include_adult=true&language=en-US&page=${page}`;
  }
  const response = await axios
    .get(apiPath, {
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZWQzN2IzZTg2NjNlOTU4ZTEwMDc1OGM2NTI4ODFhNyIsInN1YiI6IjY2MjYzNzMzN2E5N2FiMDE2MzhkNWQ1ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5GUH1UisCLdYilrhHLQPDWyPLyifw6GWhcloNhzEptM",
      },
    })
    .catch((err) => console.error(err));
  const totalData = response.data.total_results;
  const data = response.data.results;
  return {
    movies: data,
    totalData,
  };
};

const Movies = () => {
  const [searchMovies, setSearchMovies] = useState("");
  const debouncedSearchTerm = useDebouncedState(searchMovies, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const { isLoading, data, isError, isFetching, isPreviousData, error } =
    useQuery({
      queryKey: ["movies" + currentPage, "searchMovies" + debouncedSearchTerm],
      queryFn: () => getCelebList(currentPage, debouncedSearchTerm),
      keepPreviousData: true,
    });

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-background p-4 md:gap-8 md:p-10">
      <div className="relative ">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center justify-start gap-6">
            <NavLink to={Paths.Route_Home}>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </NavLink>
            <div className="space-y-1">
              <h2 className="text-xl md:text-5xl font-semibold tracking-tight">Movies</h2>
            </div>
          </div>

          <form className="ml-auto flex-1 sm:flex-initial">
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
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
        </div>
        <Separator className="my-4" />
        {isLoading ? (
          "Loading..."
        ) : isError ? (
          `Error: ${error.message}`
        ) : isFetching ? (
          "Fetching data..."
        ) : (
          <div className="">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 lg:gap-6 xl:grid-cols-9">
              {data?.movies.map((movie) => (
                <InfoCardWithImage
                  key={"movie" + movie.id}
                  title={movie.title || movie.name}
                  description={movie.release_date}
                  imgPath={movie.poster_path}
                  className=""
                  aspectRatio="portrait"
                  width={220}
                  height={280}
                  navigateTo={Paths.Route_Movies + "/" + movie.id}
                />
              ))}
            </div>
            <div className="py-4">
              <SimplePagination
                currentPage={currentPage}
                totalItems={data.totalData}
                itemsPerPage={ITEM_PER_PAGE}
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
