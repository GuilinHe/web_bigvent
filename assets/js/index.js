// 获取用户个人信息
function getUserInfo() {
    // 发送请求
    axios.get('/my/userinfo').then(
        res => {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg("获取用户信息失败！")
            }

            const { data } = res

            const name = data.nickname || data.username

            $('.nickname').text(`欢迎${name}`).show()
                // 渲染头像
            if (data.user_pic) {
                $('.avatar').prop('src', data.user_pic).show()
                $('.text-avatar').hide()
            } else {
                $('.text-avatar').text(name[0].toUpperCase()).show()
                $('.avatar').hide()
            }
        })

}
$(function() {
    const { layer } = layui


    getUserInfo()

    // 点击退出
    $("#logout").click(function() {

        layer.confirm('确定退出吗?', { icon: 3, title: '提示' }, function(index) {
            // 清除本地存储模拟退出状态 请求退出接口
            localStorage.removeItem('token')
                // 跳转到登录页
            location.href = './login.html'

            layer.close(index);
        });

    })
})