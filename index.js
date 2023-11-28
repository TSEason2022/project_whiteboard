let express = require("express");

let app = express();
app.use(express.static("public"));

let httpServer = require("http").createServer(app);
let PORT = process.env.PORT || 9090;
httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));

let io = require("socket.io")(httpServer);

let connections = []
// store all the paintActions
let paintActions = []



io.on('connection', (socket) => {
    // init
    connections.push(socket);
    console.log(`${socket.id} has connected`);
    socket.emit('onconnect', {id: socket.id})

    // redo the paint actions happened before the connection
    for(let i = 0; i < paintActions.length; i++) {
        console.log("paintActions[",i,"]is: ", paintActions[i])
        paintActions[i](socket, socket)
    }
    socket.emit('onpickColor', {color: "#000", id:socket.id}) // reset the color

    // transmit events
    socket.on('down', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id) {
                con.emit('ondown', {x: data.x, y: data.y, id: socket.id});
            }
        });
        // !! push a lazy function (which contains the emittion)
        paintActions.push((con_i, socket_i) => {con_i.emit('ondown', {x: data.x, y: data.y, id: socket_i.id})})
    });

    socket.on('drawLine', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id) {
                con.emit('ondrawLine', {x: data.x, y: data.y, id: socket.id});
            }
        });
        // push in a lazy function (which contains the emittion) to be called
        paintActions.push((con_i, socket_i) => {con_i.emit('ondrawLine', {x: data.x, y: data.y, id: socket_i.id})})
    });

    socket.on('drawRect', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id) {
                con.emit('ondrawRect', {x: data.x, y: data.y, width: data.width, height: data.height, id:socket.id});
            }
        });
        paintActions.push((con_i, socket_i) => {con_i.emit('ondrawRect', {x: data.x, y: data.y, width: data.width, height: data.height, id:socket_i.id})})
    });

    socket.on('drawCirc', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id) {
                con.emit('ondrawCirc', {centerX: data.centerX, centerY: data.centerY, radius: data.radius, id:socket.id});
            }
        });
        paintActions.push((con_i, socket_i) => {con_i.emit('ondrawCirc', {centerX: data.centerX, centerY: data.centerY, radius: data.radius, id:socket_i.id})})
    });

    socket.on('writeText', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id) {
                con.emit('onwriteText', {txt: data.txt, x: data.x, y: data.y, id:socket.id});
            }
        });
        // TODO: add paintActions for writeText
    });

    socket.on('eraser', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id) {
                con.emit('oneraser', {x: data.x, y: data.y});
            }
        });
        paintActions.push((con_i, socket_i) => {con_i.emit('oneraser', {x: data.x, y: data.y})})
    });

    // reset does not save an action, instead it deletes all actions
    socket.on('reset', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id) {
                con.emit('onreset');
            }
        });
        paintActions = []
    });

    socket.on('pickColor', (data) => {
        connections.forEach((con) => {
            if (con.id !== socket.id) {
                con.emit('onpickColor', {color: data.cur_color, id:socket.id});
            }
        });
        paintActions.push((con_i, socket_i) => {con_i.emit('onpickColor', {color: data.cur_color, id:socket_i.id})})
    });

    socket.on('disconnect', (reason) => {
        console.log(`${socket.id} is disconnected`);
        connections = connections.filter((con) => con.id !== socket.id);
    })
});