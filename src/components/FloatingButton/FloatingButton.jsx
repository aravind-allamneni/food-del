import React from "react";
import "./FloatingButton.css";
import { Link } from "react-router-dom";

function FloatingButton({ onClick }) {
  return (
    <Link to="/cart">
      <button className="floating-button" onClick={onClick}>
        Proceed to Cart
      </button>
    </Link>
  );
}

export default FloatingButton;
