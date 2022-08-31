import axios from 'axios';
class Client {
  static isLoggedIn() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) return true;
    return false;
  }
  static postComment(tweet_id, body) {
    return axios
      .post(`/tweets/${tweet_id}/comment`, body, {
        headers: {
          'x-refresh': localStorage.getItem('refreshToken'),
          Authorization: localStorage.getItem('accessToken'),
        },
      })
  }
  static userValidation(username) {
    return axios
      .get(`/userverification/${username}`)
      .then((user) => {
        return user;
      }).catch(this.catchError);
  }
  static getUserData(username) {
    return axios
      .get(`/users/${username}`, {
        headers: {
          'x-refresh': localStorage.getItem('refreshToken'),
          Authorization: localStorage.getItem('accessToken'),
        },
      })
      .then(this.checkStatus)
      .then((user) => {
        return user;
      }).catch(this.catchError);
  }
  static async getAllPosts() {
    return axios
      .get('/tweets', {
        headers: {
          'x-refresh': localStorage.getItem('refreshToken'),
          Authorization: localStorage.getItem('accessToken'),
        },
      })
      .then(this.checkStatus)
      .then((posts) => {
        return posts.data;
      }).catch(this.catchError);
  }
  static getParticipent() {
    return axios
      .get('/messages', {
        headers: {
          'x-refresh': localStorage.getItem('refreshToken'),
          Authorization: localStorage.getItem('accessToken'),
        },
      })
  }
  static async changeAvatar(imageUrl) {
    const res = await axios
      .post('/users/user/avatar', { imageUrl }, {
        headers: {
          'x-refresh': localStorage.getItem('refreshToken'),
          Authorization: localStorage.getItem('accessToken'),
        }
      })
    return res.data.cropedPicture;
  }
  static async changeBanner(body) {
    const res = await axios
      .post('/users/user/banner', body, {
        headers: {
          'x-refresh': localStorage.getItem('refreshToken'),
          Authorization: localStorage.getItem('accessToken'),
        }
      })
    return await res.data.cropedBanner;
  }
  static signUp(values) {
    return axios.post('/users', values).then((data) => {
      console.log(data)
    }).catch(error => { throw error });
  }
  static login({ email, password }) {
    return axios.post('/sessions', { email, password })
      .then(this.checkStatus)
      .then((result) => {
        const accessToken = result.data.accessToken;
        const refreshToken = result.data.refreshToken;
        if (refreshToken && accessToken) {
          axios.defaults.headers.common['x-refresh'] = refreshToken;
          axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          localStorage.setItem('accessToken', `Bearer ${accessToken}`);
          localStorage.setItem('refreshToken', refreshToken);
        }
      })
      .catch(this.catchError)
  }
  static logout() {
    return axios
      .delete('/sessions', {
        headers: {
          'x-refresh': localStorage.getItem('refreshToken'),
          Authorization: localStorage.getItem('accessToken'),
        },
      }).then((data) => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return data
      })
  }
  static getUser() {
    return axios
      .get('/user', {
        headers: {
          'x-refresh': localStorage.getItem('refreshToken'),
          Authorization: localStorage.getItem('accessToken'),
        },
      })
      .then((result) => {
        return result.data;
      });
  }
  static getProfilePosts(username) {
    return axios.get(`/tweets/profile/${username}`, {
      headers: {
        'x-refresh': localStorage.getItem('refreshToken'),
        Authorization: localStorage.getItem('accessToken'),
      },
    });
  }
  static sendMessage({ message, reciever_id }) {
    return axios.post(`/messages/${reciever_id}`, { message }, {
      headers: {
        'x-refresh': localStorage.getItem('refreshToken'),
        Authorization: localStorage.getItem('accessToken'),
      },
    })
  }
  static getMessages({ reciever_id }) {
    return axios.get(`/messages/${reciever_id}`, {
      headers: {
        'x-refresh': localStorage.getItem('refreshToken'),
        Authorization: localStorage.getItem('accessToken'),
      },
    })
  }
  static postPost(body) {
    return axios.post('/tweet', body, {
      headers: {
        'x-refresh': localStorage.getItem('refreshToken'),
        Authorization: localStorage.getItem('accessToken'),
      },
    })
  }

  static postRetweet(tweet_id, body) {
    return axios.post('/retweets/' + tweet_id, body, {
      headers: {
        'x-refresh': localStorage.getItem('refreshToken'),
        Authorization: localStorage.getItem('accessToken'),
      },
    })
  }
  static deleteRetweet(tweet_id) {
    return axios.delete('/retweets/' + tweet_id, {
      headers: {
        'x-refresh': localStorage.getItem('refreshToken'),
        Authorization: localStorage.getItem('accessToken'),
      },
    })
  }
  static getTweet(tweet_id) {
    return axios.get(`/tweets/${tweet_id}`, {
      headers: {
        'x-refresh': localStorage.getItem('refreshToken'),
        Authorization: localStorage.getItem('accessToken'),
      },
    })
  }
  static getFollowings() {
    return axios.get('/followings', {
      headers: {
        'x-refresh': localStorage.getItem('refreshToken'),
        Authorization: localStorage.getItem('accessToken'),
      },
    });
  }
  static postFollow(targetId) {
    return axios.post('/follow', { targetId }, {
      headers: {
        'x-refresh': localStorage.getItem('refreshToken'),
        Authorization: localStorage.getItem('accessToken'),
      },
    });
  }
  static likePost(tweet_id) {
    return axios.post(
      `/tweets/${tweet_id}/like`,
      {},
      {
        headers: {
          'x-refresh': localStorage.getItem('refreshToken'),
          Authorization: localStorage.getItem('accessToken'),
        },
      }
    );
  }

  static unlikePost(tweet_id) {
    return axios.delete(
      `/tweets/${tweet_id}/unlike`,
      {
        headers: {
          'x-refresh': localStorage.getItem('refreshToken'),
          Authorization: localStorage.getItem('accessToken'),
        },
      }
    );
  }
  static getBookmarks() {
    return axios.get(`/bookmarks`, {
      headers: {
        'x-refresh': localStorage.getItem('refreshToken'),
        Authorization: localStorage.getItem('accessToken'),
      },
    }).then((res) => {
      return res.data;
    })
  }
  static getUserLikes(username) {
    return axios.get(`/users/${username}/likes`, {
      headers: {
        'x-refresh': localStorage.getItem('refreshToken'),
        Authorization: localStorage.getItem('accessToken'),
      },
    }).then((res) => {
      return res.data;
    })
  }
  static bookmarkATweet(tweet_id) {
    return axios.post(`/bookmarks/${tweet_id}`, {}, {
      headers: {
        'x-refresh': localStorage.getItem('refreshToken'),
        Authorization: localStorage.getItem('accessToken'),
      },
    }).then((res) => {
      return res.data;
    })
  }
  static deleteABookmark(tweet_id) {
    return axios.delete(`/bookmarks/${tweet_id}`, {
      headers: {
        'x-refresh': localStorage.getItem('refreshToken'),
        Authorization: localStorage.getItem('accessToken'),
      },
    }).then((res) => {
      return res.data;
    })
  }
  static async searchForUser(query) {
    const users = await axios.get(`/searchuser?username=${query}`, {
      headers: {
        'x-refresh': localStorage.getItem('refreshToken'),
        Authorization: localStorage.getItem('accessToken'),
      },
    })
    return users;
  }
  static async getAllUsers() {
    const users = await axios.get(`/users`, {
      headers: {
        'x-refresh': localStorage.getItem('refreshToken'),
        Authorization: localStorage.getItem('accessToken'),
      },
    })
    return users;
  }
  static checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(`HTTP Error ${response.statusText}`);
      error.status = response.statusText;
      error.response = response;
      throw error;
    }
  }

  static parseJson(response) {
    return response.json();
  }
  static catchError(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw error.response.data;
    }
    if (error.request) {
      // The client never received a response, and the request was never left
      throw error.request
    }
    throw error
  }
}
export default Client;
