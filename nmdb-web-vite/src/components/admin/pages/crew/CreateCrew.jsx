import { Paths } from "@/constants/routePaths"
import AddPageHeader from "../../AddPageHeader"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";



const renderModes = {
    Render_Mode_Create: "create",
    Render_Mode_Edit: "edit",
    Render_Mode_Details: "details",
};

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Crew name must be at least 2 characters.",
    }),
    nepaliName: z.string(),
    birthName: z.string(),
    nickName: z.string(),
    fatherName: z.string(),
    motherName: z.string(),
    designation: z.string(),
    gender: z.string(),
    dateOfBirthInAD: z.string(),
    dateOfDeathInAD: z.string(),
    birthPlace: z.string(),
    height: z.string(),
    starSign: z.string(),
    currentAddress: z.string(),
    officialSite: z.string(),
    facebookID: z.string(),
    twitterID: z.string(),
    mobile: z.string(),
    image: z.string(),
    biography: z.string(),
    biographyInNepali: z.string(),
    activities: z.string(),
    trivia: z.string(),
    tradeMark: z.string(),
    isVerified: z.string(),
});

const defaultValues = {
    name: '',
    nepaliName: '',
    birthName: '',
    nickName: '',
    fatherName: '',
    motherName: '',
    designation: '',
    gender: '',
    dateOfBirthInAD: '',
    dateOfDeathInAD: '',
    birthPlace: '',
    height: '',
    starSign: '',
    currentAddress: '',
    officialSite: '',
    facebookID: '',
    twitterID: '',
    mobile: '',
    image: '',
    biography: '',
    biographyInNepali: '',
    activities: '',
    trivia: '',
    tradeMark: '',
    isVerified: '',
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



    const { isLoading, data, isError, isFetching, isPreviousData, error } = useQuery({
        queryKey: ["crewDetail"],
        queryFn: () => getCrew(slug, renderMode),
        keepPreviousData: true,
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { ...data },
    });

    const onSubmit = (data) => {
        console.log("submitted", data);
        mutateRole.mutate({
            postData: data,
            isEditMode: renderMode === renderModes.Render_Mode_Edit,
            slug,
            toast,
        });
    };

    const createOrEditRole = async ({ postData, isEditMode, slug, toast }) => {
        let apiPath = ApiPaths.Path_Crews;
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

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-8">
                        <fieldset
                            disabled={renderMode === renderModes.Render_Mode_Details}
                            className="grid grid-cols-1 gap-2 rounded-lg border p-4 md:grid-cols-2 md:gap-4 lg:gap-6"
                        >
                            <legend className="-ml-1 px-1 text-lg font-medium text-muted-foreground">
                                Create Crew
                            </legend>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem >
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
                                name="designation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Designation</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Designation" {...field} />
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
                                        <FormControl>
                                            <Input placeholder="Gender" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dateOfBirthInAD"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Birth Date</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Birth Date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dateOfDeathInAD"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Death Date</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Death Date" {...field} />
                                        </FormControl>
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

                            <FormField
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
                            />

                            <FormField
                                control={form.control}
                                name="biography"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Boigraphy</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="English Boigraphy"
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
                                name="biographyInNepali"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nepali Biography</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Nepali Boigraphy"
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
                                name="activities"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Activities</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Activities"
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
                                name="trivia"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Trivia</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Trivia"
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
        </main>
    )
}

export default CreateCrew