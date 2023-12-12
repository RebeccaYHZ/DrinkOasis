import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

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
    <div className='wrapper'>
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit}>
        <section>
          <label htmlFor="username">Username</label>
          <input 
            id="username" 
            name="username" 
            type="text" 
            autoComplete="username" 
            required 
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </section>
        <section>
          <label htmlFor="current-password">Password</label>
          <input 
            id="current-password" 
            name="password" 
            type="password" 
            autoComplete="current-password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </section>
        <button type="submit">Sign in</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
