import SendBird from 'sendbird';

let instance = null;

class SendBirdUtil {
  constructor() {
    if (instance) {
      return instance;
    }
    this.sb = new SendBird({
      appId: process.env.REACT_APP_SENDBIRD_APP_ID
    });
    this.userQuery = null;
    this.friendListQuery = null;
    instance = this;
  }

  connect(userId) {
    return new Promise((resolve, reject) => {
      const sb = SendBird.getInstance();
      sb.connect(
        userId,
        (user, error) => {
          if (error) {
            return reject(error);
          }

          resolve(user);
        });
    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      this.sb.disconnect((response, error) => {
        error ? reject(error) : resolve();
      });
    });
  }

  getUserList() {
    this.userQuery = this.sb.createApplicationUserListQuery();
    this.userQuery.limit = 100;

    return new Promise((resolve, reject) => {
      if (this.userQuery.hasNext && !this.userQuery.isLoading) {
        this.userQuery.next((list, error) => {
          error ? reject(error) : resolve(list);
        });
      } else {
        resolve([]);
      }
    });
  }

  getFriendList() {
    if (!this.friendListQuery) {
      this.friendListQuery = this.sb.createFriendListQuery();
    }
    return new Promise((resolve, reject) => {
      if (this.friendListQuery.hasNext && !this.friendListQuery.isLoading) {
        this.friendListQuery.next((list, error) => {
          error ? reject(error) : resolve(list);
        });
      } else {
        resolve([]);
      }
    });
  }

  addFriend(friendMap) {
    return new Promise((resolve, reject) => {
      this.sb.uploadFriendDiscoveries(JSON.stringify(friendMap), (response, error) => {
        error ? reject(error) : resolve(response);
      })
    })
  }

  static getInstance() {
    return new SendBirdUtil();
  }
}

export {
  SendBirdUtil
};
