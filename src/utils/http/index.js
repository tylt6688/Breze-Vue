import axios from 'axios'
import router from '@/router'
import store from '@/store'
import { countDownMessage } from '@/utils/countdown'
import { Message } from 'element-ui'


axios.defaults.baseURL = process.env.VUE_APP_BASE_API

const service = axios.create({
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json; charset=utf-8'
	}
})
// 进行request请求数据拦截处理
service.interceptors.request.use(config => {
	let token = store.getters.getToken;
	console.log("打印Cookie token", token,token===undefined);
	// 将所有请求头里面进行jwt设置，方便权限访问
	config.headers['Authorization'] = 'Bearer ' + token;
	return config
})
// 进行response返回数据拦截处理
service.interceptors.response.use(
	response => {
		console.log('AllResponse ===>>>', response);
		// 缩短一点变为res
		let res = response.data;
		console.log('响应数据ResponseData===>>>', res);
		// 判断后端响应是否正确或是否为文件类型
		if (res.success || res instanceof ArrayBuffer) {
			return response;
		} else if (res.errorCode === 900) {
			countDownMessage(3, res.message);
		}
		return Promise.reject(res.message);
	},
	// 异常情况判断
	error => {
		console.log('请求异常===>>>', error, '网络异常码===>>>', error.response);
		if (error.response.data) {
			error.massage = error.response.data.message;
			const errorCode = error.response.status;
			switch (errorCode) {
				case 401:
					store.commit("removeToken");
					countDownMessage(3, error.massage);
					break;
				case 403:
					router.push('/403');
					Message.error(error.massage, {
						showClose: false,
						duration: 1500
					})
					break;
				case 404:
					router.push('/404');
					Message.error(error.massage, {
						showClose: false,
						duration: 1500
					})
					break;
				case 500:
					// 需要进行更加细致的判断  FIXME 待进一步优化
					if (error.response.data.errorCode === 700) {
						Message.error(error.massage, {
							showClose: false,
							duration: 1500
						})
						break;
					}
					Message.error(error.massage, {
						showClose: false,
						duration: 1500
					})
					break;

				default:
					break;
			}
		}
		return Promise.reject(error);
	})

export default service