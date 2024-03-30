import React, { useState } from "react";
import axiosInstance from "../helpers/axiosSetup";
import { useNavigate } from "react-router";

function VerifyEmail() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    axiosInstance
      .post(`Accounts/verify-email?token=${token}`)
      .then((resp) => {
        if (resp) {
          //set token to cookie or localStorage
          navigate("/login");
        }
      })
      .catch((error) => {});
  };
  return (
    <div>
      <h3>Verify your account.</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Token <span color="red">*</span>
          </label>
          <input
            autoFocus
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        <button type="submit">Verify</button>
      </form>
    </div>
  );
}

export default VerifyEmail;
