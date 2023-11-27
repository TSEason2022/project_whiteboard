let canvas = document.getElementById('board');
let animation = document.getElementById('animation');

canvas.width = 0.9 * window.innerWidth;
canvas.height = 0.9 * window.innerHeight;
let ctx = canvas.getContext("2d");

animation.width = 0.9 * window.innerWidth;
animation.height = 0.9 * window.innerHeight;
let ctx2 = animation.getContext("2d");

var io = io().connect('http://localhost:8080')


/*
====================
init webpage buttons
====================
*/
let getButton = btt => document.getElementById(btt);

let pencilButton = getButton('pencilButton');
let rectangleButton = getButton('rectangleButton');
let circleButton = getButton('circleButton');
let textButton = getButton('textButton');
let eraserButton = getButton('eraserButton');
let resetButton = getButton('resetButton');


/*
===========
init canvas
===========
*/
let drawMode = 'pencil';
let eraserMode = false;
let x, y;
let pressed = false;
let width, height;
let radius;
const font = '14px sans-serif';
let rect = canvas.getBoundingClientRect();

/*
===========================
addClickEventListner for buttons
===========================
*/
document.addEventListener('DOMContentLoaded', function () {
    let buttons = document.querySelectorAll('.button');
    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            buttons.forEach(function (btn) {
                btn.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
});

function addDrawModeChangeEvent(btt, method) {
    btt.addEventListener('click', method);
}
function addRegularDrawmodeChangeEvent(btt, bttMode) {
    addDrawModeChangeEvent(
        btt,
        () => {
            drawMode = bttMode;
            console.log('drawMode change to', bttMode);
        }
    );
}

addRegularDrawmodeChangeEvent(pencilButton, 'pencil');
addRegularDrawmodeChangeEvent(rectangleButton, 'rectangle');
addRegularDrawmodeChangeEvent(circleButton, 'circle');
addRegularDrawmodeChangeEvent(textButton, 'text');
addRegularDrawmodeChangeEvent(eraserButton, 'eraser');
addDrawModeChangeEvent(
    resetButton,
    function () {
        drawMode = 'reset';
        console.log("reset");
        reset();
        io.emit('reset', {});
    }
);


/*
=========================
add handlers for io event
=========================
*/
io.on('ondown', ({ x, y }) => { ctx.moveTo(x, y); })
io.on('ondrawLine', ({ x, y }) => drawLine(x, y))
io.on('ondrawRect', ({ x, y, width, height }) => drawRectangle(x, y, width, height))
io.on('ondrawCirc', ({ centerX, centerY, radius }) => drawCircle(centerX, centerY, radius))
io.on('onwriteText', ({ txt, x, y }) => writeText(txt, x, y))
io.on('oneraser', ({ x, y }) => erase(x, y))
io.on('onreset', () => reset())


function drawLine(x, y) {
    ctx.lineTo(x, y);
    ctx.stroke();
}

function rectangleAnimation(x, y, width, height) {
    ctx2.beginPath();
    ctx2.lineWidth = 2;
    ctx2.rect(x, y, width, height);
    ctx2.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.stroke();
}

function circleAnimation(centerX, centerY, radius) {
    ctx2.beginPath();
    ctx2.lineWidth = 2;
    ctx2.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx2.stroke();
}

function drawRectangle(x, y, width, height) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.rect(x, y, width, height);
    ctx.stroke();
}

function drawCircle(centerX, centerY, radius) {
    ctx.beginPath();
    ctx2.lineWidth = 2;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function writeText(txt, x, y) {
    ctx.fillText(txt, x - 4, y - 4);
}

function erase(x, y) {
    ctx.globalCompositeOperation = 'destination-out'; // 设置混合模式为destination-out，即删除模式
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over'; // 恢复混合模式
}

function reset() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.clearRect(0, 0, animation.width, animation.height);
    ctx.beginPath();  // clear previous path
}

/*
=======================
add mouse event emitter
=======================
*/
window.onmousedown = (e) => {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    ctx.moveTo(x, y);
    io.emit('down', { x, y });
    pressed = true;

    console.log('pressing down', 'for', { x, y });
    switch (drawMode) {
        case 'eraser':
            eraserMode = true;
            erase(x, y);
            io.emit('eraser', { x, y });
            break;
    }
}
window.onmouseup = (e) => {
    pressed = false;
    eraserMode = false;
    switch (drawMode) {
        case 'rectangle':
            width = e.clientX - rect.left - x;
            height = e.clientY - rect.top - y;
            drawRectangle(x, y, width, height);
            ctx2.clearRect(0, 0, animation.width, animation.height);
            io.emit('drawRect', { x, y, width, height });
            break;
        case 'circle':
            var centerX = (e.clientX - rect.left + x) / 2;
            var centerY = (e.clientY - rect.top + y) / 2;
            radius = Math.sqrt(Math.pow(e.clientX - rect.left - centerX, 2) + Math.pow(e.clientY - rect.top - centerY, 2));
            drawCircle(centerX, centerY, radius);
            ctx2.clearRect(0, 0, animation.width, animation.height);
            io.emit('drawCirc', { centerX, centerY, radius });
            break;
    }
}
window.onmousemove = (e) => {
    switch (drawMode) {
        case 'pencil':
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
            if (pressed != true) break;
            drawLine(x, y);
            io.emit('drawLine', { x, y })
            break;
        case 'eraser':
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
            if (eraserMode != true) break;
            erase(x, y);
            io.emit('eraser', { x, y });
            break;
        case 'rectangle':
            if (pressed) {
                width = e.clientX - rect.left - x;
                height = e.clientY - rect.top - y;
                rectangleAnimation(x, y, width, height);
                io.emit('drawRect', { x, y, width, height });
            }
            break;
        case 'circle':
            if (pressed) {
                var centerX = (e.clientX - rect.left + x) / 2;
                var centerY = (e.clientY - rect.top + y) / 2;
                radius = Math.sqrt(Math.pow(e.clientX - rect.left - centerX, 2) + Math.pow(e.clientY - rect.top - centerY, 2));
                circleAnimation(centerX, centerY, radius);
            }
            io.emit('drawCirc', { centerX, centerY, radius });
            break;
    }
};

/*
===============================================
handle tool that requires mouseClick: text tool
===============================================
*/
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
        io.emit('writeText', { txt, x, y })
    },
};

// 文本框
canvas.onclick = function (e) {
    if (drawMode == 'text') {
        if (textTool.hasInput) return;
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;;
        textTool.addInput(x, y);
    }
}