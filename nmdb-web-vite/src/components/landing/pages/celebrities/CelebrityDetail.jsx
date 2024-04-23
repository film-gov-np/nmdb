import QrCodeGenerator from "@/components/common/QrCodeGenerator";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTruncatedElement } from "@/hooks/useTruncatedElement";
import { cn } from "@/lib/utils";
import axios from "axios";
import { CircleIcon, Facebook, Instagram, Twitter } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import InfoCardWithImage from "../../InfoCardWithImage";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Paths } from "@/constants/routePaths";

const gender = {
  1: "Female",
  2: "Male",
};

const CelebritiesDetails = () => {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const [celebDetails, setCelebsDetails] = useState({});
  const ref = useRef(null);
  const { isTruncated, isShowingMore, toggleIsShowingMore } =
    useTruncatedElement({
      ref,
      params: celebDetails,
    });
  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(
        `https://api.themoviedb.org/3/person/${slug}?append_to_response=combined_credits&language=en-US`,
        {
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZWQzN2IzZTg2NjNlOTU4ZTEwMDc1OGM2NTI4ODFhNyIsInN1YiI6IjY2MjYzNzMzN2E5N2FiMDE2MzhkNWQ1ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.5GUH1UisCLdYilrhHLQPDWyPLyifw6GWhcloNhzEptM",
          },
        },
      )
      .then((res) => {
        console.log(res);
        setCelebsDetails(res.data);
      })
      .catch((err) => console.error(err));
  }, []);
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-background p-4 md:gap-8 md:p-10">
      {celebDetails && (
        <div className="grid">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-5xl font-semibold tracking-tight">
                {celebDetails.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {celebDetails.known_for_department}
              </p>
            </div>
            <QrCodeGenerator
              url={window.location.origin + pathname}
              details={celebDetails}
            />
          </div>
          <Separator className="my-4" />
          <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-[3fr,minmax(0,10fr)]">
            <div className="grid grid-cols-1 content-start gap-4 md:grid-cols-[1fr,1fr] md:gap-6 lg:grid-cols-1">
              <img
                src={
                  celebDetails.profile_path
                    ? "https://image.tmdb.org/t/p/w500/" + celebDetails.profile_path
                    : "/placeholder.svg"
                }
                alt={celebDetails.name}
                className="aspect-[3/4] h-auto w-full rounded-lg object-cover transition-all"
                onError={(e)=>(e.target.src="/placeholder.svg")}
              />
              <div className="flex flex-1 flex-col gap-4 ">
                <div className="flex flex-row space-x-4">
                  <Button variant="outline" size="sm" className="p-2">
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="sm" className="p-2">
                    <Instagram className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="sm" className="p-2">
                    <Twitter className="h-5 w-5" />
                  </Button>
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
                      {celebDetails.birthday}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold leading-none">
                      Place of Birth
                    </h3>
                    <p className=" text-muted-foreground">
                      {celebDetails.place_of_birth}
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
                >
                  {celebDetails.biography}
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
                      {celebDetails?.combined_credits?.cast &&
                        celebDetails?.combined_credits?.cast
                          ?.slice(0, 12)
                          .map((cast) => (
                            <InfoCardWithImage
                              key={"cast" + (cast.title || cast.name)}
                              title={cast.title || cast.name}
                              imgPath={cast.poster_path}
                              className="w-[150px]"
                              aspectRatio="portrait"
                              width={150}
                              height={210}
                            />
                          ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold ">Filmography</h3>
                <div className="grid gap-8 rounded-lg border border-input p-4 md:grid-cols-2 lg:grid-cols-3 line-clamp-5">
                  {celebDetails?.combined_credits?.cast.map((cast) => (
                    <div
                      key={"flimography" + (cast.title || cast.name)}
                      className="flex flex-row items-center space-x-3 "
                    ><CircleIcon className="h-1.5 w-1.5 fill-foreground " />
                      <div className="" >
                        <NavLink to={Paths.Route_Movies + "/" + cast.id}>
                          <h3 className="text-md font-bold ">
                            {cast.title || cast.name}
                          </h3>
                        </NavLink>
                        <p className="text-xs text-muted-foreground">
                          {cast.release_date || cast.first_air_date}
                        </p>
                      </div>
                    </div>
                  ))}
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
