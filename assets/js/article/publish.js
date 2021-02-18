$(function() {
    // 提取组件
    const { form } = layui
    let state = ''
    getCateList();
    // 1. 获取文章类别数据
    function getCateList() {
        // 发送请求
        axios.get('/my/article/cates').then(res => {
            // console.log(res);
            // 判断错误
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }
            // 遍历获取的数据
            res.data.forEach(item => {
                // 添加到页面
                $('#cate-sel').append(`<option value="${item.Id}">${item.name}</option>`)
            })

            // 有些表单元素可能是动态插入的，这时 form 模块 的自动化渲染是会对其失效
            // 组件方法  
            form.render(); //更新全部
        })
    }

    // 2. 调用初始化富文本编辑器方法
    initEditor()

    // 3. 获取要裁剪的图片
    var $image = $('#image');

    // 4. 初始化裁剪区域
    $image.cropper({
        // 指定长宽比
        aspectRatio: 400 / 280,
        // 指定预览区
        preview: '.img-preview'

    });

    // 5. 点击选择封面，自动触发文件域的点击事件
    $('#choose-btn').click(function() {
        $('#file').click()
    })

    // 6. 监听文件域状态改变事件
    $('#file').change(function() {
        // 将上传的文件转换成 url 地址的形式
        const imgUrl = URL.createObjectURL(this.files[0]);
        // 替换页面显示的图片为选择的图片
        $image.cropper('replace', imgUrl)
    })

    // 监听表单提交事件
    $('.publish-form').submit(function(e) {
        // 阻止默认提交
        e.preventDefault();

        // 提取表单所有内容 new FormData()
        const fd = new FormData(this);
        // 检测 FormData 是否提取成功
        fd.forEach(item => console.log(item))
        fd.append('state', state)
            // 获取裁剪封面图片的二进制数据
        $image.cropper('getCroppedCanvas', {
            // 指定裁剪后图片宽高
            width: 400,
            height: 280
        }).toBlob(blob => {

            console.log(blob); // 二进制图片数据
            // 把获取的图片数据添加到 FormData 中
            fd.append('cover_img', blob)

            publishArticle(fd)
        })
    })

    // 给发布和存为草稿添加点击事件
    $('.last-row button').click(function() {
        state = $(this).data('state')
        console.log(state);
    })

    // 封装函数发送请求
    function publishArticle(fd) {
        axios.post('/my/article/add', fd).then(res => {
            // console.log(res);
            // 判断错误
            if (res.status !== 0) {
                return layer.msg('发布文章失败!')
            }
            // 提示用户
            layer.msg(state == '草稿' ? '保存草稿成功' : '发布文章成功!')

            // 跳转到文章列表页
            location.href = './list.html';
            // 让左边的导航高亮
            window.parent.$('.layui-this').prev().find('a').click()
        })
    }

})