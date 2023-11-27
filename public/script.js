// structure in the class:
// - iBoard
//      - canvas
//      - ctx
//      - pressed, x, y, width, radius, rect ...
class iBoard {
    constructor(cav, id) {
        this.canvas = cav;
        this.canvas.id = id;
        this.canvas.className = 'boardCanvas';
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = 0.9 * window.innerWidth;
        this.canvas.height = 0.9 * window.innerHeight;
        this.pressed = false;
        this.drawMode = 'pencil';
        this.eraserMode = false;
        this.x = null; this.y = null;
        this.width = null; this.height = null;
        this.radius = null;
        this.rect = this.canvas.getBoundingClientRect();
    }
}


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
init board
===========
*/

// local board settings
let localBoard = new iBoard(document.getElementById('board'), 'board');
let localCTX = localBoard.ctx;

// init reserved for remote canvas
// one board has only one 2D ctx and one canvas
let remoteCtxMap = new Map();
var remoteCtxCnt = 0;

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
    btt.addEventListener('click', method );
}
function addRegularDrawmodeChangeEvent(btt, bttMode) {
    addDrawModeChangeEvent(
        btt,
        () => {
            localBoard.drawMode = bttMode;
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
        localBoard.drawMode = 'reset';
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
let handleByCavnasID = (id, handleContent) => {
    let remoteCTX = remoteCtxMap.get(id);
    if (remoteCTX) {
        // console.log("remote context FOUND", id)
        handleContent(remoteCTX);
    } else {
        let remoteBoard = new iBoard(
            document.createElement('canvas'),
            id
        );
        let stackDiv = document.getElementById('stack');
        stackDiv.appendChild(remoteBoard.canvas);
        remoteCTX = remoteBoard.canvas.getContext("2d");
        remoteCtxMap.set(id, remoteCTX)
        // console.log("remote context ADDED", id)
        handleContent(remoteCTX)
    }
}

io.on('onconnect', ({id}) => {
    localBoard.canvas.id = id;
    console.log("current board canvas is", localBoard.canvas);
})
io.on('ondown', ({x, y, id}) => {
    handleByCavnasID( id, (ctx) => {ctx.moveTo(x, y); })
})
io.on('ondrawLine', ({x,y,id}) => {
    handleByCavnasID( id, (ctx) => {drawLine(ctx, x, y); })
})
io.on('ondrawRect', ({x, y, width, height, id}) => {
    handleByCavnasID( id, (ctx) => {drawRectangle(ctx, x, y, width, height); })
})
io.on('ondrawCirc', ({centerX, centerY, radius, id}) => {
    handleByCavnasID( id, (ctx) => {drawCircle(ctx, centerX, centerY, radius); })
})
io.on('onwriteText', ({txt,x,y,id}) => {
    handleByCavnasID( id, (ctx) => {writeText(ctx, txt, x, y); })
})
io.on('oneraser', ({x,y}) => erase(x,y))
io.on('onreset', () => reset())
io.on('onpickColor', ({color,id}) => {
    handleByCavnasID( id, (ctx) => {pickColor(ctx, color); })
})


function drawLine(ctx, x, y) {
    ctx.lineTo(x, y);
    ctx.stroke();
}
function drawRectangle(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.stroke();
    console.log("Rect drawed in context", ctx)
}
function drawCircle(ctx, centerX, centerY, radius) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    console.log("Circle drawed in context", ctx)
}
function writeText(ctx, txt, x, y) {
    ctx.fillText(txt, x - 4, y - 4);
    console.log("Text Written in context", ctx)
}
function ctxerase(ctx, x, y) {
    ctx.globalCompositeOperation = 'destination-out'; // 设置混合模式为destination-out，即删除模式
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over'; // 恢复混合模式
}
function erase(x, y) {
    ctxerase(localCTX, x, y);
    for(let iCTX of remoteCtxMap.values()) {
        ctxerase(iCTX, x, y);
    }
}
function reset() {
    localCTX.clearRect(0, 0, localBoard.canvas.width, localBoard.canvas.height);
    localCTX.beginPath();  // clear previous path
    console.log("Reset in local context", localCTX);
    for(let iCTX of remoteCtxMap.values()) {
        iCTX.clearRect(0,0,localBoard.canvas.width, localBoard.canvas.height);
        iCTX.beginPath()
        console.log("Reset in remote context", iCTX);
    }
}
function pickColor(ctx, color) {
    ctx.beginPath()
    ctx.strokeStyle = color;
    console.log("Color", color, "Picked in context", ctx)
}

/*
=======================
add mouse event emitter
=======================
*/
window.onmousedown = (e) => {
    localBoard.x = e.clientX - localBoard.rect.left;
    localBoard.y = e.clientY - localBoard.rect.top;
    let x = localBoard.x; let y = localBoard.y;

    localCTX.moveTo(x, y);
    io.emit('down', { x, y });
    localBoard.pressed = true;

    switch (localBoard.drawMode) {
        case 'eraser': {
            localBoard.eraserMode = true;
            erase(localCTX,x,y);
            io.emit('eraser', {x, y});
            break;
        }
    }
}
window.onmouseup = (e) => {
    localBoard.pressed = false;
    localBoard.eraserMode = false;
    switch (localBoard.drawMode) {
        case 'rectangle': {
            localBoard.width = e.clientX - localBoard.rect.left - localBoard.x;
            localBoard.height = e.clientY - localBoard.rect.top - localBoard.y;
            let x = localBoard.x; let y = localBoard.y;
            let width = localBoard.width; let height = localBoard.height;

            drawRectangle(localCTX, x, y, width, height);
            io.emit('drawRect', {x, y, width, height});
            break;
        }
        case 'circle': {
            let x = localBoard.x; let y = localBoard.y;
            let centerX = (e.clientX - localBoard.rect.left + x) / 2;
            let centerY = (e.clientY - localBoard.rect.top + y) / 2;
            localBoard.radius = Math.sqrt(Math.pow(e.clientX - localBoard.rect.left - centerX, 2) + Math.pow(e.clientY - localBoard.rect.top - centerY, 2));
            let radius = localBoard.radius;
            drawCircle(localCTX, centerX, centerY, radius);
            io.emit('drawCirc', {centerX, centerY, radius});
            break;
        }
    }
}
window.onmousemove = (e) => {
    switch (localBoard.drawMode) {
        case 'pencil': {
            localBoard.x = e.clientX - localBoard.rect.left;
            localBoard.y = e.clientY - localBoard.rect.top;
            if (localBoard.pressed != true) break;
            let x = localBoard.x; let y = localBoard.y;
            drawLine(localCTX, x, y);
            io.emit('drawLine', {x, y})
            break;
        }
        case 'eraser': {
            localBoard.x = e.clientX - localBoard.rect.left;
            localBoard.y = e.clientY - localBoard.rect.top;
            if (localBoard.eraserMode != true) break;
            let x = localBoard.x; let y = localBoard.y;
            erase(x,y);
            io.emit('eraser', {x, y});
            break;
        }
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
        localCTX.textBaseline = 'top';
        localCTX.textAlign = 'left';
        localCTX.font = font;
        localCTX.fillText(txt, x - 4, y - 4);
        io.emit('writeText', { txt, x, y })
    },
};

// 文本框
localBoard.onclick = function (e) {
    if (localBoard.drawMode == 'text') {
        if (textTool.hasInput) return;
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;;
        textTool.addInput(x, y);
    }
}