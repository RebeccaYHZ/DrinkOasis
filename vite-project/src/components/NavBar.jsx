import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/NavBar.css';
import logoImage from '../assets/img/logoImage.png';

function Navbar() {
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (window.location.pathname === '/') {
      navbarRef.current.focus();
    }
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
  }, [location]);

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
    role="navigation" aria-label="Main navigation" ref={navbarRef} tabIndex="-1">
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
              <Link to="/Reviews" className="nav-link1">
                Reviews
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Diary" className="nav-link2">
                My Diaries
              </Link>
            </li>
            {!isAuthenticated ? (
          <>
            <li className="nav-item">
              <Link to="/Register" className="nav-link3">
                Sign Up
              </Link>
            </li>
              <li className="nav-item">
                <Link to="/Login" className="nav-link4">
                  Login
                </Link>
              </li>
            </>
            ) : (
              <>
              <li className="nav-item">
                <Link to="/Login" className="nav-link4" onClick={handleLogout}>
                  Logout
                </Link>
              </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

NavBar.propTypes = {};

export default Navbar;
