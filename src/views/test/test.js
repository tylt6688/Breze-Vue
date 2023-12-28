const data = JSON.parse(responseBody);
// 这里根据自己项目返回值判断是否是登录失效
console.log('返回的数据是-->', data);
// 一定要根据自己项目的情况来判断
if (data.errorCode == '1004' || data.errorCode == '1003') {
  console.log('token失效 调用login接口');
  const url = pm.environment.replaceIn('{{BASE_URL}}');
  // 请求登录接口，按照项目登录接口配置
  const postRequest = {
    url: url + '/breze/login?username=breze&password=123456&key=developer&code=breze',
    method: 'POST',

    // header: {
    //   'Content-Type': 'application/json',
    // },
    // body: {
    //   mode: 'raw',
    //   raw: JSON.stringify({
    //     username: 'breze',
    //     password: '123456',
    //     key: 'developer',
    //     code: 'brezer',
    //   }),
    // },
  };

  // 请求接口获取token并赋值换环境变量
  pm.sendRequest(url + '/captcha', (err, response) => {
    console.log('获取的验证码信息', response.json());
    pm.sendRequest(postRequest, (error, response) => {
      const res = response.json();
      console.log('请求登录的信息', res);
      if (res.success) {
        // 把接口返回的token设入环境变量中
        pm.environment.set('BEARER_TOKEN', res.result.data);
      }
    });
  });
}
