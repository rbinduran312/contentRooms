import { SendBirdUtil } from '../../utils/sendbird';
import api from '../../utils/api';

class CustomPaginatedQuery {
  constructor(userId) {
    // Required public property to determine if more data is available
    this.userId = userId;
    this.hasNext = true;
  }

  // Required public property
  async next(callback) {
    // make async call and a get list of users
    var filteredUsers = [];

    await SendBirdUtil.getInstance().connect(this.userId);
    const users = await SendBirdUtil.getInstance().getUserList();

    const { data } = await api.get('/profile/me');

    users.forEach(user => {
      data.friends.map(id => {
        if (id === user.userId) {
          filteredUsers.push(user);
        }
      })
    })

    const error = false;
    // set this.hasNext
    this.hasNext = false;
    callback(filteredUsers, error);
  }
}

export default (userId) => new CustomPaginatedQuery(userId);
