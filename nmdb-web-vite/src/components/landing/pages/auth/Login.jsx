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

const Login = () => {
  const navigate = useNavigate();
  const { setIsAuthorized } = useAuthContext();
  const form = useForm({
    resolver: loginSchemaResolver,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = ({ email, password }) => {
    const postData = {
      email: email,
      password: password,
    };
    axiosInstance
      .post("auth/authenticate", postData)
      .then((resp) => {
        if (resp) {
          const {
            created,
            email,
            firstName,
            idx,
            isVerified,
            jwtToken,
            lastName,
            updated,
          } = resp.data.data;
          //set token to cookie or localStorage
          localStorage.setItem("token", jwtToken);
          setIsAuthorized(true);
          navigate("/admin/dashboard");
        }
      })
      .catch((error) => {});
  };

  return (
    <div className="flex items-center justify-center py-12">
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">NMDB</h1>
          <p className="text-balance text-muted-foreground">
            Enter your credentials below to login
          </p>
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
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <NavLink to={Paths.Route_Register} className="underline">
            Sign up
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Login;
