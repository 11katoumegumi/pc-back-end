import request from '../../utils/request'

export function reqGetAclUserList(page, limit, username) {
  return request({
    method: 'GET',
    url: `/admin/acl/user/${page}/${limit}`,
    params: { username }
  })
}

export function reqDeleteUser(id) {
  return request({
    method: 'DELETE',
    url: `/admin/acl/user/remove/${id}`
  })
}
