import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DashboardActions from './DashboardActions';
import { getCurrentProfile, deleteAccount } from '../../actions/profile';
import { logout } from '../../actions/auth';
import ProfileDrafts from '../drafts/ProfileDrafts';


const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  auth: { user },
  profile: { profile },
  logout
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  

  return (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome {user && user.name}
      </p>
        <Fragment>
          <DashboardActions />
          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus" /> Delete My Account
            </button>
          </div>
          <div>
            <a onClick={logout} href='#!'>
            <i className='fas fa-sign-out-alt' />{' '}
            <span className='hide-sm'>Logout</span>
            </a>
          </div>
            <Link to={`/profile`}>
              <i className='fas fa-user-circle text-primary' /> My Profile
            </Link>

          { user.creator === true && (
              <ProfileDrafts user = {user} />
          )}
          

        </Fragment>
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount, logout })(
  Dashboard
);
