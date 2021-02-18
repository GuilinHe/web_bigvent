$(function() {
    // 提取组件
    const { form, laypage } = layui
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

    // 2. 定义一个查询对象
    const query = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    // 3. 发送请求， 获取文章列表数据
    renderTable()

    function renderTable() {
        // 发请求
        axios.get('/my/article/list', { params: query }).then(res => {
            // console.log(res);
            if (res.status !== 0) {
                return layer.msg('获取失败!')
            }

            // 调用模板函数之前注册过滤器
            template.defaults.imports.dateFormat = function(date) {
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
            };
            // 使用模板引擎渲染
            const htmlStr = template('tpl', res);
            // 添加到 tbody 中
            $('tbody').html(htmlStr)

            renderPage(res.total)
        })

    }

    function renderPage(total) {
        laypage.render({
            elem: 'pagination', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: query.pagesize, // 每页显示的条数
            limits: [2, 3, 4, 5],
            curr: query.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                query.pagenum = obj.curr
                query.pagesize = obj.limit

                //首次不执行
                if (!first) {
                    //do something
                    renderTable()
                }
            }
        });
    }

    // 表单筛选功能
    $('.layui-form').submit(function(e) {
        e.preventDefault();

        // 获取下拉选择框的分类 id 和状态
        const cate_id = $('#cate-sel').val()
        const state = $('#state').val()
        console.log(cate_id, state);
        // 获取到的值重新赋值给 query
        query.cate_id = cate_id
        query.state = state

        query.pagenum = 1;
        // 重新调用  renderTable()
        renderTable()
    })

    // 点击删除按钮，删除当前数据
    $(document).on('click', '.del-btn', function() {
        const id = $(this).data('id')

        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            axios.get(`/my/article/delete/${id}`).then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('删除失败!')
                }

                layer.msg('删除成功!');
                // 填坑处理
                if ($('.del-btn').length == 1 && query.pagenum !== 1) {
                    query.pagenum-- // 当前页码值减1
                }

                renderTable()
            })
            layer.close(index);
        });
    })

    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id')

        location.href = `./edit.html?id=${ id }`

    })
})