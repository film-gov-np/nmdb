import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paths } from "@/constants/routePaths";
import axiosInstance from "@/helpers/axiosSetup";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { registerCrewSchemaResolver } from "./authSchema";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const RegisterCrew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);
  const [errorState, setErrorState] = useState("");
  const form = useForm({
    resolver: registerCrewSchemaResolver,
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: true,
    },
  });

  const onSubmit = ({ email, password, confirmPassword, acceptTerms }) => {
    const postData = {
      email,
      password,
      confirmPassword,
      acceptTerms,
    };
    setIsRequestInProgress(true);
    axiosInstance
      .post("auth/register-crew", postData)
      .then((response) => {
        setIsRequestInProgress(false);
        if (response.status === 200) {
          const responseData = response.data;
          if (responseData.isSuccess) {
            //set token to cookie or localStorage
            navigate(Paths.Route_Login);
          } else {
            setErrorState(responseData.message);
            toast({
              description: "Something went wrong. Please try again later.",
              duration: 5000,
            });
          }
        } else
          toast({
            description: "Something went wrong. Please try again later.",
            duration: 5000,
          });
      })
      .catch((error) => {
        setIsRequestInProgress(false);
        toast({
          description: "Something went wrong. Please try again later.",
          duration: 5000,
        });
      });
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="mx-auto grid w-[420px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">NMDB</h1>
          <p className="text-balance text-muted-foreground">
            Enter your details below to register as a crew.
          </p>
          {errorState && (
            <Alert variant="destructive">
              <AlertTitle>Registration Error</AlertTitle>
              <AlertDescription>{errorState}</AlertDescription>
            </Alert>
          )}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Accept{" "}
                          <NavLink
                            to="/terms-and-conditions"
                            className="underline"
                          >
                            terms and conditions
                          </NavLink>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <Button
                disabled={isRequestInProgress}
                type="submit"
                className="w-full"
              >
                {isRequestInProgress && (
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                )}
                Register
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Already a member?{" "}
          <NavLink to={Paths.Route_Login} className="underline">
            Login
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default RegisterCrew;
