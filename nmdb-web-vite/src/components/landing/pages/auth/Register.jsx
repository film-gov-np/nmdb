import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paths } from "@/constants/routePaths";
import axiosInstance from "@/helpers/axiosSetup";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "FullName":
        setFullName(value);
        break;
      case "Email":
        setEmail(value);
        break;
      case "MobileNumber":
        setMobileNumber(value);
        break;
      case "NewPassword":
        setNewPassword(value);
        break;
      case "ConfirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const postData = {
      firstName: "Sudip",
      lastName: "Thapa",
      email: email,
      password: newPassword,
      confirmPassword: confirmPassword,
      acceptTerms: true,
    };
    axiosInstance
      .post("Accounts/register", postData)
      .then((resp) => {
        if (resp) {
          //set token to cookie or localStorage
          navigate(Paths.Route_Verify_Email);
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
            Enter your details below to register
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Full Name</Label>
              <Input
                id="fullname"
                type="text"
                placeholder="Jhon Doe"
                onChange={onChange}
                autoFocus
                value={fullName}
                name="FullName"
                required
              />
            </div>
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
              <Label htmlFor="email">Mobile Number</Label>
              <Input
                id="mobilenumber"
                type="text"
                placeholder="XXX XXX XXXX"
                value={mobileNumber}
                onChange={onChange}
                name="MobileNumber"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                onChange={onChange}
                name="NewPassword"
                value={newPassword}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                id="password"
                type="password"
                onChange={onChange}
                name="ConfirmPassword"
                value={confirmPassword}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Register
            </Button>
          </div>
        </form>
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

export default Register;
