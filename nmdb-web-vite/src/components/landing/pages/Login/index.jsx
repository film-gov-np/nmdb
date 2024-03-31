import { Paths } from "@/constants/routePaths";
import axiosInstance from "@/helpers/axiosSetup";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const postData = {
      email: email,
      password: password,
    };
    axiosInstance
      .post("Accounts/authenticate", postData)
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
    <div>
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email <span color="red">*</span>
          </label>
          <input autoFocus value={email} onChange={onChange} name="Email" />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label>
            Password <span color="red">*</span>
          </label>

          <input
            type="password"
            onChange={onChange}
            name="Password"
            value={password}
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
      <div>
        <NavLink to={Paths.Route_Forogot_Password}>Forgot password?</NavLink>

        <NavLink to={Paths.Route_Register}>
          {"Don't have an account? Sign Up"}
        </NavLink>
      </div>
    </div>
  );
}

export default Login;
