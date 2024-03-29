import axiosInstance from "@rootSrc/helpers/axiosSetup";
import React, { useEffect } from "react";

function Login() {
  useEffect(() => {
    axiosInstance
      .get("Account/authenticate")
      .then((response) => {})
      .catch((error) => {});
  }, []);
  return <div>Login</div>;
}

export default Login;
