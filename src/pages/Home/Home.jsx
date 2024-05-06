import { useContext, useState } from "react";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import Header from "../../components/Header/Header";
import "./Home.css";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";
import FloatingButton from "../../components/FloatingButton/FloatingButton";
import { StoreContext } from "../../context/StoreContext";

const Home = () => {
  const [category, setCategory] = useState("All");
  const { cartItems } = useContext(StoreContext);
  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      {Object.keys(cartItems).length === 0 ? <></> : <FloatingButton />}
      <FoodDisplay category={category} />
      <AppDownload />
    </div>
  );
};
export default Home;
