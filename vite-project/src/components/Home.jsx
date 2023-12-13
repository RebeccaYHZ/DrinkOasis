import { useNavigate } from 'react-router-dom';
import '../assets/css/Home.css';
import cocktailImage from '../assets/img/Cocktails - Making Pictures.jpeg';

const Home = () => {
  const navigate = useNavigate();

  const goToReviews = () => {
    navigate('/Reviews');
  };
  return (
    <main className="home-container" role="main">
      <section className="home-content">
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
          <img src={cocktailImage} alt="A photo of a cocktail bar" />
        </div>
      </section>
    </main>
  );
};

export default Home;
