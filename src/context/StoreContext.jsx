import { createContext, useEffect, useState } from 'react';

import axiosInstance from '../api';

import { food_list } from '../assets/assets';

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchMenuItems = async () => {
      try{
        const response = await axiosInstance.get('/menuitems');
        setMenuItems(response.data)
      } catch (error) {
        console.error(`Error fetching menu items: ${error}`)
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/menucategories');
        setCategories(response.data)
      } catch (error) {
        console.error(`Error fetching menu categories: ${error}`)
      }
    }
    fetchCategories();
    fetchMenuItems();
  }, [])

  const addToCart = (itemId) => {
    if (!cartItems[itemId]){
      setCartItems((prev) => ({...prev, [itemId]: 1}))
    } else{
      setCartItems((prev) => ({...prev, [itemId]: prev[itemId]+1}))
    }
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({...prev, [itemId]: prev[itemId]-1}))
  }

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for(const item in cartItems){
      if(cartItems[item]>0){
        let itemInfo = food_list.find((product) => product._id===item);
        totalAmount += itemInfo.price*cartItems[item];
      } 
    }
    return totalAmount;
  }

  const contextValue = {
    food_list, menuItems, categories, cartItems, setCartItems, addToCart, removeFromCart, getTotalCartAmount
  }
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider
