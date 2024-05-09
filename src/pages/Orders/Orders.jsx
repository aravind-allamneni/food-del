import { useContext, useEffect, useState } from "react";
import "./Orders.css";
import { StoreContext } from "../../context/StoreContext";
import axiosInstance from "../../api";
import BASE_URL from "../../config";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const Orders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { token, loggedInUser } = useContext(StoreContext);

  const fetchMyOrders = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axiosInstance.get(`${BASE_URL}/orders`, config);
      if (response.status == 200) {
        setMyOrders(response.data);
      } else {
      }
    } catch (error) {
      toast("Login to see orders");
      console.log(`Could not fetch cart items: ${error}`);
    }
  };

  useEffect(() => {
    if (token) fetchMyOrders();
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {myOrders.map((orderData, index) => {
          return (
            <div className="my-orders-order" key={index}>
              <img src={assets.parcel_icon} alt="" />
              <p>
                {orderData.items.map((item, index) => {
                  if (index == orderData.items.length - 1) {
                    return item.name + " x " + item.quantity;
                  } else {
                    return item.name + " x " + item.quantity + ", ";
                  }
                })}
              </p>
              <p>Rs. {orderData.amount}</p>
              <p>Items: {orderData.items.length}</p>
              <p>
                <span>&#x25cf;</span>
                <b> {orderData.status}</b>
              </p>
              <button>Track Order</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Orders;
