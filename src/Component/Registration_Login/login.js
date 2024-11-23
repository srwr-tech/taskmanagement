import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email_id: '',
    your_pass: ''
  });
  const [err, setErr] = useState('');

  // Redirect to the home page after successful login
  const handleHomeRedirect = (id) => {
    console.log("if group id", id)
    if (id==2){
    navigate('/dashboard');
    } else {
      navigate('/home')
    }
  };

  // Redirect to the sign-up page
  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleLinkClick = (e) => {
    e.preventDefault(); // Prevent the default link behavior
    alert('Hi google auth require Google API .');
    
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(process.env.REACT_APP_BASE_URL, " url ")
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/signin`, {
        email_id: formData.email_id,
        your_pass: formData.your_pass
      });
      console.log(response);
      // Assume the backend returns a token on successful login
    const token = response.data.auth;
    console.log(response.data)
    const groupId=response.data.user.group_id

    
    localStorage.setItem('authToken', token);  // Store token in localStorage
      // Redirect to home page after successful login
      handleHomeRedirect(groupId);
    } catch (err) {
      console.error(err);
      setErr('Email or Password is not correct. Please try again.');
    }
  };

  return (
    <section className="sign-in">
      <div className="container">
        <div className="signin-content">
          <div className="signin-image">
            <figure>
              <img src="/images/signin-image.jpg" alt="sign in" />
            </figure>
            <button className="signup-image-link" onClick={handleSignUpRedirect}>
              Create an account
            </button>
          </div>
          <div className="signin-form">
            <h2 className="form-title">Sign in</h2>
            <form onSubmit={handleSubmit} className="register-form" id="login-form">
              <div className="form-group">
                <label htmlFor="email_id">
                  <i className="zmdi zmdi-account material-icons-name"></i>
                </label>
                <input
                  type="text"
                  name="email_id"
                  id="email_id"
                  placeholder="Your Email Id"
                  onChange={handleChange}
                  value={formData.email_id}
                />
              </div>
              <div className="form-group">
                <label htmlFor="your_pass">
                  <i className="zmdi zmdi-lock"></i>
                </label>
                <input
                  type="password"
                  name="your_pass"
                  id="your_pass"
                  placeholder="Password"
                  onChange={handleChange}
                  value={formData.your_pass}
                />
              </div>
              {err && <div className="error-message" style={{color:"red"}}>{err}</div>}
             
              <div className="form-group form-button">
                <input
                  type="submit"
                  name="signin"
                  id="signin"
                  className="form-submit"
                  value="Log in"
                />
              </div>
            </form>
            <div className="social-login">
              <span className="social-label">Or login with</span>
              <ul className="socials">
                <li>
                <a href="https://www.fb.com" target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>
                <i className="display-flex-center zmdi zmdi-facebook"></i>
              </a>
              
                </li>
                <li>
                  <a href="www.x.com" target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>
                    <i className="display-flex-center zmdi zmdi-twitter"></i>
                  </a>
                </li>
                <li>
                  <a href="www.google.com" target="_blank"  onClick={handleLinkClick}>
                    <i className="display-flex-center zmdi zmdi-google"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
