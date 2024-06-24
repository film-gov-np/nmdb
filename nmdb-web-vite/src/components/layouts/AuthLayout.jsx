import { NavLink, Outlet } from "react-router-dom";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import Image from "../common/Image";
import axiosInstance from "@/helpers/axiosSetup";
import { useQuery } from "@tanstack/react-query";
import { ApiPaths } from "@/constants/apiPaths";

const getLatestRelease = async () => {
  let apiPath = `${ApiPaths.Path_Front_Movies}?SortColumn=ReleaseDate&Descending=true&PageNumber=1&PageSize=1`;
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
  debugger;
  const totalData = response.totalItems;
  const data = response.items;
  return {
    movies: data,
    totalData,
  };
};

const AuthLayout = () => {
  const { isLoading, data, isError, isFetching, isPreviousData, error } =
    useQuery({
      queryKey: ["movies-latest-released"],
      queryFn: getLatestRelease,
      keepPreviousData: true,
    });
  let imgPath = "";
  if (isError || isLoading || isFetching) imgPath = "/placeholder.png";
  else imgPath = data?.movies[0].thumbnailImageUrl;
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="fixed inset-y-0 p-8">
        <NavLink to={""}>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </NavLink>
      </div>
      <div className=" theme-zinc h-full w-full">
        <div className="flex min-h-screen w-full flex-col">
          <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <Outlet />
            <div className="hidden justify-end bg-transparent lg:flex lg:h-screen">
              <Image
                src={imgPath}
                alt="Image"
                width="1920"
                height="1080"
                className="h-full w-full object-cover object-center dark:brightness-[0.4] lg:max-w-3xl xl:max-w-4xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
