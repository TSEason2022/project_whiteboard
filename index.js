let express = require("express");

let app = express();
app.use(express.static("public"));

let httpServer = require("http").createServer(app);
let PORT = process.env.PORT || 9090;
httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));

let io = require("socket.io")(httpServer);

let connections = []

io.on('connection', (socket) => {
    connections.push(socket);
    console.log(`${socket.id} has connected`);
    socket.emit('onconnect', {id: socket.id})

    socket.on('down', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id) {
                con.emit('ondown', {x: data.x, y: data.y, id: socket.id});
            }
        });
    });

    socket.on('drawLine', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id) {
                con.emit('ondrawLine', {x: data.x, y: data.y, id: socket.id});
            }
        });
    });

    socket.on('drawRect', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id) {
                con.emit('ondrawRect', {x: data.x, y: data.y, width: data.width, height: data.height, id:socket.id});
            }
        });
    });

    socket.on('drawCirc', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id) {
                con.emit('ondrawCirc', {centerX: data.centerX, centerY: data.centerY, radius: data.radius, id:socket.id});
            }
        });
    });

    socket.on('writeText', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id) {
                con.emit('onwriteText', {txt: data.txt, x: data.x, y: data.y, id:socket.id});
            }
        });
    });

    socket.on('eraser', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id) {
                con.emit('oneraser', {x: data.x, y: data.y});
            }
        });
    });

    socket.on('reset', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id) {
                con.emit('onreset');
            }
        });
    });

    socket.on('pickColor', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id) {
                con.emit('onpickColor', {color: data.cur_color, id:socket.id});
            }
        });
    });

    socket.on('disconnect', (reason) => {
        console.log(`${socket.id} is disconnected`);
        connections = connections.filter((con) => con.id !== socket.id);
    })
});