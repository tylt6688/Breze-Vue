import { Message } from 'element-ui';
import router from "@/router";
/**
 * 倒计时提示信息工具，启动函数countDownMessage(),参数time-->倒计时数。msg-->错误提示
 */
var element = null;

function countTime(time, msg) {
    setTimeout(function () {
        if (time == 0) {
            // 计时结束后的操作
            localStorage.clear();
            router.replace("/login");
        } else {
            element.message = msg + `,将在${time}秒后返回登录页面`;
            countTime(--time, msg);
        }
    }, 1000);
}

export function countDownMessage(time, msg) {
    element = Message({
        showClose: false,
        message: msg + `,将在${time}秒后返回登录页面`,
        type: "error",
        duration: `${time}000`
    });
    time--
    countTime(time, msg);
}
export default{
    countDownMessage
}