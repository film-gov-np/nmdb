import AddPageHeader from "../../AddPageHeader";
import { Paths } from "@/constants/routePaths";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import FormBasicInfo from "./forms/FormBasicInfo";
import FormCensorInfo from "./forms/FormCensorInfo";
import FormRoleInfo from "./forms/FormRoleInfo";
import { defaultValues, resolver } from "./forms/formSchema";
import FormTheatreInfo from "./forms/FormTheatreInfo";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiPaths } from "@/constants/apiPaths";
import { FormSkeleton } from "@/components/ui/custom/skeleton/form-skeleton";
import { zodResolver } from "@hookform/resolvers/zod";

const getMovie = async (id, renderMode) => {
  if (renderMode === renderModes.Render_Mode_Create) return defaultValues;
  let apiPath = `${ApiPaths.Path_ProductionHouse}/${id}`;
  let data = {};
  const apiResponse = await axiosInstance
    .get(apiPath)
    .then((response) => {
      console.log("api-response", response.data);
      return response.data;
    })
    .catch((err) => console.error(err));

  if (apiResponse?.isSuccess && Number(apiResponse?.statusCode) === 200)
    // conversion is required as establishedDate response is of type string
    // it is stored in BS
    apiResponse.data.establishedDate = new Date(
      apiResponse.data.establishedDate,
    );
  data = apiResponse.data;
  return data;
};

const createOrEditMovie = async ({
  postData,
  isEditMode,
  slug,
  toast,
}) => {
  let apiPath = ApiPaths.Path_Movies;
  if (isEditMode) {
    apiPath += "/" + slug;
    postData.id = slug;
  }
  const { data } = await axiosInstance({
    method: isEditMode ? "put" : "post",
    url: apiPath,
    data: postData,
  })
    .then((response) => {
      console.log("api-response-categories", response);
      toast({
        description:
          response.data?.message || "Successfully completed the action.",
        duration: 5000,
      });
      return response.data;
    })
    .catch((err) => console.error(err));
  return data;
};

const renderModes = {
  Render_Mode_Create: "create",
  Render_Mode_Edit: "edit",
  Render_Mode_Details: "details",
};

const AddMovie = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { pathname } = useLocation();
  const pathArray = pathname.split("/").filter((item) => item !== "");
  let renderMode = null;
  if (pathArray.includes(renderModes.Render_Mode_Create))
    renderMode = renderModes.Render_Mode_Create;
  else if (pathArray.includes(renderModes.Render_Mode_Edit) && slug)
    renderMode = renderModes.Render_Mode_Edit;
  else renderMode = renderModes.Render_Mode_Details;

  const { toast } = useToast();
  const { isLoading, data, isError, isFetching, isPreviousData, error } =
    useQuery({
      queryKey: ["MovieDetail"],
      queryFn: () => getMovie(slug, renderMode),
      keepPreviousData: true,
    });

  const mutateMovie = useMutation({
    mutationFn: createOrEditMovie,
    onSuccess: (data, variables, context) => {
      navigate(Paths.Route_Admin_Movies);
    },
    onError: (error, variables, context) => {
      debugger;
      toast({ description: "Something went wrong.Please try again." });
    },
    onSettled: (data, error, variables, context) => {
      // queryClient.invalidateQueries("theatreDetail");
    },
  });

  const onSubmit = (data) => {
    console.log("submitted", data);
    // mutateProductionHouse.mutate({
    //   postData: data,
    //   isEditMode: renderMode === renderModes.Render_Mode_Edit,
    //   slug,
    //   toast,
    // });
    toast({
      title: "You submitted the following values:",
      description: (
        <ScrollArea className="h-96">
          <pre className="mt-2 w-[440px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        </ScrollArea>
      ),
    });
  };

  const form = useForm({
    // resolver,
    defaultValues,
  });


  return (
<main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
      <AddPageHeader
        label="production house"
        pathTo={Paths.Route_Admin_Movie}
      />
      {isLoading || isFetching ? (
        <FormSkeleton columnCount={3} rowCount={2} repeat={2} shrinkZero />
      ) : (
        data && (
          <MovieForm
            movie={data}
            renderMode={renderMode}
            onSubmit={onSubmit}
          />
        )
      )}
    </main>
  );
};

function MovieForm({ movie, renderMode, onSubmit }) {
  const form = useForm({
    resolver,
    defaultValues: movie,
  });
  const [previews, setPreviews] = useState([]);

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" disabled={renderMode === renderModes.Render_Mode_Details}>
          <Tabs className="w-full" defaultValue="basic_information">
            <TabsList className="grid h-full min-h-fit w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              <TabsTrigger value="basic_information">Basic Info</TabsTrigger>
              <TabsTrigger value="crew_information">Crew Info</TabsTrigger>
              <TabsTrigger value="censor_information">Censor Info</TabsTrigger>
              <TabsTrigger value="theater_information">
                Theater Info
              </TabsTrigger>
              <TabsTrigger value="role_information">Role Info</TabsTrigger>
            </TabsList>
            <div className="mt-4 rounded-md border border-input">
              <ScrollArea
                className="py-2"
                viewPortClass="max-h-[calc(100vh-100px)]"
              >
                <TabsContent value="basic_information" className="h-full ">
                  <FormBasicInfo
                    form={form}
                    previews={previews}
                    setPreviews={setPreviews}
                  />
                </TabsContent>
                <TabsContent value="crew_information">
                  <div className="grid min-h-[60vh] grid-cols-1 gap-4 px-4 py-2 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="censor_information" className="h-full">
                  <FormCensorInfo form={form} />
                </TabsContent>
                <TabsContent value="theater_information" className="h-full">
                  <FormTheatreInfo form={form} />
                </TabsContent>
                <TabsContent value="role_information" className="h-full">
                  <FormRoleInfo form={form} />
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
  );
}

export default AddMovie;