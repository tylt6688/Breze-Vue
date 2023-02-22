import Element from "element-ui"
import router from "@/router"
/**
 * 倒计时提示信息工具，启动函数countDownMessage(),参数index-->倒计时数。messageInfo-->返回数据错误提示
 */
var element = null;

function countTime(index, msg) {
    setTimeout(function () {
        if (index == 0) {
            // 计时结束后的操作
            
            router.replace("/login");
        } else {
            element.message = msg + `,将在${index}秒后返回登录页面`;
            countTime(--index, msg);
        }
    }, 1000);
}

export function countDownMessage(index, msg) {
    element = Element.Message({
        showClose: false,
        message: msg + `,将在${index}秒后返回登录页面`,
        type: "error",
        duration: `${index}000`
    });
    index--
    countTime(index, msg);
}
export default{
    countDownMessage
}