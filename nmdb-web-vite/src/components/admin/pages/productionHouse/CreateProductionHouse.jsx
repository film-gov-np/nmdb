import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sanitizeData } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AddPageHeader from "../../AddPageHeader";
import { Paths } from "@/constants/routePaths";
import { ApiPaths } from "@/constants/apiPaths";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FormSkeleton } from "@/components/ui/custom/skeleton/form-skeleton";
import axiosInstance from "@/helpers/axiosSetup";
import DatePickerForForm from "@/components/common/formElements/DatePicker";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  nepaliName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  address: z.string(),
  chairmanName: z.string(),
  contactPerson: z.string().min(2, {
    message: "Contact person name must be at least 2 characters.",
  }),
  contactNumber: z
    .string()
    .regex(/^\+?[0-9\- ]+$/, "Invalid phone number format")
    .min(6, {
      message: "Contact number must be at least 6 characters.",
    })
    .max(15, {
      message: "Contact number must not exceed 15 characters.",
    }),
  establishedDate: z
    .date()
    .or(z.string())
    .refine(
      (date) => {
        return date < new Date();
      },
      {
        message: "Established date must be in the past.",
      },
    ),
  isRunning: z.enum(["true", "false"]).transform((value) => value === "true"),
});

const defaultValues = {
  name: "",
  nepaliName: "",
  address: "",
  chairmanName: "",
  contactPerson: "",
  contactNumber: "",
  establishedDate: "",
  isRunning: "true",
};

const getPrductionHouse = async (id, renderMode) => {
  if (renderMode === renderModes.Render_Mode_Create) return defaultValues;
  let apiPath = `${ApiPaths.Path_ProductionHouse}/${id}`;
  let data = {};
  const apiResponse = await axiosInstance
    .get(apiPath)
    .then((response) => {
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

const createOrEditProductionHouse = async ({
  postData,
  isEditMode,
  slug,
  toast,
  setError,
}) => {
  let apiPath = ApiPaths.Path_ProductionHouse;
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
      toast({
        description:
          response.data?.message || "Successfully completed the action.",
        duration: 5000,
      });
      return response.data;
    })
    .catch((err) => {
      const response = err.response?.data;
      const errors = response?.errors;
      if (errors) {
        for (const [field, message] of Object.entries(errors)) {
          setError(field.charAt(0).toLowerCase() + field.slice(1), {
            type: "server",
            message: message[0],
          });
        }
      }
      console.error(err);
    });
  return data;
};

const renderModes = {
  Render_Mode_Create: "create",
  Render_Mode_Edit: "edit",
  Render_Mode_Details: "details",
};

const CreateProductionHouse = () => {
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
      queryKey: ["productionHouseDetail"],
      queryFn: () => getPrductionHouse(slug, renderMode),
      keepPreviousData: true,
    });

  const mutateProductionHouse = useMutation({
    mutationFn: async (data) => {
      await createOrEditProductionHouse({
        postData: data.postData,
        isEditMode: renderMode === renderModes.Render_Mode_Edit,
        slug,
        toast,
        setError: data.setError,
      });
    },
    onSuccess: (data, variables, context) => {
      navigate(Paths.Route_Admin_ProductionHouse);
    },
    onError: (error, variables, context) => {
      toast({
        description:
          "Something went wrong.Please check your form and try again.",
      });
    },
    onSettled: (data, error, variables, context) => {
      // queryClient.invalidateQueries("theatreDetail");
    },
  });

  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
      <AddPageHeader
        label="production house"
        pathTo={Paths.Route_Admin_ProductionHouse}
        renderMode={renderMode}
      />
      {isLoading || isFetching ? (
        <FormSkeleton columnCount={3} rowCount={2} repeat={2} shrinkZero />
      ) : (
        data && (
          <ProductionHouseForm
            productionHouse={data}
            renderMode={renderMode}
            mutateProductionHouse={mutateProductionHouse}
          />
        )
      )}
    </main>
  );
};

function ProductionHouseForm({
  productionHouse,
  renderMode,
  mutateProductionHouse,
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: sanitizeData({
      ...productionHouse,
      isRunning: productionHouse.isRunning.toString(),
    }),
  });
  const onSubmit = (data) => {
    mutateProductionHouse.mutate({
      postData: data,
      setError: form.setError,
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8">
          <fieldset
            disabled={renderMode === renderModes.Render_Mode_Details}
            className="grid grid-cols-1 gap-2 rounded-lg border p-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-6"
          >
            <legend className="-ml-1 px-1 text-lg font-medium text-muted-foreground">
              Production House
            </legend>
            {/* <FormField
                control={form.control}
                name="frameworks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frameworks</FormLabel>
                    <FormControl>
                      <MultipleSelectorWithList
                        value={field.value}
                        onChange={field.onChange}
                        defaultOptions={OPTIONS}
                        placeholder="Select frameworks you like..."
                        emptyIndicator={
                          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                            no results found.
                          </p>
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name(in english)</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nepaliName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name(in nepali)</FormLabel>
                  <FormControl>
                    <Input placeholder="Name in nepali" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="chairmanName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chairman Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name of the chairman" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="establishedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Established Date</FormLabel>
                  <DatePickerForForm field={field} />
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
                        <SelectValue placeholder="Is the production house running?" />
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
          <fieldset
            disabled={renderMode === renderModes.Render_Mode_Details}
            className="grid grid-cols-1 gap-2 rounded-lg border p-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-6"
          >
            <legend className="-ml-1 px-1 text-lg font-medium text-muted-foreground">
              Contact Person Information
            </legend>
            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact person name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact person number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
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

export default CreateProductionHouse;
