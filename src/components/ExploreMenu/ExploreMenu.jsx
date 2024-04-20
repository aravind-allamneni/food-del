import './ExploreMenu.css';
import { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import BASE_URL from '../../config';

const ExploreMenu = ({ category, setCategory }) => {
  const { categories } = useContext(StoreContext);
  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Explore our menu</h1>
      <p className='explore-menu-text'>
        Choose from a diverse menue featuring a delectable array of dishes. Our
        mission is to satisfy your cravings and elevate your dining experience,
        one delicious meal at a time.
      </p>
      <div className='explore-menu-list'>
        {categories.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory(prev =>
                  prev === item.name ? 'All' : item.name
                )
              }
              key={index}
              className='explore-menu-list-item'
            >
              <img
                className={category === item.name ? 'active' : ''}
                src={BASE_URL+"/"+item.image}
                alt='/'
              />
              <p>{item.name}</p>
            </div>
          )
        })}
      </div>
      <hr />
    </div>
  )
}
export default ExploreMenu
