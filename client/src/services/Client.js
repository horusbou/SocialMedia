import axios from 'axios';
class Client {
  static isLoggedIn() {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    if (accessToken && refreshToken) return true;
    return false;
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
      });
  }
  static async getAllPosts() {
    return axios
      .get('/posts', {
        headers: {
          'x-refresh': localStorage.getItem('refreshToken'),
          Authorization: localStorage.getItem('accessToken'),
        },
      })
      .then(this.checkStatus)
      .then((posts) => {
        return posts.data;
      });
  }
  static signUp(values) {
    return axios.post('/users', values);
  }
  static  login({ email, password }) {
    return axios.post('/sessions', { email, password })
    .then(this.checkStatus)
    .then(this.parseJson)
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
    .catch(error=>{
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw error.response.data;
        }
        throw error
    })
  }
  static logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.removeClientData();
  }
  static getUser() {
    return axios
      .get('/users', {
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
    return axios.get(`/p/${username}`, {
      headers: {
        'x-refresh': localStorage.getItem('refreshToken'),
        Authorization: localStorage.getItem('accessToken'),
      },
    });
  }
  static postPost(body) {
    return axios.post('/post', body, {
      headers: {
        'x-refresh': localStorage.getItem('refreshToken'),
        Authorization: localStorage.getItem('accessToken'),
      },
    })
  }
  static getFollowings(){
    return axios.get('/followings',{
        headers: {
          'x-refresh': localStorage.getItem('refreshToken'),
          Authorization: localStorage.getItem('accessToken'),
        },
      });
  }
  static postFollow(targetId){
    return axios.post('/follow',{targetId},{
        headers: {
          'x-refresh': localStorage.getItem('refreshToken'),
          Authorization: localStorage.getItem('accessToken'),
        },
      });
  }
  static likePost(postId) {
    return axios.post(
      `/like/${postId}`,
      {},
      {
        headers: {
          'x-refresh': localStorage.getItem('refreshToken'),
          Authorization: localStorage.getItem('accessToken'),
        },
      }
    );
  }
  static checkStatus(response) {
    console.log("\n\nresponse\n\n",response)
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const error = new Error(`HTTP Error ${response.statusText}`);
      error.status = response.statusText;
      error.response = response;
      console.log("error=>",error);
      throw error;
    }
  }

  static parseJson(response) {
    console.log("\n\nresponse\n\n",response)
    return response.json();
  }
}
export default Client;
