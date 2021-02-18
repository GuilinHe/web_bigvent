$(function() {
    // 从 layui 中提取 form 表单模块
    const { form, layer } = layui

    // 点击链接进行表单切换
    $('.link a').click(function() {
        $('.layui-form').toggle()
    })

    // 校验表单项
    form.verify({
        pass: [
            /^\w{6,12}$/,
            '密码只能在6到12位之间'
        ],
        samePass: function(value) {
            if (value !== $('#pass').val()) {
                return '两次面输入不一致'
            }
        }
    })

    // 实现注册功能
    $('.reg-form').submit(function(e) {
        // 阻止默认提交
        e.preventDefault()

        // 发送 ajax
        axios.post('/api/reguser', $(this).serialize())
            .then(res => {
                console.log(res);
                // 校验失败
                if (res.status !== 0) {
                    return layer.msg('注册失败！')
                }
                // 成功跳转到登录
                layer.msg('注册成功！')
                $('.login-form a').click()
            })
    })

    // 实现登录功能
    $('.login-form').submit(function(e) {
        // 阻止默认提交
        e.preventDefault()

        // 发送 ajax
        axios.post('/api/login', $(this).serialize())
            .then(res => {
                console.log(res);
                // 校验失败
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                // 成功，首先把 token 保存到本地
                localStorage.setItem('token', res.token)
                    // 提示登录成功
                layer.msg('登录成功！')
                    // 跳转到首页
                location.href = './index.html'
            })
    })

})