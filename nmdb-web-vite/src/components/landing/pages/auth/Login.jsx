import { useAuthContext } from "@/components/admin/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Paths } from "@/constants/routePaths";
import axiosInstance from "@/helpers/axiosSetup";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { loginSchemaResolver } from "./authSchema";
import { ApiPaths } from "@/constants/apiPaths";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { LoaderCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setIsAuthorized, setUserInfo } = useAuthContext();
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);

  const [errorState, setErrorState] = useState("");
  const form = useForm({
    resolver: loginSchemaResolver,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = ({ email, password }) => {
    setIsRequestInProgress(true);
    const postData = {
      email: email,
      password: password,
    };
    axiosInstance
      .post(ApiPaths.Path_Auth + "/authenticate", postData)
      .then((resp) => {
        setIsRequestInProgress(false);
        const response = resp.data;
        if (response?.isSuccess) {
          const userInfo = response.data;
          setIsAuthorized(true);
          setUserInfo(userInfo);
          if (userInfo.isCrew)
            navigate(Paths.Route_Celebrities + "/" + userInfo.crewId);
          else if (userInfo.role === "Admin" || userInfo.role === "Superuser")
            navigate(Paths.Route_Admin_Dashboard);
          else navigate(Paths.Route_Home);
        } else {
          setErrorState(response.message);
        }
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
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">NMDB</h1>
          <p className="text-balance text-muted-foreground">
            Enter your credentials below to login
          </p>
          {errorState && (
            <Alert variant="destructive">
              <AlertTitle>Login Error</AlertTitle>
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
                      <div className="flex items-center">
                        <FormLabel>Password</FormLabel>
                        <NavLink
                          to={Paths.Route_Forogot_Password}
                          className="ml-auto inline-block text-sm underline"
                        >
                          Forgot your password?
                        </NavLink>
                      </div>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
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
                Login
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <NavLink to={Paths.Route_Register_Crew} className="underline">
            Sign up
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Login;
