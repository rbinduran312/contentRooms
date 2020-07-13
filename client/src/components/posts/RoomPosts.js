// import React, { Fragment, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import Spinner from '../layout/Spinner';
// import PostItem from './PostItem';
// import { getUserPosts } from '../../actions/post';

// const RoomPosts = ({getUserPosts, match , post: {posts}}) => {
//   useEffect(() => {
//     getUserPosts(match.params.id);

//   }, [getUserPosts,match.params.id]);

//   return (
//     <Fragment>
//       <div className='posts'>
//         {posts.map(post => (
//           <PostItem key={post._id} post={post} />
//         ))}
//       </div>
//     </Fragment>
//   );
// };

// getUserPosts.propTypes = {
//   getUserPosts: PropTypes.func.isRequired,
//   post: PropTypes.object.isRequired
// };

// const mapStateToProps = state => ({
//   post: state.post
// });

// export default connect(
//   mapStateToProps,
//   { getUserPosts }
// )(ProfilePosts);
