import axios from '@/utils/http/axios'

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
}