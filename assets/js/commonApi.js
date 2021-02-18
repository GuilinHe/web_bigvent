axios.defaults.baseURL = 'http://api-breakingnews-web.itheima.net';

// 添加请求拦截器
axios.interceptors.request.use(function(config) {
    // 在发送请求之前做些什么
    // 在发送请求之前判断是否有 /my 开头的请求路径
    // (1) startsWith
    // (2) 正则
    // (3) indexOf
    // 如果有，手动添加请求头
    var token = localStorage.getItem('token') || '';

    if (config.url.startsWith('/my')) {
        config.headers.Authorization = token
    }

    return config;

}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
    // 对响应数据做点什么
    const { message, status } = response.data;
    // 判断是否验证失败
    if (message == '身份认证失败！' && status == 1) {
        localStorage.removeItem('token')
        location.href = './login.html'
    }
    return response.data;
}, function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});