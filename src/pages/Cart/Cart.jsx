import { useContext, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { menuItems, cartItems, removeFromCart, getTotalCartAmount, token } =
    useContext(StoreContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!token | (getTotalCartAmount() == 0)) {
      navigate("/");
    }
  }, [cartItems]);
  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {menuItems.map((item, index) => {
          if (cartItems[item.id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={item.image} alt="" />
                  <p>{item.name}</p>
                  <p>₹ {item.price}</p>
                  <p>{cartItems[item.id]}</p>
                  <p>₹ {item.price * cartItems[item.id]}</p>
                  <p
                    className="cross"
                    onClick={() => {
                      removeFromCart(item.id);
                    }}>
                    X
                  </p>
                </div>
                <hr />
              </div>
            );
          }
        })}
      </div>
      <div className="cart-bottom">
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
          <button onClick={() => navigate("/place-order")}>
            Proceed to Checkout
          </button>
        </div>
        <div className="cart-promo-code">
          <div>
            <p>If you have a promocode, enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="PROMOCODE" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;
