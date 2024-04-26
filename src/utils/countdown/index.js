/**
 * 倒计时提示信息工具，启动函数countDownMessage(),参数time-->倒计时数。msg-->错误提示
 */

import { Message } from 'element-ui';
import router from "@/router";

let element = null;

export function countDownMessage(time, msg) {
    let countTime = (t, m) => {
        setTimeout(() => {
            if (t === 0) {
                router.push('/login');
            } else {
                element.message = m + `,将在${t}秒后返回登录页面`;
                countTime(--t, m);
            }
        }, 1000);
    };

    element = Message({
        showClose: false,
        message: msg + `,将在${time}秒后返回登录页面`,
        type: "error",
        duration: `${time}000`
    });

    countTime(time - 1, msg);
}

