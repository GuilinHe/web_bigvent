$(function() {
    // 获取要裁剪的图片
    var $image = $('#image');

    // 初始化裁剪区域
    $image.cropper({
        // 指定长宽比
        aspectRatio: 1,
        crop: function(event) {
            // 裁剪区的坐标位置
            // console.log(event.detail.x);
            // console.log(event.detail.y);
        },
        // 指定预览区
        preview: '.img-preview'

    });

    // 点击上传按钮，上传图片
    $("#upload-btn").click(function() {
        // 手动触发文件框点击事件
        $('#file').click()
    })

    // 监听文件框状态改变事件 file checkbox select
    $('#file').change(function() {
        // 获取用户上传的文件列表
        console.log(this.files);

        // 判断用户是否上传图片
        if (this.files.length == 0) {
            return
        }
        // 把文件转成 url 地址的形式
        const imgUrl = URL.createObjectURL(this.files[0])
        console.log(imgUrl);

        // 替换裁剪区的图片
        $image.cropper('replace', imgUrl)
    })

    // 点击确定，上传图片到服务器
    $('#save-btn').click(function() {
        // 获取裁剪后图片的 base64 格式
        const dataUrl = $image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        }).toDataURL('image/jpeg')
        console.log(dataUrl);

        const params = new URLSearchParams();
        params.append('avatar', dataUrl);
        // 发送请求，提交到服务器
        axios.post('/my/update/avatar', params).then(res => {
            console.log(res);
            // 判断错误
            if (res.status !== 0) {
                return layer.msg('上传失败！')
            }
            layer.msg('上传成功！')

            // 更新首页导航图片
            window.parent.getUserInfo()

        })
    })
})