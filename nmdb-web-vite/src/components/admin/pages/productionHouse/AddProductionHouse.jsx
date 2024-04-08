import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Badge,
  Bird,
  CalendarIcon,
  ChevronLeft,
  Rabbit,
  Turtle,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MultipleSelector from "@/components/ui/custom/multiple-selector/multiple-selector";
import MultipleSelectorWithList from "../movies/MultipleSelectionWithList";

const OPTIONS = [
  { label: 'nextjs', value: 'Nextjs' },
  { label: 'React', value: 'react' },
  { label: 'Remix', value: 'remix' },
  { label: 'Vite', value: 'vite' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
  { label: 'Ember', value: 'ember', disable: true },
  { label: 'Gatsby', value: 'gatsby', disable: true },
  { label: 'Astro', value: 'astro' },
];
const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  name_nepali: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  address: z.string(),
  name_contactperson: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  contact_contactperson: z.string(),
  date_established: z.date(),
  is_running: z.string(),
  frameworks: z.array(optionSchema).min(1),
});
console.log(formSchema);

const renderModes = {
  Render_Mode_Add: "add",
  Render_Mode_Edit: "edit",
  Render_Mode_Details: "details",
};

const AddProductionHouse = () => {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const pathArray = pathname.split("/").filter((item) => item !== "");
  let renderMode = null;
  if (pathArray.includes(renderModes.Render_Mode_Edit) && slug)
    renderMode = renderModes.Render_Mode_Edit;
  else if (!pathArray.includes(renderModes.Render_Mode_Edit) && slug)
    renderMode = renderModes.Render_Mode_Details;
  else renderMode = renderModes.Render_Mode_Add;
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      name_nepali: "",
      address: "",
      date_established: "",
      is_running: "Yes",
      contact_contactperson: "",
      name_contactperson: "",
    },
  });
  console.log(form);

  const createProductionHouse = (data) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[440px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };
  const updateProductionHouse = (slug, data) => {
    toast({
      title: "You updating the following values for " + slug,
      description: (
        <pre className="mt-2 w-[440px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  const onSubmit = (data) => {
    return renderMode === renderModes.Render_Mode_Add
      ? createProductionHouse(data)
      : updateProductionHouse(slug, data);
  };

  const [data, setData] = useState({});
  useEffect(() => {
    if (
      [renderModes.Render_Mode_Edit, renderModes.Render_Mode_Details].includes(
        renderMode,
      )
    ) {
      // get user and set form fields
      form.setValue("name", "Kaji Production House");
      form.setValue("name_nepali", "Kaji Film Nirman Ghar");
      form.setValue("address", "Radhe Radhe");
      form.setValue("contact_contactperson", "1234567890");
      form.setValue("name_contactperson", "Sudip Thapa");
      form.setValue("is_running", "No");
      form.setValue("date_established", "2051-12-19");
      setData({});
    }
  }, []);
  console.log(renderMode);
  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
      <div className="flex items-center justify-start gap-6">
        <NavLink to={"/admin/production-house"}>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </NavLink>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Production House
          </h2>
          <p className="text-sm text-muted-foreground">
            Use the form below to add a new production House.
          </p>
        </div>
      </div>
      <Separator />
      

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
              <FormField
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
        />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name(in english)</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name_nepali"
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
                name="date_established"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Establishment date</FormLabel>
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
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
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
                name="is_running"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Is running?</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes" selected={true}>
                          Yes
                        </SelectItem>
                        <SelectItem value="No">No</SelectItem>
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
                Chairman Information
              </legend>
              <FormField
                control={form.control}
                name="name_contactperson"
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
                name="contact_contactperson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact person number</FormLabel>
                    <FormControl>
                      <Input placeholder="Name in nepali" {...field} />
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
  );
};

export default AddProductionHouse;
