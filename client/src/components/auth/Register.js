import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register, checkLiveUsername } from '../../actions/auth';
import PropTypes from 'prop-types';

const Register = ({ setAlert, register, isConfirming }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const [name_available, setAvailable] = useState(false)
  const [password_available, setPasswordAvailable] = useState(false)
  const [password2_available, setPassword2Available] = useState(false)

  const { name, email, password, password2 } = formData;

  const onChange = (e) => {
    const passwordRegx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
    setFormData({...formData, [e.target.name]: e.target.value});
    const test = passwordRegx.test(e.target.value)
    if (e.target.name === 'password') {
      setPasswordAvailable(test)
    } else if (e.target.name === 'password2') {
      setPassword2Available(test)
    }
  }

  const onBlurName = async (e) => {
    const res = await checkLiveUsername(name)
    setAvailable(res.available)
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name_available) {
      setAlert('Your name is not available', 'danger');
    }
    else if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({ name, email, password });
    }
  };

  const onSendAgain = async (e) => {
  }

  const onInputAgain = async (e) => {
  }

  return (
    <>
    {isConfirming ? (
        <Fragment>
          <h1 className="large text-primary">Confirm your account</h1>
          <p className="lead">
            <i className="fas fa-user" /> A verification link has been sent to your email
          </p>
          {/*<form className="form">*/}
          {/*  <button type="submit" className="btn btn-primary" onClick={onSendAgain}>Send confirmation email again</button>*/}
          {/*  <button type="submit" className="btn btn-primary" onClick={onInputAgain}>Input information again</button>*/}
          {/*</form>*/}
        </Fragment>
      ) : (
        <Fragment>
          <h1 className="large text-primary">Sign Up</h1>
          <p className="lead">
            <i className="fas fa-user" /> Create Your Account
          </p>
          <form className="form" onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={name}
                onChange={onChange}
                onBlur={onBlurName}
              />
              {name_available ? (
                <div className="msg-success">
                  Your name is available to use
                </div>
              ) : (
                <div className="msg-danger">
                  Your name is not available to use
                </div>
              )}
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={onChange}
              />
              <small className="form-text">
                This site uses Gravatar so if you want a profile image, use a
                Gravatar email
              </small>
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
              />
              {password_available ? (
                <div className="msg-success">
                  You can use this password
                </div>
              ) : (
                <div className="msg-danger">
                  Password must contain at least 8 characters, special, number, lower & upper cases.
                </div>
              )}
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                name="password2"
                value={password2}
                onChange={onChange}
              />
              {password2_available ? (
                <div className="msg-success">
                  You can use this password
                </div>
              ) : (
                <div className="msg-danger">
                  Password must contain at least 8 characters, special, number, lower & upper cases.
                </div>
              )}
            </div>
            <input type="submit" className="btn btn-primary" value="Register" />
          </form>
          <p className="my-1">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </Fragment>
      )
    }
    </>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isConfirming: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isConfirming: state.auth.isConfirming
});

export default connect(mapStateToProps, { setAlert, register })(Register);
