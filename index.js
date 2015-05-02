var express = require("express");
var app = express();
var port = process.env.PORT || 5000;
var rooms = [];
 
app.use(express.static(__dirname));

var io = require('socket.io').listen(app.listen(port));



app.get("/", function(req, res){
    res.sendFile("index.html", {root: __dirname });
});
 
function findAvailableRoom() {
    var a = rooms.indexOf(1);
    if(a !== -1) {
        rooms[a]++;
        return a;
    } else {
        a = rooms.indexOf(0)
        if(a!==-1) {
            rooms[a]++;
            return a;
        }
    }
    rooms.push(1);
    return rooms.length-1;
}

io.on('connection', function(socket){
    console.log(io.sockets.sockets.length)
    var a = findAvailableRoom();
    socket.join(a);
    socket.on('disconnect', function(){
        rooms[a]--;
        socket.broadcast.to(a).emit('gone', '');
        socket.leave(a);
     //   console.log('user disconnected');
    });
    socket.on('send', function (data) {
        socket.broadcast.to(a).emit('message', data);
    });
});

