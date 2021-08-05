import request from "../../utils/request";

export function reqSpuBySpuId(spuId) {
  return request({
    method: "GET",
    url: `/admin/product/getSpuById/${spuId}`
  });
}
export function reqdeleteSku(skuId) {
  return request({
    method: "DELETE",
    url: `/admin/product/deleteSku/${skuId}`
  });
}

export function reqSkuList(page, limit) {
  return request({
    method: "GET",
    url: `/admin/product/list/${page}/${limit}`
  });
}
export function reqSpuImageListBySpuId(spuId) {
  return request({
    method: "GET",
    url: `/admin/product/spuImageList/${spuId}`
  });
}
export function reqSaveSkuInfo(data) {
  return request({
    method: "POST",
    url: "/admin/product/saveSkuInfo",
    data
  });
}
