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
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { sanitizeData } from "@/lib/utils";
import MultipleSelectorWithList from "@/components/ui/custom/multiple-selector/MultipleSelectionWithList";
import { FormSkeleton } from "@/components/ui/custom/skeleton/form-skeleton";
import DatePickerForForm from "@/components/common/formElements/DatePicker";
import { Date_Format, Gender } from "@/constants/general";
import DateInput from "@/components/ui/custom/DateInput";
import { format, isValid, parse } from "date-fns";
import Image from "@/components/common/Image";
import { FileInput } from "@/components/common/formElements/FileInput";

const renderModes = {
  Render_Mode_Create: "create",
  Render_Mode_Edit: "edit",
  Render_Mode_Details: "details",
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Crew name must be at least 2 characters.",
  }),
  nepaliName: z.string().min(2).optional().or(z.literal("")),
  birthName: z.string().min(2).optional().or(z.literal("")),
  nickName: z.string().min(2).optional().or(z.literal("")),
  fatherName: z.string().min(2).optional().or(z.literal("")),
  motherName: z.string().min(2).optional().or(z.literal("")),
  designations: z.any(),
  gender: z.string().optional(),
  dateOfBirthInAD: z
    .string()
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
        message: "Birth date must be in the past.",
      },
    ),
  dateOfDeathInAD: z
    .string()
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
  dateOfBirthInBS: z
    .string()
    .refine(
      (dateStr) => {
        // Parse the date string using date-fns
        const parsedDate = parse(dateStr, Date_Format, new Date());

        // Check if the parsed date is valid and matches the input string
        const isValidDate =
          isValid(parsedDate) && format(parsedDate, Date_Format) === dateStr;

        return isValidDate;
      },
      {
        message: `Invalid date format or value. Expected format is ${Date_Format}.`,
      },
    )
    .optional()
    .or(z.literal("")),
  dateOfDeathInBS: z
    .string()
    .refine(
      (dateStr) => {
        // Parse the date string using date-fns
        const parsedDate = parse(dateStr, Date_Format, new Date());

        // Check if the parsed date is valid and matches the input string
        const isValidDate =
          isValid(parsedDate) && format(parsedDate, Date_Format) === dateStr;

        return isValidDate;
      },
      {
        message: `Invalid date format or value. Expected format is ${Date_Format}.`,
      },
    )
    .optional()
    .or(z.literal("")),
  birthPlace: z.string().optional().or(z.literal("")),
  height: z.string().optional().or(z.literal("")),
  starSign: z.string().optional().or(z.literal("")),
  currentAddress: z.string().optional().or(z.literal("")),
  officialSite: z.string().optional().or(z.literal("")),
  facebookID: z.string().optional().or(z.literal("")),
  twitterID: z.string().optional().or(z.literal("")),
  mobile: z.string().optional().or(z.literal("")),
  biography: z.string().optional().or(z.literal("")),
  biographyInNepali: z.string().optional().or(z.literal("")),
  activities: z.string().optional().or(z.literal("")),
  trivia: z.string().optional().or(z.literal("")),
  tradeMark: z.string().optional().or(z.literal("")),
  isVerified: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  profilePhotoFile: z.any(),
  profilePhoto: z.any(),
  email: z.string().email().optional().or(z.literal("")),
});

const defaultValues = {
  name: "",
  nepaliName: "",
  birthName: "",
  nickName: "",
  fatherName: "",
  motherName: "",
  designations: [],
  gender: "",
  dateOfBirthInAD: null,
  dateOfDeathInAD: null,
  birthPlace: "",
  height: "",
  starSign: "",
  currentAddress: "",
  officialSite: "",
  facebookID: "",
  twitterID: "",
  mobile: "",
  profilePhoto: "",
  profilePhotoFile: "",
  biography: "",
  biographyInNepali: "",
  activities: "",
  trivia: "",
  tradeMark: "",
  isVerified: "false",
  dateOfBirthInBS: "",
  dateOfDeathInBS: "",
  email: "",
};

function CreateCrew() {
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
      queryKey: ["crewDetail"],
      queryFn: () => getCrew(slug, renderMode),
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
      // thumbnailImage: data.thumbnailImageFile?.[0].name,
    };
    console.log("submitted", submitData);
    mutateRole.mutate({
      postData: submitData,
      isEditMode: renderMode === renderModes.Render_Mode_Edit,
      slug,
      toast,
    });
  };

  const createOrEditRole = async ({ postData, isEditMode, slug, toast }) => {
    let apiPath = ApiPaths.Path_Crews;
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
      navigate(Paths.Route_Admin_Crew);
    },
    onError: (error, variables, context) => {
      toast({ description: "Something went wrong.Please try again." });
    },
    onSettled: (data, error, variables, context) => {
      // queryClient.invalidateQueries("flimRoleDetail");
    },
  });

  const getCrew = async (id, renderMode) => {
    let apiPath = `${ApiPaths.Path_Crews}/${id}`;
    let data = {};
    if (renderMode === renderModes.Render_Mode_Create) return defaultValues;
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

  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
      <AddPageHeader label="crew" pathTo={Paths.Route_Admin_Crew} />
      {isLoading || isFetching ? (
        <FormSkeleton columnCount={5} rowCount={2} repeat={2} shrinkZero />
      ) : (
        data && (
          <CrewForm crew={data} renderMode={renderMode} onSubmit={onSubmit} />
        )
      )}
    </main>
  );
}
const getCrewFlimRoles = async (apiPath) => {
  const apiResponse = await axiosInstance
    .get(apiPath)
    .then((response) => {
      console.log("api-response", response.data);
      return response.data;
    })
    .catch((err) => console.error(err));
  return apiResponse.data;
};
function CrewForm({ crew, renderMode, onSubmit }) {
  const [previews, setPreviews] = useState({
    profilePhotoFile: crew?.profilePhotoUrl ? [crew?.profilePhotoUrl] : [],
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: sanitizeData({
      ...crew,
      isVerified: crew.isVerified.toString(),
    }),
  });
  if(crew.profilePhoto) form.setValue("profilePhoto", crew.profilePhoto);
  const { isLoading, data, isError, isFetching, isPreviousData, error } =
    useQuery({
      queryKey: ["FlimRolesforCrews"],
      queryFn: () => getCrewFlimRoles("/film-roles?RetrieveAll=true"),
      keepPreviousData: true,
    });
  if (isLoading || isFetching) return "loading";
  if (error) return "error";
  const roles = data.items;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-8">
          <fieldset
            disabled={renderMode === renderModes.Render_Mode_Details}
            className="grid grid-cols-1 gap-2 rounded-lg border p-4 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-6"
          >
            <legend className="-ml-1 px-1 text-lg font-medium text-muted-foreground">
              Create Crew
            </legend>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name in english" {...field} />
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
              name="birthName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Birth name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nickName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nick Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Nick name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fatherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Father Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Father name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="motherName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mother Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Mother name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="designations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <MultipleSelectorWithList
                      {...field}
                      value={field.value}
                      triggerOnSearch={false}
                      defaultOptions={roles}
                      placeholder="Select designation/s"
                      keyValue="id"
                      keyLabel="roleName"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
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
                        <SelectItem key={"gende" + index} value={gender.value}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              name="dateOfBirthInBS"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date ( in B.S. )</FormLabel>
                  <DateInput value={field.value} field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirthInAD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date ( in A.D. )</FormLabel>
                  <DatePickerForForm field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfDeathInBS"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Of Death ( in B.S. )</FormLabel>
                  <DateInput value={field.value} field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfDeathInAD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Of Death ( in A.D. )</FormLabel>
                  <DatePickerForForm field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthPlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Place</FormLabel>
                  <FormControl>
                    <Input placeholder="Birth Place" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height</FormLabel>
                  <FormControl>
                    <Input placeholder="Height" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="starSign"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Star Sign</FormLabel>
                  <FormControl>
                    <Input placeholder="Star Sign" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currentAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Current Address" {...field} />
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
              Social Info
            </legend>

            <FormField
              control={form.control}
              name="facebookID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Facebook URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitterID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Twitter URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="officialSite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Official Site</FormLabel>
                  <FormControl>
                    <Input placeholder="Official Site" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Mobile Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image</FormLabel>
                                <FormControl>
                                    <Input type='file' placeholder="image" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

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
              Extra Info
            </legend>

            <FormField
              control={form.control}
              name="biography"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Boigraphy</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="English Boigraphy"
                      className="min-h-48"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="biographyInNepali"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nepali Biography</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nepali Boigraphy"
                      className="min-h-48"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="activities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activities</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Activities"
                      className="min-h-48"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trivia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trivia</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Trivia"
                      className="min-h-48"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tradeMark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trademark</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Trademark"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isVerified"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is Verified</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.defaultValue?.toString()}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Is the crew verfied?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
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

export default CreateCrew;
