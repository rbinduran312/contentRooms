import React, { Fragment, useState } from 'react';
import { setAlert } from '../../actions/alert';
import { forgot_password, reset_password } from '../../actions/auth';
import PropTypes from "prop-types";
import {connect} from "react-redux";

const ForgotPassword = ({setAlert}) => {
  const [email, setEmail] = useState('');
  const [sent, setSendState] = useState('')
  const [formData, setFormData] = useState({
    verification_code: '',
    password1: '',
    password2: '',
  });
  const { verification_code, password1, password2 } = formData;
  const [verify_available, setVerifyCodeAvailable] = useState(false)
  const [password_available, setPasswordAvailable] = useState(false)
  const [password2_available, setPassword2Available] = useState(false)


  const onPasswordChange = (e) => {
    const passwordRegx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
    setFormData({...formData, [e.target.name]: e.target.value});
    const test = passwordRegx.test(e.target.value)
    if (e.target.name === 'password1') {
      setPasswordAvailable(test)
    } else if (e.target.name === 'password2') {
      setPassword2Available(test)
    }
  }

  const onVerifyCodeChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    const verifyCodeExp = new RegExp("^[0-9]{1,6}$")
    const test = verifyCodeExp.test(e.target.value)
    setVerifyCodeAvailable(test)
  }
  const onResetPassword = async (e) => {
    console.log("onResetPassword")
    e.preventDefault();
    if (verify_available && verification_code !== '') {
      if (password_available && password1 !== '' &&
        password2_available && password2 !== '') {
        if (password1 !== password2) {
          setAlert('Passwords do not match', 'danger');
        }
        else {
          const reset = await reset_password({verification_code, email, password1})
          if (reset.code === "reset") {
            setSendState('reset_ok')
          } else {
            setAlert('Reset failed', 'danger', 10000);
          }
        }
      } else {
        setAlert('You password is wrong', 'danger');
      }
    }
    else {
      setAlert('You should input your verification code', 'danger');
    }
  }

  const onChange = (e) =>
    setEmail(e.target.value);

  const onSend = async (e) => {
    e.preventDefault();
    console.log("send forgot_email")
    const forgot_sent = await forgot_password({email})
    if (forgot_sent.code === "sent") {
      setSendState('sent_ok')
    }
    else {
      setAlert('Invalid email address', 'danger');
    }
  };

  return (
    <>
      {(sent === 'sent_ok') && (
        <Fragment>
          <h1 className="large text-primary">Forgot password ?</h1>
          <p className="lead">
            <i className="fas fa-user"/> Input verification code from your email and reset password.
          </p>
          <form className="form" onSubmit={onResetPassword}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Verification Code"
                name="verification_code"
                value={verification_code}
                onChange={onVerifyCodeChange}
              />
              {!verify_available && verification_code !== '' && (
                <div className="msg-danger">
                  Wrong verification code
                </div>
              )}
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                name="password1"
                value={password1}
                onChange={onPasswordChange}
              />
              {password_available && password1 !== '' && (
                <div className="msg-success">
                  You can use this password
                </div>
              )}
              {!password_available && password1 !== '' && (
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
                onChange={onPasswordChange}
              />
              {password2_available && password2 !== '' && (
                <div className="msg-success">
                  You can use this password
                </div>
              )}
              {!password2_available && password2 !== '' && (
                <div className="msg-danger">
                  Password must contain at least 8 characters, special, number, lower & upper cases.
                </div>
              )}
            </div>
            <input type="submit" className="btn btn-primary" value="ResetPassword"/>
          </form>
        </Fragment>
      )}
      {(sent === '') && (
          <Fragment>
            <h1 className="large text-primary">Forgot password ?</h1>
            <p className="lead">
              <i className="fas fa-user" /> Input your email. We will send confirmation email to you.
            </p>
            <form className="form">
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
              <button type="submit" className="btn btn-primary" onClick={onSend}>Send</button>
            </form>
          </Fragment>
        )
      }
      {(sent === 'reset_ok') && (
        <Fragment>
          <h1 className="large text-primary">Confirm your account</h1>
          <p className="lead">
            <i className="fas fa-user" /> Your password has been reset. Please go to login to sign in.
          </p>
        </Fragment>
      )
      }
      </>

  );
};

ForgotPassword.propTypes = {
  setAlert: PropTypes.func.isRequired
};

export default connect(null,{ setAlert })(ForgotPassword);