import { useAuthContext } from "@/components/admin/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paths } from "@/constants/routePaths";
import axiosInstance from "@/helpers/axiosSetup";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { setIsAuthorized } = useAuthContext();
  
  const handleSubmit = (event) => {
    event.preventDefault();
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

  const onChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "Email":
        setEmail(value);
        break;
      case "Password":
        setPassword(value);
        break;
      default:
        break;
    }
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
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={onChange}
                name="Email"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <NavLink
                  to={Paths.Route_Forogot_Password}
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </NavLink>
              </div>
              <Input
                id="password"
                type="password"
                onChange={onChange}
                name="Password"
                value={password}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>
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
