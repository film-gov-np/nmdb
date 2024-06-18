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
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { z } from "zod";
import { cn, sanitizeData } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/helpers/axiosSetup";
import { FormSkeleton } from "@/components/ui/custom/skeleton/form-skeleton";
import { ApiPaths } from "@/constants/apiPaths";
import { useState } from "react";
import DateInput from "@/components/ui/custom/DateInput";
import { Textarea } from "@/components/ui/textarea";
import MultipleSelectorWithList from "@/components/ui/custom/multiple-selector/MultipleSelectionWithList";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import DatePickerForForm from "@/components/common/formElements/DatePicker";

const formSchema = z.object({
  awardTitle: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  categoryName: z.string().min(2, {
    message: "Category must be at least 2 characters.",
  }),
  awardStatus: z.string().min(2, {
    message: "Status must be at least 2 characters.",
  }),
  awardedIn: z.string().min(2, {
    message: "Awarded In must be at least 2 characters.",
  }),
  awardedDate: z
    .date()
    .or(z.string())
    .optional()
    .refine(
      (dateString) => {
        if (!dateString) return true; // Allow empty or undefined values
        const date = new Date(dateString);
        return !isNaN(date.getTime());
      },
      {
        message: "Invalid date format",
      },
    )
    .refine(
      (dateString) => {
        if (!dateString) return true; // Allow empty or undefined values
        const date = new Date(dateString);
        return date <= new Date(); // Check if the date is in the future
      },
      {
        message: "Death date must be in the past.",
      },
    ),
  remarks: z.string().optional().or(z.literal("")),
  movieID: z.array(z.any()),
  crewID: z.array(z.any()),
});

const renderModes = {
  Render_Mode_Create: "create",
  Render_Mode_Edit: "edit",
  Render_Mode_Details: "details",
};

const defaultValues = {
  awardTitle: '',
  categoryName: '',
  awardStatus: '',
  awardedIn: '',
  awardedDate: null,
  remarks: '',
  movieID: [],
  crewID: []

};

const getAward = async (id, renderMode) => {
  let apiPath = `${ApiPaths.Path_Awards}/${id}`;
  let data = {};
  if (renderMode === renderModes.Render_Mode_Create)
    return defaultValues;
  const apiResponse = await axiosInstance
    .get(apiPath)
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.error(err));
  if (apiResponse?.isSuccess && Number(apiResponse?.statusCode) === 200)
    data = apiResponse.data;
  return data;
};



const createOrEditAward = async ({ postData, isEditMode, slug, toast }) => {
  let apiPath = ApiPaths.Path_Awards;
  if (isEditMode) {
    apiPath += "/" + slug;
    postData.id = slug;
  }
  postData = {
    ...postData,
    movieID: postData.movieID && postData.movieID.length > 0 ?
      postData.movieID[0].id :
      null,
    crewID: postData.crewID && postData.crewID.length > 0 ?
      postData.crewID[0].id :
      null,
    awardedDate: postData.awardedDate ? postData.awardedDate : null
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
    .catch((err) => console.error(err));
  return data;
};

const CreateAward = () => {
  const queryClient = useQueryClient();

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
      queryKey: ["awardDetail"],
      queryFn: () => getAward(slug, renderMode),
      keepPreviousData: true,
    });
  // const categories = useQuery({
  //   queryKey: ["flimRoleCategories"],
  //   queryFn: () => getCategories(),
  //   keepPreviousData: true,
  // });
  const mutateAward = useMutation({
    mutationFn: createOrEditAward,
    onSuccess: (data, variables, context) => {
      navigate(Paths.Route_Admin_Awards);
    },
    onError: (error, variables, context) => {
      toast({ description: "Something went wrong.Please try again." });
    },
    onSettled: (data, error, variables, context) => {
      // queryClient.invalidateQueries("flimRoleDetail");
    },
  });

  const onSubmit = (data) => {
    mutateAward.mutate({
      postData: data,
      isEditMode: renderMode === renderModes.Render_Mode_Edit,
      slug,
      toast,
    });
  };
  // let isContentLoading = true
  // if (isLoading || isFetching || categories.isLoading || categories.isFetching)
  //   return (
  //     <div>
  //       <AddPageHeader label="role" pathTo={Paths.Route_Admin_Role} />
  //       <FormSkeleton
  //         columnCount={4}
  //         cellWidths={["8rem", "40rem", "12rem", "12rem"]}
  //         shrinkZero
  //       />
  //     </div>
  //   );

  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
      <AddPageHeader label="award" pathTo={Paths.Route_Admin_Awards} />
      {isLoading ||
        isFetching ? (
        <FormSkeleton columnCount={2} rowCount={1} repeat={1} shrinkZero />
      ) : (
        data &&
        (
          <AwardForm
            award={data}
            renderMode={renderMode}
            onSubmit={onSubmit}
          />
        )
      )}
    </main>
  );
};

function AwardForm({ award, renderMode, onSubmit }) {
  // const [openCategorySelection, setOpenCategorySelection] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: sanitizeData({
      ...award,
      movieID: award.movie ? [award.movie] : [],
      crewID: award.crew ? [award.crew] : []
    }),
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
              Create Award
            </legend>
            <FormField
              control={form.control}
              name="awardTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Award Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Award title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="awardStatus"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Input placeholder="Award Status" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="awardedIn"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Awarded In</FormLabel>
                  <FormControl>
                    <Input placeholder="Award Category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="awardedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Awarded Date ( in B.S. )</FormLabel>
                  <DateInput value={field.value} field={field} />
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="awardedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Awarded date</FormLabel>
                  <DatePickerForForm field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="movieID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Movie</FormLabel>
                  <FormControl>
                    <MultipleSelectorWithList
                      value={field.value}
                      onChange={field.onChange}
                      triggerOnSearch={true}
                      minSearchTrigger={3}
                      apiPath={ApiPaths.Path_Movies + "?SearchKeyword="}
                      keyValue="id"
                      keyLabel="name"
                      placeholder="Begin typing to search for movie..."
                      maxSelected={1}
                      replaceOnMaxSelected={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="crewID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crew</FormLabel>
                  <FormControl>
                    <MultipleSelectorWithList
                      value={field.value}
                      onChange={field.onChange}
                      triggerOnSearch={true}
                      minSearchTrigger={3}
                      apiPath={ApiPaths.Path_Crews + "?SearchKeyword="}
                      keyValue="id"
                      keyLabel="name"
                      placeholder="Begin typing to search for crew..."
                      maxSelected={1}
                      replaceOnMaxSelected={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />



            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="remarks"
                      className="min-h-48"
                      {...field}
                    />
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
export default CreateAward;
