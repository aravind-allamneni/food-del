import { createContext, useEffect, useState } from "react";

import axiosInstance from "../api";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState("");

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
    }
    fetchCategories();
    fetchMenuItems();
  }, []);

  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
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
        totalAmount += itemInfo.price * cartItems[item];
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
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
