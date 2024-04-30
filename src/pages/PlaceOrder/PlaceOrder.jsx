import "./PlaceOrder.css";
import { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axiosInstance from "../../api";
import { toast } from "react-toastify";
import BASE_URL from "../../config";

const PlaceOrder = () => {
  const {
    getTotalCartAmount,
    menuItems,
    cartItems,
    setCartItems,
    token,
    loggedInUser,
  } = useContext(StoreContext);

  const [address, setAddress] = useState({
    firstname: "",
    lastname: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    menuItems.map((menuItem) => {
      if (cartItems[menuItem.id] > 0) {
        let orderItem = menuItem;
        orderItem["quantity"] = cartItems[menuItem.id];
        orderItems.push(orderItem);
      }
    });
    let orderData = {
      items: orderItems,
      amount: getTotalCartAmount() + 50,
      address: address,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/orders`,
        orderData,
        config
      );
      if (response.status !== 201) {
        toast("Unable to place order. Try again");
      } else {
        toast("Order Placed");
        setAddress({
          firstname: "",
          lastname: "",
          email: "",
          street: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
          phone: "",
        });
        setCartItems({});
        console.log(response.data);
      }
    } catch (error) {
      console.log(`Order Failed: ${error}`);
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            onChange={onChangeHandler}
            value={address.firstname}
            name="firstname"
            type="text"
            placeholder="First Name"
            required
          />
          <input
            onChange={onChangeHandler}
            value={address.lastname}
            name="lastname"
            type="text"
            placeholder="Last Name"
            required
          />
        </div>
        <input
          onChange={onChangeHandler}
          value={address.email}
          name="email"
          type="email"
          placeholder="Email Address"
          required
        />
        <input
          onChange={onChangeHandler}
          value={address.street}
          name="street"
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            onChange={onChangeHandler}
            value={address.city}
            name="city"
            type="text"
            placeholder="City"
          />
          <input
            onChange={onChangeHandler}
            value={address.state}
            name="state"
            type="text"
            placeholder="State"
            required
          />
        </div>
        <div className="multi-fields">
          <input
            onChange={onChangeHandler}
            value={address.pincode}
            name="pincode"
            type="text"
            placeholder="Pin Code"
            required
          />
          <input
            onChange={onChangeHandler}
            value={address.country}
            name="country"
            type="text"
            placeholder="Country"
            required
          />
        </div>
        <input
          onChange={onChangeHandler}
          value={address.phone}
          name="phone"
          type="text"
          placeholder="Phone"
          required
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹ {getTotalCartAmount()}</p>
            </div>
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹ {getTotalCartAmount() ? 50 : 0}</p>
            </div>
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹ {getTotalCartAmount() + (getTotalCartAmount() ? 50 : 0)}</b>
            </div>
          </div>
          <button type="submit">Proceed to Payment</button>
        </div>
      </div>
    </form>
  );
};
export default PlaceOrder;
