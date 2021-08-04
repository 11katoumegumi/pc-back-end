import request from "../../utils/request";

export function reqSpuBySpuId(spuId) {
  return request({
    method: "GET",
    url: `/admin/product/getSpuById/${spuId}`
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
