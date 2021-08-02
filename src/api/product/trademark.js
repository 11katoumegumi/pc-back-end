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
