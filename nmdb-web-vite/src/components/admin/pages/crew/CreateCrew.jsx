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
import { useMutation } from "@tanstack/react-query";
import { ApiPaths } from "@/constants/apiPaths";
import axiosInstance from "@/helpers/axiosSetup";
import { Input } from "@/components/ui/input";



const renderModes = {
    Render_Mode_Create: "create",
    Render_Mode_Edit: "edit",
    Render_Mode_Details: "details",
};
const formSchema = z.object({
    roleName: z.string().min(2, {
        message: "Crew name must be at least 2 characters.",
    }),
});
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

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            roleName: '',
        },
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
                                name="roleName"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
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