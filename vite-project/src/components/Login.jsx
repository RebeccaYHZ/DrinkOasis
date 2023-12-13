import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Register.css';

function Login() {
  const navigate = useNavigate();
  const mainContentRef = useRef(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    mainContentRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/userApi/login/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log('Login successful');
        navigate('/');
      } else {
        const errorData = await response.json();
        console.log(errorData);
        setError(errorData.message);
        console.error('Login failed', errorData);
      }
    } catch (error) {
      setError('An error occurred');
      console.error('Login failed', error);
    }
  };
  

  return (
    <div className='wrapper' ref={mainContentRef} tabIndex="-1">
      <h1 className="form-register-heading">Login</h1>
      <form className="form-register" onSubmit={handleSubmit}>
        <section>
        <div className="label-container">
          <label htmlFor="username">Username</label>
          </div>
          <input 
            id="username" 
            name="username" 
            type="text"
            className="form-control" 
            autoComplete="username" 
            required 
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </section>
        <section>
        <div className="label-container">
          <label htmlFor="current-password">Password</label>
          </div>
          <input 
            id="current-password" 
            name="password" 
            type="password"
            className="form-control" 
            autoComplete="current-password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </section>
        <button className="btn btn-lg btn-block btn-submit" type="submit">Sign in</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
