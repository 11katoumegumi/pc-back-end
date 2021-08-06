import request from '../../utils/request'

export function reqGetPermissionListById(roleId) {
  return request({
    method: 'GET',
    url: `/admin/acl/permission/toAssign/${roleId}`
  })
}
