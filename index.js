var express = require("express");
var app = express();
var port = 3700;
var rooms = [];
 
app.get("/", function(req, res){
    res.sendFile("index.html");
});
 
var io = require('socket.io').listen(app.listen(port));

function findAvailableRoom() {
    for(var i=0;i< rooms.length;i++) {
        if(rooms[i] !== 2) {
            rooms[i]++;
            return i;
        }
    }
    rooms.push(1);
    return rooms.length-1;
}


io.on('connection', function(socket){

    console.log(rooms);
    var a = findAvailableRoom();
    socket.join(a);
    console.log('a user connected, joined group ' + a);
    socket.on('disconnect', function(){
        rooms[a]--;
        socket.broadcast.to(a).emit('gone', '');
        socket.leave(a);
        console.log('user disconnected');
    });
    socket.on('send', function (data) {
        socket.broadcast.to(a).emit('message', data);
    });
});

//console.log("Listening on port " + port);