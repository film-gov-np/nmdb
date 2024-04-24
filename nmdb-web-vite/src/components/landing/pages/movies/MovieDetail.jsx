import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Circle, CircleIcon } from "lucide-react";
import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import InfoCardWithImage from "../../InfoCardWithImage";
import { Paths } from "@/constants/routePaths";

const getMovie = async (movieId) => {
  let apiPath = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
  const response = await axios
    .get(apiPath, {
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZWQzN2IzZTg2NjNlOTU4ZTEwMDc1OGM2NTI4ODFhNyIsInN1YiI6IjY2MjYzNzMzN2E5N2FiMDE2MzhkNWQ1ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5GUH1UisCLdYilrhHLQPDWyPLyifw6GWhcloNhzEptM",
      },
    })
    .catch((err) => console.error(err));
  const data = response.data;
  return {
    movie: data,
  };
};

const MovieDetail = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const [queryId, setQueryId] = useState("1");

  const getFromCache = (key) => {
    return queryClient.getQueryData([key]);
  };
  const { isLoading, data, isError, isFetching, isPreviousData, error } =
    useQuery({
      queryKey: [`movie_id_${slug}`],
      queryFn: async () => {
        const cache = getFromCache(`movie_id_${slug}`); // try to access the data from cache
        if (cache) {
          console.log("cached", cache);
          return cache;
        } // use the data if in the cache
        return await getMovie(slug);
      },
      keepPreviousData: true,
    });

  const topCastData = useQuery({
    queryKey: [`topCast`],
    queryFn: async () => {
      const response = await axios
        .get(
          `https://api.themoviedb.org/3/movie/${slug}/credits?sort_by=order.desc&language=en-US`,
          {
            headers: {
              accept: "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZWQzN2IzZTg2NjNlOTU4ZTEwMDc1OGM2NTI4ODFhNyIsInN1YiI6IjY2MjYzNzMzN2E5N2FiMDE2MzhkNWQ1ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5GUH1UisCLdYilrhHLQPDWyPLyifw6GWhcloNhzEptM",
            },
          },
        )
        .catch((err) => console.error(err));
      const data = response.data.cast;
      return {
        topCast: data,
        crew: response.data.crew,
      };
    },
    keepPreviousData: true,
  });

  if (isLoading || topCastData.isLoading) return "Loading...";
  if (isError || topCastData.isError) return `Error: ${error}`;
  const movie = data.movie;
  const topCast = topCastData.data.topCast;
  console.log(topCastData);
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-background md:gap-8">
      {movie && (
        <div className="grid grid-cols-1">
          <div
            className="flex min-h-[60vh] items-center justify-between bg-cover bg-center shadow-2xl lg:min-h-[70vh] "
            style={{
              backgroundImage: `url("https://image.tmdb.org/t/p/w500/${movie.poster_path}")`,
            }}
          >
            <div className="grid h-full w-full items-center gap-6 bg-zinc-900/50 p-4 filter backdrop-blur-lg  backdrop-grayscale backdrop-opacity-75 md:grid-cols-[3fr_5fr] md:gap-4  md:p-10 lg:grid-cols-[1fr_3fr]">
              <div className="mx-auto max-w-sm md:max-w-xs">
                <img
                  src={
                    movie.poster_path
                      ? "https://image.tmdb.org/t/p/w500/" + movie.poster_path
                      : "/placeholder.svg"
                  }
                  alt={movie.title}
                  className={cn(
                    "dark:brightness-80 max-h-full w-full rounded-lg object-contain transition-all ",
                  )}
                />
              </div>
              <div className="h-full w-full space-y-6  py-12 text-stone-200 ">
                <div className="space-y-2">
                  <h2 className="text-5xl font-semibold tracking-tight">
                    {movie.title}
                  </h2>
                  <p className="text-sm">{movie.tagline}</p>
                </div>
                <div className="flex flex-col space-y-4">
                  <ul className="flex space-x-4">
                    {movie.genres?.map((genre, index) => (
                      <li
                        key={genre + index}
                        className="flex items-center space-x-1"
                      >
                        <Circle className="h-1.5 w-1.5 fill-current " />
                        <p>{genre.name}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="flex space-x-4">
                    <div className="flex space-x-1">
                      <p className="font-semibold">Released:</p>
                      <p>{movie.release_date}</p>
                    </div>
                    <div className="flex space-x-1">
                      <p className="font-semibold">Runtime:</p>
                      <p>{movie.popularity}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 p-4 md:p-10">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold ">OverView</h3>
              <p className="text-muted-foreground">{movie.overview}</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold ">Top Cast</h3>
              <div className="relative ">
                <ScrollArea>
                  <div className="flex space-x-4 pb-4">
                    {topCast?.map((cast) => (
                      <InfoCardWithImage
                        key={"movieCast" + (cast.title || cast.name)}
                        title={cast.title || cast.name}
                        imgPath={cast.profile_path}
                        className="w-[150px]"
                        aspectRatio="portrait"
                        width={150}
                        height={210}
                        navigateTo={Paths.Route_Celebrities + "/" + cast.id}
                      />
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            </div>
            <div className="space-y-4">
                <h3 className="text-2xl font-bold ">All Crew Members</h3>
                <div className="rounded-lg border border-input p-1">
                  <ScrollArea viewPortClass="max-h-[680px]">
                    <div className="grid gap-8  p-4 md:grid-cols-2 lg:grid-cols-3">
                      {topCastData.data.crew.map((crew) => (
                        <div
                          key={"crews" + ( crew.name)}
                          className="flex flex-row items-center space-x-3 "
                        >
                          <CircleIcon className="h-1.5 w-1.5 fill-foreground " />
                          <div className="">
                            <NavLink to={Paths.Route_Movies + "/" + crew.id}>
                              <h3 className="text-md font-bold ">
                                { crew.name}
                              </h3>
                            </NavLink>
                            <p className="text-xs text-muted-foreground">
                              {crew.known_for_department}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </div>
              </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MovieDetail;
