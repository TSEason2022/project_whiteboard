let canvas = document.getElementById('board');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let ctx = canvas.getContext("2d");

var io = io().connect('http://localhost:8080')

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

eraserButton.addEventListener('click', function() {
    drawMode = 'eraser';
    console.log("eraser");

});

// io.on('onreset', () => {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
// })
// resetButton.addEventListener('click', function() {
//     drawMode = 'reset';
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     console.log("reset");
//     io.emit('reset', {})
// });

let x;
let y;
let pressed = false;
let width;
let height;
let radius;
const font = '14px sans-serif';
let rect = canvas.getBoundingClientRect();

// // 直线
// io.on('ondown', ({x, y}) => {
//     ctx.moveTo(x, y);
// })

// window.onmousedown = (e) => {
//     x = e.clientX;
//     y = e.clientY;
//     ctx.moveTo(x, y);
//     io.emit('down', {x, y});
//     pressed = true;
// }

// window.onmouseup = (e) => {
//     pressed = false;
// }

// // 让别人看到
// io.on('ondraw', ({x, y}) => {
//     ctx.lineTo(x, y);
//     ctx.stroke();
// })

// window.onmousemove = (e) => {
//     x = e.clientX;
//     y = e.clientY;
//     console.log({x, y});
//     if (pressed == true) {
//         io.emit('draw', {x, y})
//         // 让自己看到
//         ctx.lineTo(x, y);
//         ctx.stroke();
//     }
// };

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
        io.emit('writeText', {txt, x, y})
    },
};


io.on('ondown', ({x, y}) => {
    ctx.moveTo(x, y);
})
io.on('oneraser', ({x, y}) => {
    ctx.globalCompositeOperation = 'destination-out'; // 设置混合模式为destination-out，即删除模式
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over'; // 恢复混合模式
})
window.onmousedown = (e) => {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    ctx.moveTo(x, y);
    io.emit('down', {x, y});
    pressed = true;

    if (drawMode === 'eraser') {
        eraserMode = true;
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        ctx.globalCompositeOperation = 'destination-out'; // 设置混合模式为destination-out，即删除模式
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over'; // 恢复混合模式
        io.emit('eraser', {x, y});
    }
}

io.on('ondrawRect', ({x, y, width, height}) => {
    drawRectangle(x, y, width, height);
})
io.on('ondrawCirc', ({centerX, centerY, radius}) => {
    drawCircle(centerX, centerY, radius);
})

window.onmouseup = (e) => {
    pressed = false;
    eraserMode = false;
    if (drawMode == 'rectangle') {
        width = e.clientX - rect.left - x;
        height = e.clientY - rect.top - y;
        drawRectangle(x, y, width, height);
        io.emit('drawRect', {x, y, width, height});
    }
    if (drawMode == 'circle') {
        var centerX = (e.clientX - rect.left + x) / 2;
        var centerY = (e.clientY - rect.top + y) / 2;
        radius = Math.sqrt(Math.pow(e.clientX - rect.left - centerX, 2) + Math.pow(e.clientY - rect.top - centerY, 2));
        drawCircle(centerX, centerY, radius);
        io.emit('drawCirc', {centerX, centerY, radius});
    }
}

io.on('ondrawLine', ({x, y}) => {
    ctx.lineTo(x, y);
    ctx.stroke();
})

window.onmousemove = (e) => {
    if (drawMode == 'pencil') {    
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        // console.log({x, y});
        if (pressed == true) {
            io.emit('drawLine', {x, y})
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }

    if (drawMode === 'eraser' && eraserMode) {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        io.emit('eraser', {x, y});
    }
};

io.on('onwriteText', ({txt, x, y}) => {
    ctx.fillText(txt, x - 4, y - 4);
})

// 文本框
canvas.onclick = function(e) {
    if (drawMode == 'text') {
        if (textTool.hasInput) return;
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;;
        textTool.addInput(x, y);
    }
}