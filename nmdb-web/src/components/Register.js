import { Paths } from "../constants/routePaths";
import axiosInstance from "../helpers/axiosSetup";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Register() {
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
      firstName: "firstName",
      lastName: "lastName",
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
          navigate("/admin/dashboard");
        }
      })
      .catch((error) => {});
  };

  return (
    <div>
      <h3>Register</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label>
            Full Name <span color="red">*</span>
          </label>
          <input
            autoFocus
            value={fullName}
            onChange={onChange}
            name="Fullname"
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>
            Email <span color="red">*</span>
          </label>
          <input value={email} onChange={onChange} name="Email" />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>
            Mobile Number <span color="red">*</span>
          </label>
          <input value={mobileNumber} onChange={onChange} name="MobileNumber" />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>
            New Password <span color="red">*</span>
          </label>

          <input
            type="password"
            onChange={onChange}
            name="newPassword"
            value={newPassword}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>
            Confirm Password <span color="red">*</span>
          </label>

          <input
            type="password"
            onChange={onChange}
            name="ConfirmPassword"
            value={confirmPassword}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <div>
        <NavLink to={Paths.Route_Login}>{"Already a member? Login"}</NavLink>
      </div>
    </div>
  );
}

export default Register;
