import request from "../../utils/request";

export function reqGetTrademarkList(page, limit) {
  return request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: "Get"
  });
}

export function reqSaveTrademark(tmName, logoUrl) {
  return request({
    url: "/admin/product/baseTrademark/save",
    method: "POST",
    data: {
      tmName,
      logoUrl
    }
  });
}
export function reqUpdateTrademark(data) {
  return request({
    url: "/admin/product/baseTrademark/update",
    method: "PUT",
    data
  });
}

export function reqDeleteTrademark(id) {
  return request({
    method: "DELETE",
    url: `/admin/product/baseTrademark/remove/${id}`
  });
}
