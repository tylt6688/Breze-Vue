import axios from '@/utils/http/axios'

export default {
  // 获取模块信息
  getModeCardInfo(params) {
    return axios({
      url: '/breze/portal/modeCard/findModeCardInfo',
      method: 'get',
      params: params
    })
  },
  findDataById(id){
    return axios({
      url: '/breze/portal/modeCard/findDataById/'+id,
      method: 'get',
    })
  },
  // 新增或修改菜单
  submitModeForm(editForm, id) {
    return axios({
      url: '/breze/portal/modeCard/' + (id ? "update" : "insert"),
      method: 'post',
      data: editForm
    })
  },
  // 删除菜单
  deleteModeCard(id) {
    return axios({
      url: '/breze/portal/modeCard/deleteById/' + id,
      method: 'delete',
    })
  },
}