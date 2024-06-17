import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTruncatedElement } from "@/hooks/useTruncatedElement";
import { cn } from "@/lib/utils";
import {
  CircleIcon,
  Facebook,
  Globe,
  Instagram,
  LoaderCircle,
  Twitter,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import InfoCardWithImage from "../../InfoCardWithImage";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Paths } from "@/constants/routePaths";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiPaths } from "@/constants/apiPaths";
import axiosInstance from "@/helpers/axiosSetup";
import Image from "@/components/common/Image";
import { TwitterLogoIcon } from "@radix-ui/react-icons";
import CelebQrCard from "../../CelebQrCard";
import { useAuthContext } from "@/components/admin/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const gender = {
  0: "Female",
  1: "Male",
  2: "Other",
};

const getCelebrityDetail = async (movieId) => {
  let apiPath = `${ApiPaths.Path_Front}/${movieId}/crew-details`;
  const response = await axiosInstance
    .get(apiPath)
    .then((response) => {
      console.log(response.data);
      return response.data.data;
    })
    .catch((err) => console.error(err));
  return {
    celebrity: response,
  };
};

const CelebritiesDetails = () => {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const [celebDetails, setCelebsDetails] = useState({});
  const { isAuthorized, userInfo } = useAuthContext();
  const [isCardRequestInProgress, setIsCardRequestInProgress] = useState(false);
  const { toast } = useToast();
  const ref = useRef(null);
  const { isTruncated, isShowingMore, toggleIsShowingMore } =
    useTruncatedElement({
      ref,
      params: celebDetails,
    });
  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sendCardRequest = async () => {
    setIsCardRequestInProgress(true);
    let apiPath = ApiPaths.Path_RequestCard;
    const response = await axiosInstance
      .post(apiPath)
      .then((response) => {
        setIsCardRequestInProgress(false);
        console.log(response.data);
        return response.data.data;
      })
      .catch((err) => {
        setIsCardRequestInProgress(false);
        throw err;
      });
    return response;
  };

  const mutateCardRequest = useMutation({
    mutationFn: sendCardRequest,
    onSuccess: (data, variables, context) => {},
    onError: (error, variables, context) => {
      toast({ description: "Something went wrong.Please try again." });
    },
    onSettled: (data, error, variables, context) => {},
  });

  const getFromCache = (key) => {
    return queryClient.getQueryData([key]);
  };
  const { isLoading, data, isError, isFetching, isPreviousData, error } =
    useQuery({
      queryKey: [`celebrity_id_${slug}`],
      queryFn: async () => {
        const cache = getFromCache(`celebrity_id_${slug}`); // try to access the data from cache
        if (cache) {
          console.log("cached", cache);
          setCelebsDetails(cache.celebrity);
          return cache;
        } // use the data if in the cache
        const dat = await getCelebrityDetail(slug);
        setCelebsDetails(dat.celebrity);
        return dat;
      },
      keepPreviousData: true,
    });
  if (isLoading || isFetching) return "Loading...";
  if (isError) return `Error: ${error}`;
  // celebDetails = data.celebrity;

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-background p-4 md:gap-8 md:p-10">
      {celebDetails && (
        <div className="grid">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-5xl font-semibold tracking-tight">
                  {celebDetails.name}
                </h2>
                <h2 className="text-2xl font-semibold tracking-tight text-muted-foreground">
                  {celebDetails.nepaliName}
                </h2>
              </div>
              <div className="flex space-x-2">
                {/* <span className="font-semibold">Languages:</span> */}
                <ul className="flex space-x-4">
                  {celebDetails.designations?.map((genre, index) => (
                    <li
                      key={"celeb-designations-" + index}
                      className="flex flex-row items-center space-x-2"
                    >
                      <CircleIcon className="h-1.5 w-1.5 fill-foreground " />
                      <p className="text-sm text-muted-foreground">
                        {genre.roleName}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isAuthorized &&
                userInfo.isCrew &&
                userInfo.crewId == slug &&
                !celebDetails.hasRequestedCard && (
                  <Button
                    disabled={isCardRequestInProgress}
                    onClick={mutateCardRequest.mutate}
                  >
                    {isCardRequestInProgress && (
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Request Your Card
                  </Button>
                )}
              <CelebQrCard
                url={window.location.origin + pathname}
                details={celebDetails}
              />
            </div>
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-[3fr,minmax(0,10fr)]">
            <div className="grid grid-cols-1 content-start gap-4 md:grid-cols-[1fr,1fr] md:gap-6 lg:grid-cols-1">
              <Image
                src={celebDetails.profilePhotoUrl}
                alt={celebDetails.name}
                className="aspect-[3/4] h-auto w-full rounded-lg object-cover transition-all"
              />
              <div className="flex flex-1 flex-col gap-4 ">
                <div className="flex flex-row space-x-4">
                  {celebDetails.facebookID && (
                    <a
                      href={celebDetails.facebookID}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "p-2",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  )}
                  {celebDetails.twitterID && (
                    <a
                      href={celebDetails.twitterID}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "p-2",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TwitterLogoIcon className="h-5 w-5" />
                    </a>
                  )}
                  {celebDetails.officialSite && (
                    <a
                      href={celebDetails.officialSite}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "p-2",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="text-2xl font-bold leading-none">
                    Personal Info
                  </h3>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold leading-none">Gender</h3>
                    <p className=" text-muted-foreground">
                      {gender[Number(celebDetails.gender)]}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold leading-none">
                      Date of birth
                    </h3>
                    <p className=" text-muted-foreground">
                      {celebDetails.dateOfBirthInBS}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold leading-none">
                      Place of Birth
                    </h3>
                    <p className=" text-muted-foreground">
                      {celebDetails.birthPlace}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 md:gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold ">Biography</h3>
                <p
                  ref={ref}
                  className={cn(
                    "text-muted-foreground",
                    isShowingMore ? "line-clamp-none" : "line-clamp-5",
                  )}
                  dangerouslySetInnerHTML={{ __html: celebDetails.biography }}
                >
                  {/* {celebDetails.biography || "No biography available"} */}
                </p>
                {isTruncated && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={toggleIsShowingMore}
                  >
                    {isShowingMore ? "View Less" : "Read More"}
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold ">Known for</h3>
                <div className="relative ">
                  <ScrollArea>
                    <div className="flex space-x-4 pb-4">
                      {celebDetails.movies &&
                        celebDetails.movies
                          ?.slice(0, 12)
                          .map((movie) => (
                            <InfoCardWithImage
                              key={"known-for-movie-" + movie.id}
                              title={movie.name}
                              imgPath={movie.thumbnailImagePath}
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
              <div className="space-y-4">
                <h3 className="text-2xl font-bold ">Filmography</h3>
                <div className="rounded-lg border border-input p-1">
                  <ScrollArea viewPortClass="max-h-[620px]">
                    <div className="grid gap-8  p-4 md:grid-cols-2 lg:grid-cols-3">
                      {celebDetails.movies.map((movie) => (
                        <div
                          key={"flimography-" + movie.id}
                          className="flex flex-row items-center space-x-3 "
                        >
                          <CircleIcon className="h-1.5 w-1.5 fill-foreground " />
                          <div className="">
                            <NavLink to={Paths.Route_Movies + "/" + movie.id}>
                              <h3 className="text-md font-bold ">
                                {movie.name}
                              </h3>
                            </NavLink>
                            <p className="text-xs text-muted-foreground">
                              {movie.releaseDateBS}
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
        </div>
      )}
    </main>
  );
};

export default CelebritiesDetails;
