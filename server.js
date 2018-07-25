// 引入必须模块
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

// 在线人数统计
var onlineCount = 0;
app.use(express.static(__dirname));

// 路径映射
app.get('/', function (request, response) {
    response.sendFile('login.html');
});

// 当有用户连接进来时
io.on('connection', function (socket) {
    console.log('a user connected');

    // 发送给客户端在线人数
    io.emit('connected', ++onlineCount);

    // 当有用户断开
    socket.on('disconnect', function () {
        console.log('user disconnected');

        // 发送给客户端断在线人数
        io.emit('disconnected', --onlineCount);
        console.log(onlineCount);
    });

    // 收到了客户端发来的消息
    socket.on('message', function (message) {
        console.log(message.description);
        console.log(message.black_list);
        console.log(message.target);
        // 给客户端发送消息
        var reply = new Object();
        reply.name = "Xiao Ying";
        reply.img = "img/xiaoying.png";
        reply.predict = "cherry";
        reply.target = message.target;
        socket.emit('message', reply);
    });

});

var server = http.listen(4000, function () {
    console.log('Sever is running');
});