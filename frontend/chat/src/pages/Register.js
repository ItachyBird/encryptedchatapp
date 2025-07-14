import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../pagescss/Login.css'

export default function Register() {
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const register = async (e) => {
    e.preventDefault();

    // Optional: simple client-side validation for matching passwords
    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    try {
      const res = await api.post('/auth/register', {
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
      });
      alert(res.data);
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="container">
      <form className="form">
        <div className="form_front">
          <div className="form_details">Sign Up</div>
          <input
            type="text"
            className="input"
            name="username"
            placeholder="Username"
            value={registerForm.username}
            onChange={handleRegisterChange}
          />
          <input
            type="email"
            className="input"
            name="email"
            placeholder="Email"
            value={registerForm.email}
            onChange={handleRegisterChange}
          />
          <input
            type="password"
            className="input"
            name="password"
            placeholder="Password"
            value={registerForm.password}
            onChange={handleRegisterChange}
          />
          <input
            type="password"
            className="input"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={registerForm.confirmPassword}
            onChange={handleRegisterChange}
          />
          <button className="btn" onClick={register}>Register</button>
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
