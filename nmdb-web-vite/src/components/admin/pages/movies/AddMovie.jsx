import AddPageHeader from "../../AddPageHeader";
import { Paths } from "@/constants/routePaths";
import MultipleSelectorWithList from "./MultipleSelectionWithList";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

const AddMovie = () => {
  const { toast } = useToast();
  const [formState, setFormState] = useState([]);
  const form = useForm({
    defaultValues: {
      actress: "",
      address: "",
      name: "",
      phone: "",
      director: "",
    },
  });
  const onSubmit = (data) => {
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
            defaultValue="account"
            onValueChange={() => {
              console.log(form.getValues());
            }}
            className="min-h-[60vh] w-full gap-2 lg:grid lg:grid-cols-[1fr,6fr]"
            orientation="vertical"
          >
            <TabsList className="flex h-full w-full flex-wrap justify-start gap-2 p-2 lg:h-full lg:flex-col lg:p-4 ">
              <TabsTrigger value="account" className="justify-start lg:w-full">
                Account
              </TabsTrigger>
              <TabsTrigger value="password" className="justify-start lg:w-full">
                Password
              </TabsTrigger>
              <TabsTrigger value="register" className="justify-start lg:w-full">
                Register
              </TabsTrigger>
              <TabsTrigger value="crew" className="justify-start lg:w-full">
                Crew
              </TabsTrigger>
            </TabsList>

            <ScrollArea viewPortClass="max-h-[calc(100vh-320px)]">
              <TabsContent value="account" className="h-full">
                <div className="rounded-md border border-input px-4 py-2">
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
                </div>
              </TabsContent>
              <TabsContent value="password">
                <Card>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Address" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your public display name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button>Save password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="register" className="h-full">
                <div className="rounded-md border border-input px-4 py-2">
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
              <TabsContent value="crew" className="h-full">
                <div className="rounded-md border border-input px-4 py-2 grid gap-4 grid-cols-1 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="actress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Actress</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="director"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Director</FormLabel>
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
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
};

export default AddMovie;
