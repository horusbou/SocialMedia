import axios from 'axios';
class Client {
	constructor() {
		this.sessionData = {};
		this.userData = {};
	}
	isLoggedIn() {
		const accessToken = localStorage.getItem('accessToken');
		const refreshToken = localStorage.getItem('refreshToken');
		console.log(accessToken, refreshToken);
		if (accessToken && refreshToken) return true;
		return false;
	}
	setClientData({ sessionData, userData }) {
		this.sessionData = sessionData;
		this.userData = userData;
	}
	removeClientData() {
		this.sessionData = {};
		this.userData = {};
	}
	getUserData(username) {
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
	getAllPosts() {
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
	login({ email, password }) {
		return axios.post('/sessions', { email, password }).then((result) => {
			const accessToken = result.data.accessToken;
			const refreshToken = result.data.refreshToken;
			if (refreshToken && accessToken) {
				axios.defaults.headers.common['x-refresh'] = refreshToken;
				axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
				localStorage.setItem('accessToken', `Bearer ${accessToken}`);
				localStorage.setItem('refreshToken', refreshToken);
			}
		});
	}
	logout() {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		this.removeClientData();
	}
	getUser() {
		return axios
			.get('/users', {
				headers: {
					'x-refresh': localStorage.getItem('refreshToken'),
					Authorization: localStorage.getItem('accessToken'),
				},
			})
			.then((result) => {
				console.log(result);
				return result.data.dataValues;
			});
	}
	getProfilePosts(username) {
		return axios.get(`/p/${username}`, {
			headers: {
				'x-refresh': localStorage.getItem('refreshToken'),
				Authorization: localStorage.getItem('accessToken'),
			},
		});
	}
	postPost(body) {
		return axios.post('/post', body, {
			headers: {
				'x-refresh': localStorage.getItem('refreshToken'),
				Authorization: localStorage.getItem('accessToken'),
			},
		});
	}
	likePost(postId) {
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
	checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response;
		} else {
			const error = new Error(`HTTP Error ${response.statusText}`);
			error.status = response.statusText;
			error.response = response;
			console.log(error);
			throw error;
		}
	}

	parseJson(response) {
		return response.json();
	}
}
export default new Client();
