import request from '../../utils/request'

export function reqGetAclRoleList(page, limit, roleName) {
  return request({
    method: 'GET',
    url: `/admin/acl/role/${page}/${limit}`,
    params: { roleName }
  })
}

export function reqDeleteRole(id) {
  return request({
    method: 'DELETE',
    url: `/admin/acl/role/remove/${id}`
  })
}
export function reqSaveRole(data) {
  return request({
    method: 'POST',
    url: `/admin/acl/role/save`,
    data
  })
}
export function reqUpdateRole(data) {
  return request({
    method: 'PUT',
    url: `/admin/acl/role/update`,
    data
  })
}
