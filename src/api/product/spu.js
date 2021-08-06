import request from '../../utils/request'

export function reqGetSpuList({ page, limit, category3Id }) {
  return request({
    method: 'get',
    url: `/admin/product/${page}/${limit}`,
    params: { category3Id }
  })
}
export function reqGetTrademarkList() {
  return request({
    method: 'get',
    url: `/admin/product/baseTrademark/getTrademarkList`
  })
}
export function reqGetSaleAttrList() {
  return request({
    method: 'get',
    url: `/admin/product/baseSaleAttrList`
  })
}
export function reqGetSpuSaleAttrList(spuId) {
  return request({
    method: 'get',
    url: `/admin/product/getSpuById/${spuId}`
  })
}
export function reqDeleteSpu(spuId) {
  return request({
    method: 'delete',
    url: `/admin/product/deleteSpu/${spuId}`
  })
}

export function reqSaveSpuInfo(data) {
  return request({
    method: 'post',
    url: '/admin/product/saveSpuInfo',
    data
  })
}
export function reqUpdateSpuInfo(data) {
  return request({
    method: 'post',
    url: '/admin/product/updateSpuInfo',
    data
  })
}
