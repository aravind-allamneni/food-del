import { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import axiosInstance from "../../api";
import BASE_URL from "../../config";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";

const LoginPopup = ({ setShowLogin }) => {
  const { setToken } = useContext(StoreContext);
  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(`Data: ${JSON.stringify(data)}`);
    console.log(`State: ${currentState}`);
    if (currentState === "Sign Up") {
      // create a new account
      try {
        const response = await axiosInstance.post(`${BASE_URL}/users`, data);
        if (response.status !== 201) {
          console.error("new user creation failed");
          toast.error("Failed: User not created");
        }
        toast.success("Success: User created");
        setData({
          name: "",
          email: "",
          password: "",
          phone_number: "",
        });
        setCurrentState("Login");
        console.log(`data: ${JSON.stringify(data)}`);
        console.log(`currentState: ${currentState}`);
      } catch (error) {
        toast.error("Failure: User not created");
      }
    } else {
      // login
      const loginFormData = new FormData();
      loginFormData.append("username", data.email);
      loginFormData.append("password", data.password);
      try {
        const response = await axiosInstance.post(
          `${BASE_URL}/login/user`,
          loginFormData
        );
        if ((response.status < 200) | (response.status > 299)) {
          toast.error(`Failure: User not created | ${response.status}`);
          console.log(`User not created`);
        }
        console.log(`Response: ${JSON.stringify(response.data)}`);
        toast.success("Success: Logged in");
        // close pop up and redirect user to home page
        setToken(response.data.access_token);
        localStorage.setItem("token", response.data.access_token);
        setShowLogin(false);
      } catch (error) {
        toast.error(`Failure: User not loggedin | ${error}`);
      }
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onSubmitHandler} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Login" ? (
            <></>
          ) : (
            <input
              type="text"
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              placeholder="Your name"
              required
            />
          )}
          <input
            type="email"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            placeholder="Password"
            required
          />
          {currentState === "Login" ? (
            <></>
          ) : (
            <input
              type="text"
              name="phone_number"
              onChange={onChangeHandler}
              value={data.phone_number}
              placeholder="Phone Number"
              required
            />
          )}
        </div>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing I agree to the terms of use & privacy policy.</p>
        </div>
        <button type="submit">
          {currentState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        {currentState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};
export default LoginPopup;
