var messages = [];
var socket;

function renderChat(msg, side) {
    if(msg === "") return;

    var name = "Anonymous";
    var d = '  <div class="row well">'
        + '<div class="col-sm-2">'
        + '  <span>Anonymous</span><img src="./images/manager.png" class="img-circle" style="height:80px; width:80px;">'
        + ' </div>'
        + ' <div><br>'
        + ' <strong>'+ msg +'</strong><br>'
        + '</div>'
        + '</div>';
    if(side == "right") {
        d = '  <div class="row well">'
            +' <div class="col-sm-6 col-md-offset-4" style="text-align:right;"><br>'
            +' <strong>'+ msg +'</strong><br>'
            +'</div>'
            +  '<div class="col-sm-2">'
            + '  <img src="./images/employee.png" class="img-circle" style="height:80px; width:80px;"> <span>You</span>'
            + ' </div>'
            +'</div>';
    }
    $('#cid').append(d);
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);


}

function sendToServer() {
    var a = $('#msg');
    renderChat(a.val(), "right");
    socket.emit('send', { message: a.val() });
    $('#msg').val('');
}

function sendMsg(e) {
    if(e.keyCode == 13) {
        sendToServer();
    }
}

(function () {
$('#myModal').modal({keyboard:false});

    messages = [];
    socket = io.connect('http://tafri.herokuapp.com:3700');
    $('#myModal').modal('hide');
    $('#app').show(); 
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data.message);
            renderChat(data.message, "left");
        } else {
            console.log("There is a problem:", data);
        }
    });

    socket.on('gone', function (data) {
        location.reload();
    });
    

    $('#send').on('click', function () {
        sendToServer();
    });  
}())