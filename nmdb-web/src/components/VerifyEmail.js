import React, { useEffect, useState } from "react";
import axiosInstance from "../helpers/axiosSetup";
import { useNavigate } from "react-router";
import { NavLink } from "react-router-dom";

function VerifyEmail() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.pathname);
    const token = params.get("token");
    if (token) {
      handleSubmit(token);
    }
  }, []);

  const handleSubmit = (token) => {
    setRequested(true);
    axiosInstance
      .post(`Accounts/verify-email?token=${token}`)
      .then((resp) => {
        if (resp) {
          setSuccess(true);
        }
      })
      .catch((error) => {});
  };
  return (
    <div>
      <h3>Verify your account.</h3>
      {requested && (
        <>
          {" "}
          {success ? (
            <>
              <p>Account verified successfully</p>
              <NavLink
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </NavLink>
            </>
          ) : (
            <>
              <p>Account verification failed</p>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default VerifyEmail;
