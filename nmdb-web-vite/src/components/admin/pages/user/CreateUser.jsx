import { Paths } from "@/constants/routePaths";
import AddPageHeader from "../../AddPageHeader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiPaths } from "@/constants/apiPaths";
import axiosInstance from "@/helpers/axiosSetup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { sanitizeData } from "@/lib/utils";
import { FormSkeleton } from "@/components/ui/custom/skeleton/form-skeleton";
import { FileInput } from "@/components/common/formElements/FileInput";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@radix-ui/react-checkbox";

const renderModes = {
  Render_Mode_Create: "create",
  Render_Mode_Edit: "edit",
  Render_Mode_Details: "details",
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "User name must be at least 2 characters.",
  }),
  profilePhotoFile: z.any(),
  profilePhoto: z.any(),
  email: z.string().email().optional().or(z.literal("")),
  role:z.string().optional().or(z.literal("")),
  phoneNumber: z.string().optional().or(z.literal("")),

  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }).optional(),
  confirmPassword: z.string().min(8, {
    message: "Confirm password must be at least 8 characters long.",
  }).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const defaultValues = {
  name: "",
  phoneNumber: "",
  profilePhoto: "",
  profilePhotoFile: "",
  role: "",
  email: "",
  password:"",
  confirmPassword:""
};

function CreateUser() {
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
      queryKey: ["userDetail"],
      queryFn: () => getUser(slug, renderMode),
      keepPreviousData: true,
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { ...data },
  });

  const onSubmit = (data) => {
    const submitData = {
      ...data,
      profilePhotoFile: data.profilePhotoFile?.[0] || null,
    };
    mutateRole.mutate({
      postData: submitData,
      isEditMode: renderMode === renderModes.Render_Mode_Edit,
      slug,
      toast,
    });
  };

  const createOrEditRole = async ({ postData, isEditMode, slug, toast }) => {
    let apiPath = ApiPaths.Path_Users;
    if (isEditMode) {
      apiPath += "/" + slug;
      // postData.id = slug;
    }
    // const formData = new FormData();
    // if (previews.length > 0) {
    //   formData.append("file", previews[0]);
    // }
    // for (const key in postData) {
    //   formData.append(key, postData[key] ?? defaultValues[key]);
    // }

    const { data } = await axiosInstance({
      method: isEditMode ? "put" : "post",
      url: apiPath,
      data: postData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
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

  const mutateRole = useMutation({
    mutationFn: createOrEditRole,
    onSuccess: (data, variables, context) => {
      navigate(Paths.Route_Admin_User);
    },
    onError: (error, variables, context) => {
      toast({ description: "Something went wrong.Please try again." });
    },
    onSettled: (data, error, variables, context) => {
      // queryClient.invalidateQueries("RoleDetail");
    },
  });

  const getUser = async (id, renderMode) => {
    let apiPath = `${ApiPaths.Path_Users}/${id}`;
    let data = {};
    if (renderMode === renderModes.Render_Mode_Create) return defaultValues;
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

  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
      <AddPageHeader label="user" pathTo={Paths.Route_Admin_User} />
      <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        {/* <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav
            className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0"
          >
            <NavLink href="#" className="font-semibold text-primary">
              General
            </NavLink>
            <NavLink href="#">Security</NavLink>
            <NavLink href="#">Integrations</NavLink>
            <NavLink href="#">Support</NavLink>
            <NavLink href="#">Organizations</NavLink>
            <NavLink href="#">Advanced</NavLink>
          </nav>
          <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Store Name</CardTitle>
                <CardDescription>
                  Used to identify your store in the marketplace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <Input placeholder="Store Name" />
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Save</Button>
              </CardFooter>
            </Card>
            <Card x-chunk="dashboard-04-chunk-2">
              <CardHeader>
                <CardTitle>Plugins Directory</CardTitle>
                <CardDescription>
                  The directory within your project, in which your plugins are
                  located.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="flex flex-col gap-4">
                  <Input
                    placeholder="Project Name"
                    defaultValue="/content/plugins"
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include" defaultChecked />
                    <label
                      htmlFor="include"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Allow administrators to change the directory.
                    </label>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Save</Button>
              </CardFooter>
            </Card>
          </div>
        </div> */}
      {isLoading || isFetching ? (
        <FormSkeleton columnCount={5} rowCount={2} repeat={2} shrinkZero />
      ) : (
        data && (
          <UserForm user={data} renderMode={renderMode} onSubmit={onSubmit} />
        )
      )}
    </main>
  );
}
const getUserRoles = async (apiPath) => {
  const apiResponse = await axiosInstance
    .get(apiPath)
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.error(err));
  return apiResponse.data;
};

function UserForm({ user, renderMode, onSubmit }) {
  const [previews, setPreviews] = useState({
    profilePhotoFile: user?.profilePhotoUrl ? [user?.profilePhotoUrl] : [],
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: sanitizeData({
      ...user,
    }),
  });

  if (user.profilePhoto) form.setValue("profilePhoto", user.profilePhoto);

  const { isLoading, data, isError, isFetching, isPreviousData, error } =
    useQuery({
      queryKey: ["applicationRoleForUsers"],
      queryFn: () => getUserRoles("/roles"),
      keepPreviousData: true,
    });

  if (isLoading || isFetching) return "loading";

  if (error) return "error";

  const roles = data;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-8">
          <fieldset
            disabled={renderMode === renderModes.Render_Mode_Details}
            className="grid grid-cols-1 gap-2 rounded-lg border p-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-6"
          >
            <legend className="-ml-1 px-1 text-lg font-medium text-muted-foreground">
              Create User
            </legend>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.defaultValue}
                    value={field.value}
                    name="customCategory"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Gender.map((gender, index) => (
                        <SelectItem key={"gender" + index} value={gender.value}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="profilePhotoFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <FileInput
                      field={field}
                      previews={previews}
                      setPreviews={setPreviews}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          <fieldset
            disabled={renderMode === renderModes.Render_Mode_Details}
            className="grid grid-cols-1 gap-2 rounded-lg border p-4 md:grid-cols-2 md:gap-4 lg:gap-6"
          >
            <legend className="-ml-1 px-1 text-lg font-medium text-muted-foreground">
              Role
            </legend>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign a Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.defaultValue}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((item) => (
                        <SelectItem key={item.id} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          {renderMode === renderModes.Render_Mode_Create && (
            <fieldset
              disabled={renderMode === renderModes.Render_Mode_Details}
              className="grid grid-cols-1 gap-2 rounded-lg border p-4 md:grid-cols-2 md:gap-4 lg:gap-6"
            >
              <legend className="-ml-1 px-1 text-lg font-medium text-muted-foreground">
                Credentials
              </legend>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </fieldset>
          )}
        </div>
        {renderMode !== renderModes.Render_Mode_Details && (
          <Button type="submit">Submit</Button>
        )}
      </form>
    </Form>
  );
}

export default CreateUser;