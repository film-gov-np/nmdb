import AddPageHeader from "../../AddPageHeader";
import { Paths } from "@/constants/routePaths";
import MultipleSelectorWithList from "./MultipleSelectionWithList";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormBasicInfo from "./FormBasicInfo";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronRight, Trash } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

const roles = [
  {
    value: "director",
    label: "Director",
  },
  {
    value: "actress",
    label: "Actress",
  },
  {
    value: "producer",
    label: "Producer",
  },
  {
    value: "cameraman",
    label: "Cameraman",
  },
  {
    value: "action-director",
    label: "Action Director",
  },
  {
    value: "actor",
    label: "Actor",
  },
];
const formSchema = z.object({
  file: z.instanceof(FileList).optional(),
});

const AddMovie = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const form = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      name_nepali: "",
      runtime: "",
      status: "",
      genre: "",
      language: "",
      studio: "",
      date_release: "",
      date_application: "",
      certificate_number: "",
      censor_type: "",
      movie_type: "",
      crew_and_roles: [{ "director" :[]}, {"producer":[]},],
    }
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "crew_and_roles",
  });
  const onSubmit = (data) => {
    console.log(data)
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
  return (
    <main className="flex flex-1 flex-col gap-2 overflow-auto p-4 lg:gap-4 lg:p-6">
      <AddPageHeader
        className=" "
        label={"movie"}
        pathTo={Paths.Route_Admin + Paths.Route_Admin_Movie}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs
            defaultValue="basic_information"
            onValueChange={() => {}}
            className="min-h-[60vh] w-full gap-2 lg:grid lg:grid-cols-[1fr,6fr]"
            orientation="vertical"
          >
            <TabsList className="flex h-full w-full flex-wrap justify-start gap-2 p-2 lg:h-full lg:flex-col lg:p-4 ">
              <TabsTrigger
                value="basic_information"
                className="justify-start lg:w-full"
              >
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                value="crew_information"
                className="justify-start lg:w-full"
              >
                Crew Info
              </TabsTrigger>
              <TabsTrigger
                value="censor_information"
                className="justify-start lg:w-full"
              >
                Censor Info
              </TabsTrigger>
              <TabsTrigger
                value="role_information"
                className="justify-start lg:w-full"
              >
                Role Info
              </TabsTrigger>
            </TabsList>
            <div className="rounded-md border border-input">
              <ScrollArea
                className="py-2"
                viewPortClass="max-h-[calc(100vh-100px)]"
              >
                <TabsContent value="basic_information" className="h-full ">
                  <FormBasicInfo form={form} />
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
                  <div className="grid min-h-[60vh] grid-cols-1 gap-4 px-4 py-2 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>phone</FormLabel>
                          <FormControl>
                            <Input placeholder="phone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="role_information" className="h-full">
                  <div className="grid min-h-[60vh] grid-cols-1 gap-4 px-4 py-2 md:grid-cols-2">
                    {fields.map((formFields, index) => (
                      <fieldset
                        key={formFields.id}
                        className="grid h-fit grid-cols-1 gap-2 rounded-lg border p-4"
                      >
                        <legend className="text-md -ml-1 px-1 font-medium capitalize text-muted-foreground">
                          {Object.keys(formFields)[0]}
                        </legend>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 ml-auto -mt-10"
                          onClick={() => remove(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        <FormField
                          control={form.control}
                          name={`crew_and_roles.${index}.${Object.keys(formFields)[0]}`}
                          render={({ field }) => (
                            <FormItem>
                              {/* <FormLabel>{formFields.role}</FormLabel> */}
                              <FormControl>
                                <MultipleSelectorWithList
                                  value={field.value}
                                  onChange={field.onChange}
                                  triggerOnSearch={true}
                                  minSearchTrigger={3}
                                  apiPath="https://api.slingacademy.com/v1/sample-data/users?limit=100&search="
                                  keyValue="id"
                                  keyLabel="first_name"
                                  imgLabel="profile_picture"
                                  placeholder="Begin typing to search crew member..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </fieldset>
                    ))}

                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-[150px] justify-start"
                        >
                          <>+ Add a role</>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="p-0"
                        side="right"
                        align="start"
                      >
                        <Command>
                          <CommandInput placeholder="Change status..." />
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                              {roles.map((role) => (
                                <CommandItem
                                  key={role.value}
                                  value={role.value}
                                  onSelect={(value) => {
                                    append({
                                      [value]: [],
                                    });
                                    delete roles[roles.indexOf(role)]
                                    setOpen(false);
                                  }}
                                >
                                  <span>{role.label}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
};

export default AddMovie;
