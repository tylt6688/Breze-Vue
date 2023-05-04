import request from '@/utils/http'

export default {
  // 获取模块信息
  getModeCardInfo(params) {
    return request({
      url: '/breze/portal/modeCard/find_mode_info',
      method: 'get',
      params: params
    })
  },
  findDataById(id) {
    return request({
      url: '/breze/portal/modeCard/find_data_by_id/' + id,
      method: 'get',
    })
  },
  // 新增或修改菜单
  submitModeForm(editForm, id) {
    return request({
      url: '/breze/portal/modeCard/' + (id ? "update" : "insert"),
      method: 'post',
      data: editForm
    })
  },
  // 删除菜单
  deleteModeCard(id) {
    return request({
      url: '/breze/portal/modeCard/delete_by_id/' + id,
      method: 'delete',
    })
  },
}