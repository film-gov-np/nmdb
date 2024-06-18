import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clapperboard, Projector, Users, Video } from "lucide-react";
import CardRequest from "../cardRequest/CardRequest";
import { CardSkeleton } from "@/components/ui/custom/skeleton/card-skeleton";
import { ApiPaths } from "@/constants/apiPaths";
import axiosInstance from "@/helpers/axiosSetup";
import { useQuery } from "@tanstack/react-query";

const getEntityCounts = async () => {
  let apiPath = `${ApiPaths.Path_Dashboard_Counts}`;
  const apiResponse = await axiosInstance
    .get(apiPath)
    .then((response) => {
      if (response.data?.isSuccess && Number(response.data?.statusCode) === 200)
        return response.data.data;
      else return {};
    })
    .catch((err) => console.error(err));
  return apiResponse;
};

const Dashboard = () => {
  const { isLoading, data, isError, isFetching, isPreviousData, error } =
    useQuery({
      queryKey: ["dashboard-entities-counts"],
      queryFn: () => getEntityCounts(),
      keepPreviousData: true,
    });

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-12 lg:p-6">
      {isLoading || isFetching ? (
        <CardSkeleton count={4} />
      ) : (
        !isError && (
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Movies</CardTitle>
                <Video className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(data.movieCount / 25) * 25} +{" "}
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p> */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Crew</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(data.crewCount / 10) * 10} +{" "}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Theatre</CardTitle>
                <Projector className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(data.theatreCount / 10) * 10} +{" "}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Production House
                </CardTitle>
                <Clapperboard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.floor(data.productionHouseCount / 10) * 10} +{" "}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      )}

      <div className=" space-y-4">
        <h2 className="text-3xl font-bold capitalize tracking-tight">
          Card Requests
        </h2>
        <CardRequest />
      </div>
    </main>
  );
};
export default Dashboard;
