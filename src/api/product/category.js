import request from '../../utils/request'

export function reqGetCategory1List() {
  return request({
    method: 'get',
    url: `/admin/product/getCategory1`
  })
}
export function reqGetCategory2List(category1Id) {
  return request({
    method: 'get',
    url: `/admin/product/getCategory2/${category1Id}`
  })
}
export function reqGetCategory3List(category2Id) {
  return request({
    method: 'get',
    url: `/admin/product/getCategory3/${category2Id}`
  })
}
