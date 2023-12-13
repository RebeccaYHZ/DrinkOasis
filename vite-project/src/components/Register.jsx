import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Register.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const navigate = useNavigate();
  const mainContentRef = useRef(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    mainContentRef.current.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/userApi/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password}),
      });

      if (response.status === 200) {
          navigate("/Login");
          console.log('Registration successful');
      } else {
        setErrorMessage('Failed to register');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErrorMessage('Internal Server Error');
    }
  };

  return (
    <div className="wrapper" ref={mainContentRef} tabIndex="-1">
      <h1 className="form-register-heading">Registration</h1>
      <form className="form-register" onSubmit={handleRegister}>
        <div>
          <div className="label-container">
            <label>Username:</label>
          </div>
          <input
            type="text"
            className="form-control"
            name="username"
            value={username}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="label-container">
            <label>Email:</label>
          </div>
          <input
            type="email"
            className="form-control"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="label-container">
            <label>Password:</label>
          </div>
          <input
            type="password"
            className="form-control"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-lg btn-block btn-submit" type="submit">
          Register
        </button>
        <p>{errorMessage}</p>
      </form>
    </div>
  );
}

Register.propTypes = {};

export default Register;
