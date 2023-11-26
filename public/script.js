let canvas = document.getElementById('board');

canvas.width = 0.8 * window.innerWidth;
canvas.height = 0.8 * window.innerHeight;
let ctx = canvas.getContext("2d");

let pencilButton = document.getElementById('pencilButton');
let rectangleButton = document.getElementById('rectangleButton');
let circleButton = document.getElementById('circleButton');
let textButton = document.getElementById('textButton');
let resetButton = document.getElementById('resetButton');
let eraserButton = document.getElementById('eraserButton');
let drawMode = 'pencil';
let eraserMode = false;

pencilButton.addEventListener('click', function() {
    drawMode = 'pencil';
    console.log("pencil");
});

rectangleButton.addEventListener('click', function() {
    drawMode = 'rectangle';
    console.log("rectangle");
});

circleButton.addEventListener('click', function() {
    drawMode = 'circle';
    console.log("circle");
});

textButton.addEventListener('click', function() {
    drawMode = 'text';
    console.log("text");
});

resetButton.addEventListener('click', function() {
    drawMode = 'reset';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("reset");
});

eraserButton.addEventListener('click', function() {
    drawMode = 'eraser';
    console.log("eraser");
});

// 接下来在对应的鼠标事件中根据 drawMode 执行不同的绘制操作
// 例如，在 mousemove 事件中添加判断以执行不同的绘制逻辑
let x;
let y;
let pressed = false;
let width;
let height;
let radius;
const font = '14px sans-serif';

function drawRectangle(x, y, width, height) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.stroke();
}

function drawCircle(centerX, centerY, radius) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

const textTool = {
    hasInput: false,
    
    addInput(x, y) {
        var input = document.createElement('input');

        input.type = 'text';
        input.style.position = 'fixed';
        input.style.left = (x - 4) + 'px';
        input.style.top = (y - 4) + 'px';
    
        input.onkeydown = textTool.handleEnter;
    
        document.body.appendChild(input);
    
        input.focus();
    
        hasInput = true;
    },

    handleEnter(e) {
        var keyCode = e.keyCode;
        if (keyCode === 13) {
            textTool.drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10));
            document.body.removeChild(this);
            hasInput = false;
        }
    },

    drawText(txt, x, y) {
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.font = font;
        ctx.fillText(txt, x - 4, y - 4);
    },
};


window.onmousedown = (e) => {
    x = e.clientX;
    y = e.clientY;
    ctx.moveTo(x, y);
    pressed = true;

    if (drawMode === 'eraser') {
        eraserMode = true;
        ctx.globalCompositeOperation = 'destination-out'; // 设置混合模式为destination-out，即删除模式
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over'; // 恢复混合模式
    }
}

window.onmouseup = (e) => {
    pressed = false;
    eraserMode = false;
    if (drawMode == 'rectangle') {
        drawRectangle(x, y, e.clientX - x, e.clientY - y);
    }
    if (drawMode == 'circle') {
        const centerX = (e.clientX + x) / 2;
        const centerY = (e.clientY + y) / 2;
        const radius = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
        drawCircle(centerX, centerY, radius);
    }
}

window.onmousemove = (e) => {
    if (drawMode == 'pencil') {    
        x = e.clientX;
        y = e.clientY;
        // console.log({x, y});
        if (pressed == true) {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    if (drawMode === 'eraser' && eraserMode) {
        x = e.clientX;
        y = e.clientY;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    }
};

// 文本框
canvas.onclick = function(e) {
    if (drawMode == 'text') {
        if (textTool.hasInput) return;
        textTool.addInput(e.clientX, e.clientY);
    }
}