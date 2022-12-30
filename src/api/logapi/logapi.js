import axios from '@/utils/http'

export default{
  
 getLoginLogInfoList(params){
    return axios({
      url: '/tool/log/list_login_log',
      method: 'get',
      params: params
    })
  },

  getHandleLogInfoList(params){
    return axios({
      url: '/tool/log/list_handle_log',
      method: 'get',
      params: params
    })
  },
  getUserLoginData(){
    return axios({
      url: '/tool/log/login_count',
      method: 'get',
    })
  },
  getUserLoginCategory(){
    return axios({
      url: '/tool/log/login_category',
      method: 'get',
    })
  },
}