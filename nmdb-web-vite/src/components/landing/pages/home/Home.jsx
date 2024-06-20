import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Paths } from "@/constants/routePaths";
import { cn } from "@/lib/utils";
import { useQueries } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import InfoCardWithImage from "../../InfoCardWithImage";
import { ApiPaths } from "@/constants/apiPaths";
import axiosInstance from "@/helpers/axiosSetup";
import Image from "@/components/common/Image";
import CommonAlertBanner from "../../CommonAlertBanner";

const getMovies = async (apiPath) => {
  const response = await axiosInstance
    .get(apiPath)
    .then((response) => {
      debugger
      let responseData = response.data;
      if (responseData.isSuccess) return response.data.data;
      else throw new Error("Something went wrong");
    })
    .catch((err) => {
      throw new Error("Something went wrong");
    });
  const totalData = response.totalItems;
  const data = response.items;
  return {
    movies: data,
    totalData,
  };
};

const Home = () => {
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  const results = useQueries({
    queries: [
      {
        queryKey: ["nowPlayingMovies"],
        queryFn: () => getMovies(ApiPaths.Path_Front_Movies),
        keepPreviousData: true,
      },
      {
        queryKey: ["trendingMovies"],
        queryFn: () => getMovies(ApiPaths.Path_Front_Movies),
        keepPreviousData: true,
      },
      {
        queryKey: ["topRatedMovies"],
        queryFn: () => getMovies(ApiPaths.Path_Front_Movies),
        keepPreviousData: true,
      },
      {
        queryKey: ["popularArtists"],
        queryFn: () => getMovies(ApiPaths.Path_Front_Celebrities),
        keepPreviousData: true,
      },
    ],
  });

  const isLoading = results.some((query) => query.isLoading);
  const isError = results.some((query) => query.isError);
  if (isLoading) return <CommonAlertBanner type="Loader" />;
  if (isError) return <CommonAlertBanner type="Error" className="m-12" />;
  const nowPlayingMovies = results[0];
  const upcomingMovies = results[1];
  const popularMovies = results[2];
  const popularArtists = results[3];

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-background p-4 md:gap-8 md:p-10">
      <div className="mx-auto grid w-full max-w-screen-2xl grid-cols-1 items-start gap-6">
        {/*  md:grid-cols-[2fr_2px_minmax(0,9fr)] */}
        {/* <aside className="hidden gap-4 py-4 md:grid">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Menu
          </h3>
          <div className="gap-4 space-y-4">
            <NavLink to={Paths.Route_Home}>
              <Button variant="ghost" className="w-full justify-start">
                <HomeIcon className="mr-2 h-4 w-4" />
                Home
              </Button>
            </NavLink>
            <NavLink to={Paths.Route_Movies}>
              <Button variant="ghost" className="w-full justify-start">
                <Film className="mr-2 h-4 w-4" />
                Movies
              </Button>
            </NavLink>
            <NavLink to={Paths.Route_Celebrities}>
              <Button variant="ghost" className="w-full justify-start">
                <Drama className="mr-2 h-4 w-4" />
                Celebrities
              </Button>
            </NavLink>
            <NavLink to="#">
              <Button variant="ghost" className="w-full justify-start">
                <CalendarDays className="mr-2 h-4 w-4" />
                Movie Calendar
              </Button>
            </NavLink>
            <NavLink to="#">
              <Button variant="ghost" className="w-full justify-start">
                <Theater className="mr-2 h-4 w-4" />
                Cinema Hall
              </Button>
            </NavLink>
          </div>
        </aside> */}

        <div className="space-y-4">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Latest Movies
          </h3>
          <Carousel
            setApi={setApi}
            className="max-w-full"
            opts={{ align: "start", dragFree: true, loop: true }}
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
          >
            <CarouselContent className="">
              {nowPlayingMovies?.data?.movies.map((movie, index) => (
                <CarouselItem
                  key={"now-playing-movie-" + index}
                  className="pl-4 sm:flex-[0_0_50%] md:flex-[0_0_35%] lg:flex-[0_0_25%] xl:flex-[0_0_18.5%]"
                >
                  <div className="">
                    <Card>
                      <CardContent className="group relative flex aspect-[7/9] items-center justify-center p-0">
                        <Image
                          src={movie.thumbnailImageUrl}
                          alt={movie.name}
                          width={500}
                          height={400}
                          className={cn(
                            "dark:brightness-80 aspect-[7/9] h-auto w-full rounded-lg object-fill transition-all",
                          )}
                        />
                        <div className="invisible absolute flex h-full w-full flex-col items-center justify-center space-y-2 rounded-lg bg-black/45 p-8 text-stone-200 group-hover:visible">
                          <NavLink to={Paths.Route_Movies + "/" + movie.id}>
                            <h3 className="text-center text-xl font-bold leading-none">
                              {movie.name}
                            </h3>
                          </NavLink>
                          <p className="text-sm font-bold text-stone-400">
                            {movie.status}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className="-right-9" />
          </Carousel>
        </div>
      </div>
      <div className="mx-auto mt-8 grid w-full max-w-screen-2xl grid-cols-1 items-start gap-6 md:grid-cols-[minmax(0,7fr)_2px_3fr] ">
        <div className="block">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Movie of the Week
            </h3>
            <div className="relative ">
              <ScrollArea>
                <div className="flex space-x-4 pb-4">
                  {popularMovies?.data?.movies.map((movie, index) => (
                    <InfoCardWithImage
                      key={"movie-of-the-week-" + index}
                      title={movie.name}
                      imgPath={movie.thumbnailImageUrl}
                      className="w-[150px]"
                      aspectRatio="portrait"
                      width={150}
                      height={210}
                      navigateTo={Paths.Route_Movies + "/" + movie.id}
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Top Artists
            </h3>
            <div className="relative ">
              <ScrollArea>
                <div className="flex space-x-4 pb-4">
                  {popularArtists?.data?.movies.map((cast, index) => (
                    <InfoCardWithImage
                      key={"top-artist-" + index}
                      title={cast.name}
                      imgPath={cast.profilePhotoUrl}
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
        </div>
        <Separator className="hidden md:grid" orientation="vertical" />
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold leading-none tracking-tight">
            Trending
          </h3>
          <Carousel
            opts={{ align: "start", dragFree: true, loop: false }}
            orientation="vertical"
            className="w-full "
          >
            <CarouselContent className="-mt-1 h-[560px]">
              {upcomingMovies.data.movies.map((movie, index) => (
                <CarouselItem
                  key={"trending-movies-" + index}
                  className="basis-1/5 pt-1"
                >
                  <div className="flex space-x-6 p-1">
                    <Image
                      src={movie.thumbnailImageUrl}
                      alt={movie.name}
                      width={80}
                      height={100}
                      className={cn(
                        "dark:brightness-80 w-100 aspect-[5/6] h-auto rounded-lg object-fill transition-all",
                      )}
                    />
                    <div className="space-y-2 ">
                      <NavLink to={Paths.Route_Movies + "/" + movie.id}>
                        <h3 className="text-lg font-semibold leading-none tracking-tight hover:underline">
                          {movie.name}
                        </h3>
                      </NavLink>

                      <p className="text-sm text-muted-foreground">
                        {movie.status}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className="-bottom-9" />
          </Carousel>
        </div>
      </div>
    </main>
  );
};

export default Home;
