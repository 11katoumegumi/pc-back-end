import request from "../../utils/request";

export function reqGetAttrValueList(category1Id, category2Id, category3Id) {
  return request({
    method: "get",
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
  });
}
export function reqDeleteAttr(attrId) {
  return request({
    method: "delete",
    url: `/admin/product/deleteAttr/${attrId}`
  });
}
