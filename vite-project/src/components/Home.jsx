import { useNavigate } from 'react-router-dom';
import '../assets/css/Home.css';
import cocktailImage from '../assets/img/Bar.jpeg';

const Home = () => {
  const navigate = useNavigate();

  const goToReviews = () => {
    navigate('/Reviews');
  };
  // Home Page has a very good hierarchy of html elements
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-text">
          <h1>Explore DrinkOasis</h1>
          <p className="description">
            Discover, share, and celebrate the art of cocktail making. Connect with local bars, 
            explore new recipes, and document your mixology journey.
          </p>
          <div className="authors">
            <p>Created by Xiangyue Zhang & Yahui Zhang</p>
          </div>
          <div className='button'>
            <button onClick={goToReviews} className="reviews-button">
              Enter Site
            </button>
          </div>
        </div>
        <div className="home-image">
          <img src={cocktailImage} alt="Cocktail" />
        </div>
      </div>
    </div>
  );
};

export default Home;
