import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logoImage from '../assets/img/logoImage.png';

function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/userApi/checkAuth");
  
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setIsAuthenticated(false);
      }
    };
  
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/userApi/logout", {
        method: "GET",
      });

      if (response.status === 200) {
        sessionStorage.removeItem("user");
        navigate('/Login');
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
    navigate('/Login');
  };

  // const isAuthenticated = sessionStorage.getItem("user") !== null;

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary" 
    role="navigation" aria-label="Main navigation">
      <div className="container-fluid">
        <div className="brand-top">
          <Link to="/" className='top-brand'>
            <img className="logo" src={logoImage} alt="DrinkOasis Logo" />
            <span className="navbar-brand">DrinkOasis</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className="justify-content-end" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/Reviews" className="nav-link">
                Reviews
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Diary" className="nav-link">
                My Diaries
              </Link>
            </li>
            {!isAuthenticated && (
            <li className="nav-item">
              <Link to="/Register" className="nav-link">
                Sign Up
              </Link>
            </li>
            )}
            {!isAuthenticated && (
              <li className="nav-item">
                <Link to="/Login" className="nav-link">
                  Login
                </Link>
              </li>
            )}
            {isAuthenticated && (
              <li className="nav-item">
                <Link to="/Login" className="nav-link" onClick={handleLogout}>
                  Logout
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
