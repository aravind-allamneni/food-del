import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';

import FoodItem from '../FoodItem/FoodItem';
import "./FoodDisplay.css";
import BASE_URL from '../../config';

const FoodDisplay = ({ category }) => {
  const { menuItems } = useContext(StoreContext);
  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className='food-display-list'>
        {menuItems.map((item, index) => {
          if(category==='All' || category===item.category){
            return (
              <FoodItem
                key={index}
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={BASE_URL+'/'+item.image}
              />
            )
          }
        })}
      </div>
    </div>
  )
}
export default FoodDisplay
