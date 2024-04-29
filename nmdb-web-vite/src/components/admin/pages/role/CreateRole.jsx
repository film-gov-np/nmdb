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
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/helpers/axiosSetup";
import { FormSkeleton } from "@/components/ui/custom/skeleton/form-skeleton";

const formSchema = z.object({
  roleName: z.string().min(2, {
    message: "Role name must be at least 2 characters.",
  }),
  roleCategoryId: z.union([z.string().min(1), z.number().min(1)]),
});

const renderModes = {
  Render_Mode_Create: "create",
  Render_Mode_Edit: "edit",
  Render_Mode_Details: "details",
};

const getFlimRole = async (id, renderMode) => {
  let apiPath = `/film/role/${id}`;
  let data = {};
  if (renderMode === renderModes.Render_Mode_Create)
    return { roleName: "", roleCategoryId: "" };
  const apiResponse = await axiosInstance
    .get(apiPath)
    .then((response) => {
      console.log("api-response", response.data);

      return response.data;
    })
    .catch((err) => console.error(err));
  console.log(
    "api-response",
    apiResponse?.isSuccess && Number(apiResponse?.statusCode) === 200,
  );
  if (apiResponse?.isSuccess && Number(apiResponse?.statusCode) === 200)
    data = apiResponse.data;
  return data;
};

const getCategories = async () => {
  let apiPath = "/film/role-categories";
  const apiResponse = await axiosInstance
    .get(apiPath)
    .then((response) => {
      console.log("api-response-categories", response.data);

      return response.data;
    })
    .catch((err) => console.error(err));
  return apiResponse;
};

const createOrEditRole = async ({ postData, isEditMode, slug }) => {
  debugger;
  let apiPath = `/film/role`;
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

      return response.data;
    })
    .catch((err) => console.error(err));
  return data;
};

const CreateRole = () => {
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
      queryKey: ["flimRoleDetail"],
      queryFn: () => getFlimRole(slug, renderMode),
      keepPreviousData: true,
    });
  const categories = useQuery({
    queryKey: ["flimRoleCategories"],
    queryFn: () => getCategories(),
    keepPreviousData: true,
  });
  const mutateRole = useMutation({
    mutationFn: createOrEditRole,
    onSuccess: (data, variables, context) => {
      toast({ description: "Successfully created the role." });
      navigate(Paths.Route_Admin_Role);
    },
    onError: (error, variables, context) => {
      toast({ description: "Something went wrong.Please try again." });
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries("create");
    },
  });

  const onSubmit = (data) => {
    console.log("submitted", data);
    mutateRole.mutate({
      postData: data,
      isEditMode: renderMode === renderModes.Render_Mode_Edit,
      slug,
    });
  };

  if (isLoading || isFetching || categories.isLoading || categories.isFetching)
    return (
      <FormSkeleton
        columnCount={4}
        cellWidths={["8rem", "40rem", "12rem", "12rem"]}
        shrinkZero
      />
    );

  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
      <AddPageHeader label="role" pathTo={Paths.Route_Admin_Role} />
      {data &&categories && (
        <RoleForm
          role={data}
          categories={categories.data}
          renderMode={renderMode}
          onSubmit={onSubmit}
        />
      )}
    </main>
  );
};

function RoleForm({ role, categories, renderMode, onSubmit }) {
  debugger;
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roleCategoryId: categories.find(
        ({ id, categoryName }) => categoryName === role.categoryName,
      )?.id,
      roleName: role.roleName,
    },
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
              Create Role
            </legend>
            <FormField
              control={form.control}
              name="roleCategoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <Popover className="py-2">
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "h-10 w-[380px] justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? categories.find(
                                ({ id, categoryName }) => id === field.value,
                              )?.categoryName
                            : "Select categroy"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[380px] p-0">
                      <Command>
                        <CommandInput placeholder="Search category..." />
                        <CommandList>
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {categories.map(({ id, categoryName }) => (
                              <CommandItem
                                value={categoryName}
                                key={"category" + id}
                                onSelect={() => {
                                  form.setValue("roleCategoryId", id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    categoryName === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {categoryName}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Role name</FormLabel>
                  <FormControl>
                    <Input placeholder="Role name" {...field} />
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
export default CreateRole;
