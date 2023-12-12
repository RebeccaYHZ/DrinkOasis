// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';


function Login() {
  // const navigate = useNavigate();
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === 'username') {
  //     setUsername(value);
  //   } else if (name === 'password') {
  //     setPassword(value);
  //   }
  // };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch('/userApi/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ username: username, password: password }),
  //     });

  //     console.log(response);

  //     if (response.status === 200) {
  //       const data = await response.json();
  //       if (data.success) {
  //         const userData = { id: data.userId, username: username };
  //         sessionStorage.setItem("user", JSON.stringify(userData));
  //         navigate("/Reviews");
  //         console.log('Login successful');
  //       } else {
  //         setErrorMessage('Invalid username or password');
  //       }
  //     } else {
  //       setErrorMessage('Failed to log in');
  //     }
  //   } catch (error) {
  //     console.error('Error during login:', error);
  //     setErrorMessage('Internal Server Error');
  //   }
  // };

  return (
    <div className='wrapper'>
      <h1>Sign in</h1>
      <form action="/userApi/login/password" method="POST">
      <section>
        <label htmlFor="username">Username</label>
        <input 
          id="username" 
          name="username" 
          type="text" 
          autoComplete="username" 
          required autoFocus
          />
      </section>
      <section>
        <label htmlFor="current-password">Password</label>
        <input 
          id="current-password" 
          name="password" 
          type="password" 
          autoComplete="current-password" 
          required/>
        </section>
      <button type="submit">Sign in</button>
    </form>
    </div>
  );
}

export default Login;
