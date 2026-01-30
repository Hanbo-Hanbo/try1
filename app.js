const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// 设置静态文件目录
app.use(express.static('public'));

// 当有用户连接时 [cite: 49]
io.on("connection", (socket) => {
    console.log("新用户连接: " + socket.id);

    // 监听名为 "drawing" 的消息 [cite: 46, 50]
    socket.on("drawing", (data) => {
        // 将收到的绘图数据（POJO对象）广播给除了发送者以外的所有人 [cite: 58, 77]
        // 为什么要用 broadcast？因为发送者本地已经画好了，不需要再接收一遍 [cite: 80, 81]
        socket.broadcast.emit("drawing", data); 
        
        // 在服务器终端显示坐标，用于调试 [cite: 51, 77]
        console.log(data); 
    });

    socket.on("disconnect", () => {
        console.log("用户已断开: " + socket.id);
    });
});

// 监听端口
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`服务器正在运行: http://localhost:${PORT}`);
});