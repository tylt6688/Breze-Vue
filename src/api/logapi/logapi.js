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
      url: '/tool/log/listHandleLog',
      method: 'get',
      params: params
    })
  },
}