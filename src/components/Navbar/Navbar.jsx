import { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount, token, setToken, loggedInUser } =
    useContext(StoreContext);
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };
  return (
    <div className="navbar">
      <Link to="/">
        <img className="logo" src={assets.logo} alt="" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}>
          Home
        </Link>
        <a
          href="/#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}>
          Menu
        </a>
        <a
          href="/#app-download"
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}>
          Mobile App
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}>
          Contact Us
        </a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() ? "dot" : ""}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin((prev) => !prev)}>Sign In</button>
        ) : (
          <div className="navbar-profile-wrapper">
            <div className="navbar-profile">
              <img src={assets.profile_icon} alt="" />
              <ul className="nav-profile-dropdown">
                {loggedInUser ? (
                  <li className="user-name">
                    <Link to="/">
                      <img src={assets.profile_icon} alt="" />
                      <u>{loggedInUser.name}</u>
                    </Link>
                  </li>
                ) : (
                  <></>
                )}
                <li onClick={() => navigate("/orders")}>
                  {/* <Link to="/orders"> */}
                  <img src={assets.bag_icon} alt="" />
                  <p>Orders</p>
                  {/* </Link> */}
                </li>
                <hr />
                <li onClick={logout}>
                  <img src={assets.logout_icon} alt="" />
                  <p>Logout</p>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Navbar;
