$(function() {
    // 提取 form
    const { form } = layui;
    // 定义弹出层编号
    let index;
    getCateList();
    // 从服务器获取文章类表数据，并渲染到页面

    function getCateList() {
        // 发送请求
        axios.get('/my/article/cates').then(res => {
            console.log(res);
            // 判断请求失败
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }

            // 请求成功要做的事情
            // 使用模板引擎渲染页面 引入插件 ==> 准备一个模板 ==> 调用模板方法
            const htmlStr = template('tpl', res);
            // console.log(htmlStr);
            $('tbody').html(htmlStr)
        })
    }

    // 点击添加按钮，显示弹出层
    $('.add-btn').click(function() {
        index = layer.open({
            type: 1,
            // 弹出层标题
            title: '添加文章分类',
            // 弹出层宽高
            area: ['500px', '250px'],
            // 弹出层内容
            content: $('.add-form-container') //这里content是一个普通的String
        });
    })

    // 监听添加表单的提交事件
    // 注意此表单是后来渲染的，绑定事件需要事件委托的形式
    $(document).on('submit', '.add-form', function(e) {
        // 阻止默认跳转
        e.preventDefault()

        axios.post('/my/article/addcates', $(this).serialize()).then(res => {
            if (res.status !== 0) {
                return layer.msg('添加失败!')
            }
            // console.log(res);
            layer.msg('添加成功!')
            layer.close(index)
            getCateList()

        })
    })

    $(document).on('click', '.edit-btn', function() {
        index = layer.open({
            type: 1,
            // 弹出层标题
            title: '修改文章分类',
            // 弹出层宽高
            area: ['500px', '250px'],
            // 弹出层内容
            content: $('.edit-form-container') //这里content是一个普通的String
        });
        const id = $(this).data('id')


        axios.get(`/my/article/cates/${id}`).then(res => {
            console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }

            form.val('edit-form', res.data);
        })


    })

    // 监听编辑表单提交事件
    $(document).on('submit', '.edit-form', function(e) {
        e.preventDefault()

        // 发送 ajax 请求，提交表单数据
        axios.post('/my/article/updatecate', $(this).serialize()).then(res => {
            console.log(res);
            // 判断错误
            if (res.status !== 0) {
                return layer.msg('更新失败!')
            }

            layer.msg('更新成功!')
            layer.close(index)
            getCateList()


        })
    })

    $(document).on('click', '.del-btn', function() {
        const id = $(this).data('id')
        console.log(id);
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            axios.get(`/my/article/deletecate/${id}`).then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('删除失败!')
                }

                layer.msg('删除成功!')
                getCateList()
            })
            layer.close(index);
        });
    })
})