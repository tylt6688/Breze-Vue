import axios from '@/http/axios'

export default{
 // 获取表数据 
 getLoginLogInfoList(params){
    return axios({
      url: '/loginlog/list',
      method: 'get',
      data: params
    })
  },
}