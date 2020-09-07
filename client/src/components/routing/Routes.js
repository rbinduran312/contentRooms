import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import ForgotPassword from '../auth/Forgotpassword';
import Alert from '../layout/Alert';
import Dashboard from '../dashboard/Dashboard';
import ProfileForm from '../profile-forms/ProfileForm';
import Profiles from '../profiles/Profiles';
import Profile from '../profile/Profile';

import Rooms from '../rooms/Rooms';
import Room from '../room/Room';
import Events from '../events/Events';
import Event from '../event/Event';
import Venue from '../venue/Venue';

import Posts from '../posts/Posts';
import Post from '../post/Post';
import NotFound from '../layout/NotFound';
import PrivateRoute from '../routing/PrivateRoute';
import PostForm from '../posts/PostForm';
import Chat from '../messaging/Chat';
import DraftForm from '../drafts/DraftForm';
import Drafts from '../drafts/Drafts';

const Routes = (props) => {
	return (
		<section className='container'>
			<Alert />
			<Switch>
				<Route exact path='/register' component={Register} />
				<Route exact path='/login' component={Login} />
				<Route exact path='/forgot_password' component={ForgotPassword} />
				<Route exact path='/profiles' component={Profiles} />
				<Route exact path='/profile/:id' component={Profile} />

				<Route exact path='/rooms' component={Rooms} />
				<Route exact path='/room/:id' component={Room} />
				<Route exact path='/events' component={Events} />

				<PrivateRoute exact path='/event/:id' component={Event} />
				<PrivateRoute exact path='/event/:id/venue' component={Venue} />
				<PrivateRoute
					exact
					path='/event/:id/venue/:stageName'
					component={Venue}
				/>
				<PrivateRoute exact path='/dashboard' component={Dashboard} />
				<PrivateRoute exact path='/create-profile' component={ProfileForm} />
				<PrivateRoute exact path='/edit-profile' component={ProfileForm} />
				<PrivateRoute exact path='/posts' component={Posts} />
				<PrivateRoute exact path='/drafts' component={Drafts} />
				<PrivateRoute exact path='/posts/:id' component={Post} />
				<PrivateRoute exact path='/create' component={DraftForm} />
				<PrivateRoute exact path='/createPost' component={PostForm} />
				<PrivateRoute exact path='/messaging' component={Chat} />
				<PrivateRoute exact path='/profiles' component={Profiles} />
				<PrivateRoute exact path='/profile/:id' component={Profile} />
				<Route component={NotFound} />
			</Switch>
		</section>
	);
};

export default Routes;
