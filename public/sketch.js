// 创建与服务器的连接
const socket = io();

let bSize = 30; // 笔触大小
let canvas;
let drawIsOn = false;

let myColor;

function setup() {
    canvas = createCanvas(500, 500);
    background(255); // 初始化背景为白色
    noStroke();
    myColor = color(random(255), random(255), random(255));
}

function draw() {
    // 这是你本地的绘图逻辑：按下鼠标时在本地画圆
    if(drawIsOn){
        fill(myColor); // 使用本地颜色
        circle(mouseX, mouseY, bSize);
    }
}

// --- 用户交互逻辑 ---

function mousePressed(){
    drawIsOn = true;
}

function mouseReleased(){
    drawIsOn = false;
}

// 当鼠标被拖动时触发 [cite: 60]
function mouseDragged() {
    // 将当前的绘图数据发送给服务器 [cite: 60]
    socket.emit("drawing", {
        xpos: mouseX,    // [cite: 61]
        ypos: mouseY,    // [cite: 62]
        userS: bSize     // [cite: 63]
    });
}

// --- 协同绘图逻辑 ---

// 关键步骤：监听来自其他人的绘图消息 [cite: 83, 84]
socket.on("drawing", (data) => {
    // 收到数据后，调用函数在自己的画布上画出别人的笔触 
    drawStuff(data);
});

// 定义如何画出别人的数据 [cite: 86, 87]
function drawStuff(data) {
    fill(0); // 同样使用黑色 [cite: 88]
    // 使用来自服务器的数据对象（POJO）中的坐标和大小 [cite: 58, 89]
    circle(data.xpos, data.ypos, data.userS); 
}

// --- 连接状态监控 ---
socket.on("connect", () => {
    console.log("已连接到服务器，ID: " + socket.id);
});

socket.on("disconnect", () => {
    console.log("与服务器断开连接");
});
function mouseDragged() {
    socket.emit("drawing", {
        xpos: mouseX,
        ypos: mouseY,
        userS: bSize,
        // 添加颜色信息 [cite: 110]
        col: {
            r: red(myColor),   // [cite: 111]
            g: green(myColor), // [cite: 115]
            b: blue(myColor)  // [cite: 116]
        }
    });
}
function drawStuff(data) {
    // 使用来自其他用户的颜色 [cite: 119]
    fill(data.col.r, data.col.g, data.col.b); // [cite: 120]
    circle(data.xpos, data.ypos, data.userS); // [cite: 122]
}