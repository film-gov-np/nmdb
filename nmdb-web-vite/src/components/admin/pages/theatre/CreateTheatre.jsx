import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AddPageHeader from "../../AddPageHeader";
import { Paths } from "@/constants/routePaths";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "@/helpers/axiosSetup";
import { FormSkeleton } from "@/components/ui/custom/skeleton/form-skeleton";
import { ApiPaths } from "@/constants/apiPaths";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Theatre name must be at least 2 characters.",
  }),
  contactNumber: z.string().min(6, {
    message: "Contact number must be at least 6 characters.",
  }),
  establishedDate: z.date().refine(
    (date) => {
      return date < new Date();
    },
    {
      message: "Established date must be in the past.",
    },
  ),
  seatCapacity: z.coerce.number().positive(),
  numberOfScreen: z.coerce.number().positive(),
  websiteUrl: z.string().url(),
  email: z.string().email(),
  contactPerson: z.string().min(1),
  address: z.string().min(1),
  remarks: z.string(),
  isRunning: z.enum(["true", "false"]).transform((value) => value === "true"),
});

const defaultValues = {
  address: "",
  contactNumber: "",
  contactPerson: "",
  email: "",
  establishedDate: "",
  isRunning: "",
  name: "",
  numberOfScreen: 0,
  remarks: "",
  websiteUrl: "",
  seatCapacity: 0,
};

const renderModes = {
  Render_Mode_Create: "create",
  Render_Mode_Edit: "edit",
  Render_Mode_Details: "details",
};

const getTheatre = async (id, renderMode) => {
  let apiPath = `${ApiPaths.Path_Theatres}/${id}`;
  let data = {};
  if (renderMode === renderModes.Render_Mode_Create) return defaultValues;
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

const createOrEditTheatre = async ({ postData, isEditMode, slug, toast }) => {
  let apiPath = ApiPaths.Path_Theatres;
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

const CreateTheatre = () => {
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
      queryKey: ["theatreDetail"],
      queryFn: () => getTheatre(slug, renderMode),
      keepPreviousData: true,
    });

  const mutateTheatre = useMutation({
    mutationFn: createOrEditTheatre,
    onSuccess: (data, variables, context) => {
      navigate(Paths.Route_Admin_Theatre);
    },
    onError: (error, variables, context) => {
      toast({ description: "Something went wrong.Please try again." });
    },
    onSettled: (data, error, variables, context) => {
      // queryClient.invalidateQueries("theatreDetail");
    },
  });

  const onSubmit = (data) => {
    console.log("submitted", data);
    mutateTheatre.mutate({
      postData: data,
      isEditMode: renderMode === renderModes.Render_Mode_Edit,
      slug,
      toast,
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
      <AddPageHeader label="theatre" pathTo={Paths.Route_Admin_Theatre} />
      {isLoading || isFetching ? (
        <FormSkeleton columnCount={2} rowCount={6} repeat={1} shrinkZero />
      ) : (
        data && (
          <TheatreForm
            theatre={data}
            renderMode={renderMode}
            onSubmit={onSubmit}
          />
        )
      )}
    </main>
  );
};

function TheatreForm({ theatre, renderMode, onSubmit }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {...theatre, isRunning: theatre.isRunning.toString()},
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-8">
          <fieldset
            disabled={renderMode === renderModes.Render_Mode_Details}
            className="grid grid-cols-1 gap-2 rounded-lg border p-4 md:grid-cols-2 md:gap-4 lg:gap-6"
          >
            <legend className="-ml-1 px-1 text-lg font-medium text-muted-foreground">
              Create Theatre
            </legend>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Theatre Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Theatre name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="seatCapacity"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Seat Capacity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Seat Capacity"
                      min={0}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfScreen"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Number of Screen</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Number of Screen"
                      min={0}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Contact Person Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Contact Person Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Contact Person Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Contact Person Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Contact Person Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Contact Person Numbers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="establishedDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Established Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Website URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Remarks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isRunning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Running?</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.defaultValue?.toString()}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Is the theater running?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
        </div>
        {renderMode !== renderModes.Render_Mode_Details && (
          <Button type="submit">Submit</Button>
        )}
      </form>
    </Form>
  );
}
export default CreateTheatre;
