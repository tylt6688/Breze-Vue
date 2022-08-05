import axios from '@/utils/http/axios'

export default{
  
 getLoginLogInfoList(params){
    return axios({
      url: '/tool/log/listLoginLog',
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