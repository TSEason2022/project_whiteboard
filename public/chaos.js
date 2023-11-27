let canvas = document.getElementById('board');

canvas.width = 0.8 * window.innerWidth;
canvas.height = 0.8 * window.innerHeight;

let ctx = canvas.getContext("2d");

let x;
let y;
let pressed = false;
let width;
let height;

// ctx.moveTo(100, 100);
// ctx.lineTo(200, 200);
// ctx.stroke();

// // 直线
// window.onmousedown = (e) => {
//     x = e.clientX;
//     y = e.clientY;
//     ctx.moveTo(x, y);
//     pressed = true;
// }

// window.onmouseup = (e) => {
//     pressed = false;
// }

// window.onmousemove = (e) => {
//     x = e.clientX;
//     y = e.clientY;
//     console.log({x, y});
//     if (pressed == true) {
//         ctx.lineTo(x, y);
//         ctx.stroke();
//     }
// };

// 矩形
window.onmousedown = (e) => {
    x = e.clientX;
    y = e.clientY;
    ctx.moveTo(x, y);
    pressed = true;
}

window.onmouseup = (e) => {
    pressed = false;
    // ctx.clearRect(x, y, canvas.width, canvas.height);
    // width = e.clientX - x;
    // height = e.clientY - y;
    // ctx.rect(x, y, width, height);
    // ctx.stroke();
}



window.onmousemove = (e) => {
    if (pressed) {
        // Clear the previous rectangle
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Draw the new rectangle
        ctx.beginPath();
        width = e.clientX - x;
        height = e.clientY - y;
        ctx.rect(x, y, width, height);
        ctx.stroke();
    }
};

// let startX, startY;
// let isDrawing = false;

// window.onmousedown = (e) => {
//     startX = e.clientX;
//     startY = e.clientY;
//     isDrawing = true;
// };

// window.onmousemove = (e) => {
//     if (isDrawing) {
//         const currentX = e.clientX;
//         const currentY = e.clientY;
        
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         ctx.beginPath();
//         const rectWidth = currentX - startX;
//         const rectHeight = currentY - startY;
//         ctx.rect(startX, startY, rectWidth, rectHeight);
//         ctx.stroke();
//     }
// };

// window.onmouseup = (e) => {
//     isDrawing = false;
// };

let canvas = document.getElementById('board');

canvas.width = 0.8 * window.innerWidth;
canvas.height = 0.8 * window.innerHeight;

let ctx = canvas.getContext("2d");

let x;
let y;
let pressed = false;
let width;
let height;
let radius;
let text = ''

// ctx.moveTo(100, 100);
// ctx.lineTo(200, 200);
// ctx.stroke();

// 直线
// window.onmousedown = (e) => {
//     x = e.clientX;
//     y = e.clientY;
//     ctx.moveTo(x, y);
//     pressed = true;
// }

// window.onmouseup = (e) => {
//     pressed = false;
// }

// window.onmousemove = (e) => {
//     x = e.clientX;
//     y = e.clientY;
//     console.log({x, y});
//     if (pressed == true) {
//         ctx.lineTo(x, y);
//         ctx.stroke();
//     }
// };

// 矩形
// window.onmousedown = (e) => {
//     x = e.clientX;
//     y = e.clientY;
//     ctx.moveTo(x, y);
//     pressed = true;
// }

// window.onmouseup = (e) => {
//     pressed = false;
//     width = e.clientX - x;
//     height = e.clientY - y;
//     ctx.rect(x, y, width, height);
//     ctx.stroke();
// }

// 圆形
// window.onmousedown = (e) => {
//     x = e.clientX;
//     y = e.clientY;
//     ctx.moveTo(x, y);
//     pressed = true;
// }

// window.onmouseup = (e) => {
//     pressed = false;
//     ctx.beginPath();
//     const centerX = (e.clientX + x) / 2
//     const centerY = (e.clientY + y) / 2
//     radius = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
//     ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
//     ctx.stroke();
// }

// 文本框
window.onmousedown = (e) => {
    x = e.clientX;
    y = e.clientY;
    pressed = true;
    print();
}

window.onmouseup = (e) => {
    pressed = false;
}

function print() {
    text = '';
    ctx.rect(x, y - 15, 100, 20);
    ctx.stroke();

    window.onkeydown = (e) => {
        text += e.key;
        ctx.font = '18px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(text, x, y);
    }
    ctx.clearRect(x, y - 15, 110, 30);
    ctx.stroke();
    ctx.fillText(text, x, y);
}

let canvas = document.getElementById('board');

canvas.width = 0.8 * window.innerWidth;
canvas.height = 0.8 * window.innerHeight;

let ctx = canvas.getContext("2d");

let x;
let y;
let pressed = false;
let width;
let height;
let radius;
const font = '14px sans-serif';
let hasInput = false;


// 直线
// window.onmousedown = (e) => {
//     x = e.clientX;
//     y = e.clientY;
//     ctx.moveTo(x, y);
//     pressed = true;
// }

// window.onmouseup = (e) => {
//     pressed = false;
// }

// window.onmousemove = (e) => {
//     x = e.clientX;
//     y = e.clientY;
//     console.log({x, y});
//     if (pressed == true) {
//         ctx.lineTo(x, y);
//         ctx.stroke();
//     }
// };

// 矩形
// window.onmousedown = (e) => {
//     x = e.clientX;
//     y = e.clientY;
//     ctx.moveTo(x, y);
//     pressed = true;
// }

// window.onmouseup = (e) => {
//     pressed = false;
//     width = e.clientX - x;
//     height = e.clientY - y;
//     ctx.rect(x, y, width, height);
//     ctx.stroke();
// }

// 圆形
// window.onmousedown = (e) => {
//     x = e.clientX;
//     y = e.clientY;
//     ctx.moveTo(x, y);
//     pressed = true;
// }

// window.onmouseup = (e) => {
//     pressed = false;
//     ctx.beginPath();
//     const centerX = (e.clientX + x) / 2
//     const centerY = (e.clientY + y) / 2
//     radius = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
//     ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
//     ctx.stroke();
// }

// 文本框
canvas.onclick = function(e) {
    if (hasInput) return;
    addInput(e.clientX, e.clientY);
}

// Function to dynamically add an input box: 
function addInput(x, y) {
    var input = document.createElement('input');

    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = (x - 4) + 'px';
    input.style.top = (y - 4) + 'px';

    input.onkeydown = handleEnter;

    document.body.appendChild(input);

    input.focus();

    hasInput = true;
}

// Key handler for input box:
function handleEnter(e) {
    var keyCode = e.keyCode;
    if (keyCode === 13) {
        drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10));
        document.body.removeChild(this);
        hasInput = false;
    }
}

// Draw the text onto canvas:
function drawText(txt, x, y) {
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.font = font;
    ctx.fillText(txt, x - 4, y - 4);
}

let canvas = document.getElementById('board');

canvas.width = 0.8 * window.innerWidth;
canvas.height = 0.8 * window.innerHeight;
let ctx = canvas.getContext("2d");

let pencilButton = document.getElementById('pencilButton');
let rectangleButton = document.getElementById('rectangleButton');
let circleButton = document.getElementById('circleButton');
let textButton = document.getElementById('textButton');

let drawMode = 'pencil';

pencilButton.addEventListener('click', function() {
    drawMode = 'pencil';
});

rectangleButton.addEventListener('click', function() {
    drawMode = 'rectangle';
});

circleButton.addEventListener('click', function() {
    drawMode = 'circle';
});

textButton.addEventListener('click', function() {
    drawMode = 'text';
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
let hasInput = false;


// 直线
window.onmousedown = (e) => {
    x = e.clientX;
    y = e.clientY;
    ctx.moveTo(x, y);
    pressed = true;
}

window.onmouseup = (e) => {
    pressed = false;
}

window.onmousemove = (e) => {
    x = e.clientX;
    y = e.clientY;
    console.log({x, y});
    if (pressed == true) {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
};

// 矩形
window.onmousedown = (e) => {
    x = e.clientX;
    y = e.clientY;
    ctx.moveTo(x, y);
    pressed = true;
}

window.onmouseup = (e) => {
    pressed = false;
    width = e.clientX - x;
    height = e.clientY - y;
    ctx.rect(x, y, width, height);
    ctx.stroke();
}

// 圆形
window.onmousedown = (e) => {
    x = e.clientX;
    y = e.clientY;
    ctx.moveTo(x, y);
    pressed = true;
}

window.onmouseup = (e) => {
    pressed = false;
    ctx.beginPath();
    const centerX = (e.clientX + x) / 2
    const centerY = (e.clientY + y) / 2
    radius = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

// 文本框
canvas.onclick = function(e) {
    if (hasInput) return;
    addInput(e.clientX, e.clientY);
}

// Function to dynamically add an input box: 
function addInput(x, y) {
    var input = document.createElement('input');

    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = (x - 4) + 'px';
    input.style.top = (y - 4) + 'px';

    input.onkeydown = handleEnter;

    document.body.appendChild(input);

    input.focus();

    hasInput = true;
}

// Key handler for input box:
function handleEnter(e) {
    var keyCode = e.keyCode;
    if (keyCode === 13) {
        drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10));
        document.body.removeChild(this);
        hasInput = false;
    }
}

// Draw the text onto canvas:
function drawText(txt, x, y) {
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.font = font;
    ctx.fillText(txt, x - 4, y - 4);
}


let canvas = document.getElementById('board');

canvas.width = 0.8 * window.innerWidth;
canvas.height = 0.8 * window.innerHeight;
let ctx = canvas.getContext("2d");

let pencilButton = document.getElementById('pencilButton');
let rectangleButton = document.getElementById('rectangleButton');
let circleButton = document.getElementById('circleButton');
let textButton = document.getElementById('textButton');

let drawMode = 'pencil';

pencilButton.addEventListener('click', function() {
    drawMode = 'pencil';
});

rectangleButton.addEventListener('click', function() {
    drawMode = 'rectangle';
});

circleButton.addEventListener('click', function() {
    drawMode = 'circle';
});

textButton.addEventListener('click', function() {
    drawMode = 'text';
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
let hasInput = false;


window.onmousedown = (e) => {
    x = e.clientX;
    y = e.clientY;
    ctx.moveTo(x, y);
    pressed = true;
}

window.onmouseup = (e) => {
    pressed = false;
    if (drawMode == 'rectangle') {
        ctx.beginPath();
        width = e.clientX - x;
        height = e.clientY - y;
        ctx.rect(x, y, width, height);
        ctx.stroke();
    }
    if (drawMode == 'circle') {
        ctx.beginPath();
        const centerX = (e.clientX + x) / 2
        const centerY = (e.clientY + y) / 2
        radius = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

window.onmousemove = (e) => {
    if (drawMode == 'pencil') {    
        x = e.clientX;
        y = e.clientY;
        console.log({x, y});
        if (pressed == true) {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
};

// 文本框
canvas.onclick = function(e) {
    if (drawMode == 'text') {
        if (hasInput) return;
        addInput(e.clientX, e.clientY);
    }
}

// Function to dynamically add an input box: 
function addInput(x, y) {
    var input = document.createElement('input');

    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = (x - 4) + 'px';
    input.style.top = (y - 4) + 'px';

    input.onkeydown = handleEnter;

    document.body.appendChild(input);

    input.focus();

    hasInput = true;
}

// Key handler for input box:
function handleEnter(e) {
    var keyCode = e.keyCode;
    if (keyCode === 13) {
        drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10));
        document.body.removeChild(this);
        hasInput = false;
    }
}

// Draw the text onto canvas:
function drawText(txt, x, y) {
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.font = font;
    ctx.fillText(txt, x - 4, y - 4);
}


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
});

rectangleButton.addEventListener('click', function() {
    drawMode = 'rectangle';
});

circleButton.addEventListener('click', function() {
    drawMode = 'circle';
});

textButton.addEventListener('click', function() {
    drawMode = 'text';
});

resetButton.addEventListener('click', function() {
    drawMode = 'reset';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

eraserButton.addEventListener('click', function() {
    drawMode = 'eraser';
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
        console.log({x, y});
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