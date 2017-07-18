var log = console.log.bind(console)
var e = sel => document.querySelector(sel)
var appendHtml = (element, html) => element.insertAdjacentHTML('beforeend', html)
var ajax = function(method, path, data, callback) {
    var r = new XMLHttpRequest()
    r.open(method, path, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = function() {
        if(r.readyState == 4) {
            callback(r.response)
        }
    }
    r.send(data)
}
var insertInput = function() {
    var t = `
        <div>
            <input id="id-input-task">
            <button id="id-button-add" class='todo-add'>add button</button>
        </div>
    `
    appendHtml(e('#id-div-todo-container'), t)
}

var insertCss = () => {
    var t = `
    <style>
        .todo-cell {
            outline: red 1px dashed;
        }
    </style>
    `
    appendHtml(document.head, t)
}

var templateTodo = todo => {
    var task = todo.task
    var id = todo.id
    var t = `
        <div class='todo-cell' data-id='${id}'>
            <button class='todo-edit'>编辑</button>
            <button class='todo-delete'>删除</button>
            <span class='todo-task'>${task}</span>
        </div>
    `
    return t
}

var insertTodo = todo => {
    var container = e('#id-div-todo-container')
    var html = templateTodo(todo)
    appendHtml(container, html)
}

var insertTodos = todos => {
    for (var i = 0; i < todos.length; i++) {
        var todo = todos[i]
        insertTodo(todo)
    }
}
var loadTodos = () => {
    apiTodoAll(function(todos){
        insertTodos(todos)
    })
}

var apiGet = function(path, callback) {
    var url = 'https://localhost' + path
    ajax('GET', url, '', function(r){
        var data = JSON.parse(r)
        callback(data)
    })
}

var apiPost = function(path, data, callback) {
    var url = 'https://localhost' + path
    data = JSON.stringify(data)
    ajax('POST', url, data, function(r){
        var data = JSON.parse(r)
        callback(data)
    })
}

var apiTodoAll = callback => {
    var path = '/all'
    apiGet(path, callback)
}

var apiTodoDelete = (todoId, callback) => {
    var path = '/delete/' + todoId
    apiGet(path, callback)
}

var apiTodoAdd = (data, callback) => {
    var path = '/add'
    apiPost(path, data, callback)
}

var apiTodoUpdate = (todoId, data, callback) => {
    var path = '/update/' + todoId
    apiPost(path, data, callback)
}

var bindEventsDelegates = () => {
    var container = e('#id-div-todo-container')
    container.addEventListener('click', function(event){
        var self = event.target
    })
}

var bindEventAdd = () => {
    var container = e('#id-div-todo-container')
    container.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('todo-add')) {
            log('button click, add')
            var input = e('#id-input-task')
            var value = input.value
            var data = {
                'task': value,
            }
            apiTodoAdd(data, function(todo){
                insertTodo(todo)
            })
        }
    })
}

var bindEventDelete = () => {
    var container = e('#id-div-todo-container')
    container.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('todo-delete')) {
            log('button click, delete')
            var self = event.target
            var todoCell = self.closest('.todo-cell')
            var todoId = todoCell.dataset.id
            apiTodoDelete(todoId, function(todo){
                log('删除成功', todo)
                todoCell.remove()
            })
        }
    })
}

var bindEventEdit = () => {
    var container = e('#id-div-todo-container')
    container.addEventListener('click', function(event){
        var self = event.target
        if (self.classList.contains('todo-edit')) {
            log('button click, edit')
            // 找到 todo-task, 设置 contenteditable 属性, 并且让它获得焦点
            var self = event.target
            var todoCell = self.closest('.todo-cell')
            var task = todoCell.querySelector('.todo-task')
            task.contentEditable = true
            task.focus()
        }
    })
}

var bindEventUpdate = () => {
    var container = e('#id-div-todo-container')
    // 绑定 keydown 事件, 当用户按键的时候被触发
    container.addEventListener('keydown', function(event){
        var self = event.target
        if (self.classList.contains('todo-task')) {
            if (event.key == 'Enter') {
                event.preventDefault()
                self.contentEditable = false
                var todoCell = self.closest('.todo-cell')
                var todoId = todoCell.dataset.id
                var data = {
                    'task': self.innerHTML,
                }
                apiTodoUpdate(todoId, data, function(todo){
                })
            }
        }
    })
}

var bindEvents = () => {
    bindEventsDelegates()
    bindEventAdd()
    bindEventDelete()
    bindEventEdit()
    bindEventUpdate()
}

var __main = () => {
    // 初始化程序, 插入 input 标签和 css
    insertInput()
    insertCss()
    // 绑定事件委托
    bindEvents()
    // 载入所有 todos 并且在页面中显示
    loadTodos()
}

__main()
