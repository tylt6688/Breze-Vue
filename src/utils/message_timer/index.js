import Message from 'element-ui'
import router from "@/router"
/**
 * 倒计时提示信息工具，启动函数countDownMessage(),参数index-->倒计时数。messageInfo-->返回数据错误提示
 */
var element = null;

function countTime(index, messageInfo) {
    setTimeout(function () {
        if (index == 0) {
            // 计时结束后的操作
            localStorage.clear();
            router.push("/login");
        } else {
            element.message = messageInfo + `,将在${index}秒后返回登陆页面`;
            countTime(--index, messageInfo);
        }
    }, 1000);
};
export function countDownMessage(index, messageInfo) {
    element = Message({
        showClose: false,
        message: messageInfo + `,将在${index}秒后返回登陆页面`,
        type: "error",
        duration: `${index}000`
    });
    index--
    countTime(index, messageInfo);
}