import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import { GoogleLogin } from 'react-google-login'

const clientId = '1091737462556-jptqdp0b0iqg1u20s7l2mkuod6hcq54r.apps.googleusercontent.com'

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    console.log("Login")
    e.preventDefault();
    login(email, password, null);
  };

  const onForgetPassword = async (e) => {
    console.log("Forgot password")
    e.preventDefault();
  };

  const onGoogleSuccess = (response) => {
    login(email, password, response);
    console.log(response)
  }

  const onGoogleError = (response) => {
    console.error("google sign in err")
    console.log(response)
  }

  if (isAuthenticated) {
      return <Redirect to="/rooms" />;
  }

  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user" /> Sign Into Your Account
      </p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
          />
        </div>
        <button type="submit" className="btn btn-primary" onClick={onSubmit}>Login</button>
        <button type="submit" className="btn btn-primary" onClick={onForgetPassword}>Forget Password</button>
        <GoogleLogin
          onSuccess={res => {
            onGoogleSuccess(res)
            }
          }
          onFailure={onGoogleError}
          clientId={clientId}
          className="google_signin_button"
        >
        </GoogleLogin>
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
