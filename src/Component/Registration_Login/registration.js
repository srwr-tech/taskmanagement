import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        mobile_no: '',
        agree_term: false,
    });
    const [error, setError] = useState('');

    const handleSignInRedirect = () => {
        navigate('/');
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value, // Handle checkbox state
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return; // Stop the form from submitting
        }
        if (!formData.agree_term) {
            setError('You must agree to the terms');
            return; // Stop the form from submitting
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/signup`, formData);
            console.log('User registered:', response.data);
            navigate('/'); // Redirect to login on successful signup
        } catch (err) {
            setError(err.response?.data || 'Registration failed. Please try again.');
            console.error('Error registering user:', err);
        }
    };

    return (
        <section className="signup">
            <div className="container">
                <div className="signup-content">
                    <div className="signup-form">
                        <h2 className="form-title">Sign up</h2>
                        <form className="register-form" id="register-form" onSubmit={handleSubmit}>
                            {error && <p className="error-message" style={{color:"red"}}>{error}</p>}
                            <div className="form-group">
                                <label htmlFor="username"><i className="zmdi zmdi-account material-icons-name"></i></label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholder="Your Name"
                                    value={formData.username}
                                    onChange={handleChange}
                                    autoComplete="username"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email"><i className="zmdi zmdi-email"></i></label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password"><i className="zmdi zmdi-lock"></i></label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="password"
                                    minLength={8}
                                    maxLength={12}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword"><i className="zmdi zmdi-lock"></i></label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="confirmPassword"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="mobile_no"><i className="zmdi zmdi-phone"></i></label>
                                <input
                                    type="tel"
                                    name="mobile_no"
                                    id="mobile_no"
                                    placeholder="Mobile Number"
                                    value={formData.mobile_no}
                                    onChange={handleChange}
                                    autoComplete="mobile_no"
                                />
                            </div>

                            <div className="form-group">
                                <input type="checkbox" checked={formData.agree_term} name="agree_term" id="agree-term" className="agree-term" onChange={handleChange} />
                                <label htmlFor="agree-term" className="label-agree-term">
                                    <span><span></span></span>I agree all statements in <a href="#" className="term-service">Terms of service</a>
                                </label>
                            </div>
                            <div className="form-group form-button">
                                <input type="submit" name="signup" id="signup" className="form-submit" value="Register" />
                            </div>
                        </form>
                    </div>
                    <div className="signup-image">
                        <figure><img src="/images/signup-image.jpg" alt="sign up" /></figure>
                        <a className="signup-image-link" onClick={handleSignInRedirect}>I am already a member</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SignUp;
