import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../pagescss/Login.css'; // Make sure styles for .container, .form, etc. are defined

export default function Login() {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', loginForm);
      localStorage.setItem('username', res.data.username);
      navigate('/chat');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="container">
      <input id="signup_toggle" type="checkbox" />
      <form className="form">
        {/* Login Front */}
        <div className="form_front">
          <div className="form_details">Login</div>
          <input
            type="text"
            className="input"
            name="email"
            placeholder="Email"
            onChange={handleLoginChange}
          />
          <input
            type="password"
            className="input"
            name="password"
            placeholder="Password"
            onChange={handleLoginChange}
          />
          <button className="btn" onClick={login}>Login</button>
          <span className="switch">
            Don't have an account?{' '}
            <label htmlFor="signup_toggle" className="signup_tog">
              Sign Up
            </label>
          </span>
        </div>

        {/* Signup Back (Placeholder Only) */}
        <div className="form_back">
          <div className="form_details">SignUp</div>
          <input type="text" className="input" placeholder="Firstname" />
          <input type="text" className="input" placeholder="Username" />
          <input type="password" className="input" placeholder="Password" />
          <input type="password" className="input" placeholder="Confirm Password" />
          <button className="btn">Signup</button>
          <span className="switch">
            Already have an account?{' '}
            <label htmlFor="signup_toggle" className="signup_tog">
              Sign In
            </label>
          </span>
        </div>
      </form>
    </div>
  );
}
