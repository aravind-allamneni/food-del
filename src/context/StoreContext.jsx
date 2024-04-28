import { createContext, useEffect, useState } from "react";
import * as jwt_decode from "jwt-decode";

import axiosInstance from "../api";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState("");
  const [loggedInUser, setLoggedInUser] = useState({
    id: null,
    name: "",
    email: "",
    phone_number: "",
  });

  const fetchCartItems = async (tk, id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${tk}`,
        },
      };
      const response = await axiosInstance.get(`/users/${id}/cart`, config);
      setCartItems(response.data);
    } catch (error) {
      console.error(`Error fetching cartItems for ${id}: ${error}`);
    }
  };

  const getCurrentUser = async (tk, id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${tk}`,
      },
    };
    try {
      const response = await axiosInstance.get(`/users/${id}`, config);
      console.log(`Response: ${JSON.stringify(response)}`);
      if ((response.status < 200) | (response.status > 299)) {
        setToken("");
        setLoggedInUser({
          id: null,
          name: "",
          email: "",
          phone_number: "",
        });
        // console.log(`response.status: ${response.status}, removing token`);
        localStorage.removeItem("token");
        // console.log(`response: ${response.data}`);
      } else {
        // console.log(`response: ${JSON.stringify(response)}`);
        console.log(
          `response.data.cart: ${JSON.stringify(response.data.cart)}`
        );
        setLoggedInUser({
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          phone_number: response.data.phone_number,
        });
        setCartItems(response.data.cart);
        // setLoggedInUser(response.data);
      }
    } catch (error) {
      localStorage.removeItem("token");
      setCartItems({});
      setToken("");
      setLoggedInUser({
        id: null,
        name: "",
        email: "",
        phone_number: "",
        cart: {},
      });
    }
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axiosInstance.get("/menuitems");
        setMenuItems(response.data);
      } catch (error) {
        console.error(`Error fetching menu items: ${error}`);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/menucategories");
        setCategories(response.data);
      } catch (error) {
        console.error(`Error fetching menu categories: ${error}`);
      }
    };
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      const decoded_token = jwt_decode.jwtDecode(localStorage.getItem("token"));
      getCurrentUser(localStorage.getItem("token"), decoded_token.user_id);
    }
    fetchCategories();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    console.log(`loggedInUser: ${JSON.stringify(loggedInUser)}`);
    console.log(`cartItems: ${JSON.stringify(cartItems)}`);
  }, [loggedInUser, cartItems]);

  const addToCart = async (itemId) => {
    // check if the item is in cartItems
    let new_cart = {};
    if (!cartItems[itemId]) {
      new_cart = { ...cartItems, [itemId]: 1 };
    } else {
      new_cart = { ...cartItems, [itemId]: cartItems[itemId] + 1 };
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axiosInstance.post(
        `/users/${loggedInUser.id}/cart`,
        new_cart,
        config
      );
      if ((response.status > 199) & (response.status < 300)) {
        setCartItems(response.data);
        toast(`Added to cart.`);
      } else {
        toast(`Unable to fetch cart items. ${response.status}`);
      }
    } catch (error) {
      toast(`Unable to fetch cart items. ${error}`);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = menuItems.find((product) => product.id == item);
        if (itemInfo) totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const contextValue = {
    menuItems,
    categories,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    fetchCartItems,
    getCurrentUser,
    loggedInUser,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
