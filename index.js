let express = require("express");

let app = express();
app.use(express.static("public"));

let httpServer = require("http").createServer(app);
let PORT = process.env.PORT || 9090;
httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));

let io = require("socket.io")(httpServer);

let connections = []
const canvasData = {}; // 用于存储画布信息的对象

io.on('connection', (socket) => {
    connections.push(socket);
    console.log(`${socket.id} has connected`);
    socket.emit('onconnect', { id: socket.id })

    socket.on('down', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id && canvasData[data.receivedInviteCode].users.includes(con.id)) {
                con.emit('ondown', { x: data.x, y: data.y, id: socket.id });
            }
        });
    });

    socket.on('verify', (data) => {
        console.log(`${socket.id}验证${data.inviteCode}`);
        if (canvasData[data.inviteCode]) {
            connections.forEach((con) => {
                if (con.id == socket.id) {
                    con.emit('loginSuccess', { inviteCode: data.inviteCode });
                }
            });
            console.log(canvasData[data.inviteCode].users);
        } else {
            connections.forEach((con) => {
                if (con.id == socket.id) {
                    con.emit('loginFailed', {});
                }
            });
        }
    });

    socket.on('existedCode', (data) => {
        if (canvasData.hasOwnProperty(data.newInviteCode)) {
            console.log(`Canvas exists for invite code: ${data.newInviteCode}`);
            connections.forEach((con) => {
                if (con.id == socket.id) {
                    con.emit('createFailed', {});
                }
            });
        } else {
            console.log(`Canvas does not exist for invite code: ${data.newInviteCode}`);
            canvasData[data.newInviteCode] = {
                users: []
            };
            connections.forEach((con) => {
                if (con.id == socket.id) {
                    con.emit('createSuccess', { newInviteCode: data.newInviteCode });
                }
            });
        }
    });

    socket.on('onCanvas', (data) => {
        console.log(`${socket.id}在${data.receivedInviteCode}`)
        canvasData[data.receivedInviteCode].users.push(socket.id);
        console.log(canvasData[data.receivedInviteCode].users)
    });

    socket.on('drawLine', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id && canvasData[data.receivedInviteCode].users.includes(con.id)) {
                con.emit('ondrawLine', { x: data.x, y: data.y, id: socket.id });
            }
        });
    });

    socket.on('drawRect', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id && canvasData[data.receivedInviteCode].users.includes(con.id)) {
                con.emit('ondrawRect', { x: data.x, y: data.y, width: data.width, height: data.height, id: socket.id });
            }
        });
    });

    socket.on('drawCirc', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id && canvasData[data.receivedInviteCode].users.includes(con.id)) {
                con.emit('ondrawCirc', { centerX: data.centerX, centerY: data.centerY, radius: data.radius, id: socket.id });
            }
        });
    });

    socket.on('writeText', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id && canvasData[data.receivedInviteCode].users.includes(con.id)) {
                con.emit('onwriteText', { txt: data.txt, x: data.x, y: data.y, id: socket.id });
            }
        });
    });

    socket.on('eraser', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id && canvasData[data.receivedInviteCode].users.includes(con.id)) {
                con.emit('oneraser', { x: data.x, y: data.y });
            }
        });
    });

    socket.on('reset', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id && canvasData[data.receivedInviteCode].users.includes(con.id)) {
                con.emit('onreset');
            }
        });
    });

    socket.on('pickColor', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id && canvasData[data.receivedInviteCode].users.includes(con.id)) {
                con.emit('onpickColor', { color: data.cur_color, id: socket.id });
            }
        });
    });

    socket.on('disconnect', (reason) => {
        console.log(`${socket.id} is disconnected`);
        connections = connections.filter((con) => con.id !== socket.id);
    })
});