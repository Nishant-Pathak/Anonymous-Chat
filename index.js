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
    var b = {};
    Object.keys(rooms).forEach(function(key) {
        if(rooms[key] == 1) b[key] = rooms[key];
    });
//    console.log(b);
    var d = Object.keys(b);
    var s = d.length;
    
    if(s > 0) {
        var x = parseInt(d[Math.floor((Math.random() * s))]);
        rooms[x]++;
        return x;
    } else {
        var a = rooms.indexOf(0);
        if(a!==-1) {
            rooms[a]++;
            return a;
        }
    }
    rooms.push(1);
    return rooms.length-1;
}

io.on('connection', function(socket){
    console.log("total users: " + io.sockets.sockets.length)
    var a = findAvailableRoom();
    console.log('Assigning room: '+ a + ', id: ' + socket.id);
    socket.join(a);
    if(rooms[a] === 2) {
        io.sockets.to(a).emit('status', '2');
    }

    socket.on('disconnect', function(){
        rooms[a]--;
        socket.broadcast.to(a).emit('status', '0');
        socket.leave(a);
        console.log('Leaving room: '+ a + ', id: ' + socket.id);
    });
    socket.on('send', function (data) {
        socket.broadcast.to(a).emit('message', data);
    });
});

