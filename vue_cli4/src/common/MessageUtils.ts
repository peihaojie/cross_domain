/*
 * @Date         : 2020-03-05 11:41:16
 * @LastEditors  : HaoJie
 * @LastEditTime : 2020-06-11 16:53:50
 * @FilePath     : \src\common\MessageUtils.ts
 */
import { Message } from "element-ui";

function msgBox(type: any, msg: string) {
  Message({
    message: msg,
    type: type,
    showClose: true,
    center: true,
    customClass: "message-box"
  });
}

export default {
  success: (data: string) => {
    msgBox("success", data);
  },
  warning: (e: any) => {
    console.log(e);
    if (!e) {
      msgBox("warning", "未知错误！");
      return;
    }
    if (e.response && e.response.data && e.response.data.message) {
      msgBox("warning", e.response.data.message);
      return;
    }
    if (!e.message) {
      msgBox("warning", e.message || e);
    }
  },
  error: (e: any) => {
    console.log(e);
    if (!e) {
      msgBox("error", "未知错误！");
      return;
    }
    if (e.response && e.response.data && e.response.data.message) {
      msgBox("error", e.response.data.message);
      return;
    }
    if (!e.message) {
      msgBox("error", e.message || e);
    }
  }
};