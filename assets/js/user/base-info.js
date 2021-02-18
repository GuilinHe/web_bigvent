$(function() {
    const { layer, form } = layui
    // 页面一加载获取用户信息
    function initUserInfo() {
        axios.get('/my/userinfo').then(res => {
            // 校验
            if (res.status !== 0) {
                return layer.msg('获取失败！')
            }
            // console.log(res);
            form.val('edit-userInfo', res.data)
        })
    }
    initUserInfo()

    form.verify({
        nick: [
            /^\w{1,6}$/,
            '昵称长度必须在 1 ~ 6 个字符之间'
        ]
    })

    // 提交修改
    $(".userInfo-form").submit(function(e) {
        e.preventDefault()

        axios.post('/my/userinfo', $(this).serialize())
            .then(res => {
                // console.log(res);
                if (res.status !== 0) {
                    layer.msg('修改信息失败!')
                }
                layer.msg('修改信息成功!')
                window.parent.getUserInfo()
            })
    })

    // 重置按钮
    $("#reset").click(function(e) {
        e.preventDefault()


        initUserInfo()

    })
})