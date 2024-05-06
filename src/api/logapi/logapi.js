import request from '@/utils/request'

export default{
  
 getLoginLogInfoList(params){
    return request({
      url: '/tool/log/list_login_log',
      method: 'get',
      params: params
    })
  },

  getHandleLogInfoList(params){
    return request({
      url: '/tool/log/list_handle_log',
      method: 'get',
      params: params
    })
  },
  getUserLoginData(){
    return request({
      url: '/tool/log/login_count',
      method: 'get',
    })
  },
  getUserLoginCategory(){
    return request({
      url: '/tool/log/login_category',
      method: 'get',
    })
  },
}