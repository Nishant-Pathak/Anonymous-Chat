var messages = [];
var socket;
var tabActive = false;

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
    } else if (tabActive === false){
        d += '<audio src="./sound/ping.mp3" autoplay></audio>';
    }
    $('#cid').append(d);
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);


}

function sendToServer() {
    var a = $('#msg').val();
    a = a.trim();
    $('#msg').val('');
    if(a === '') return;
    renderChat(a, "right");
    socket.emit('send', { message: encodeURIComponent(a) });

}

function sendMsg(e) {
    if(e.keyCode == 13) {
        sendToServer();
    }
}

$(window).blur(function() {
    tabActive = false;
});

$(window).focus(function() {
    tabActive = true;
});


(function () {
$('#myModal').modal({keyboard:false});

    messages = [];
    socket = io.connect();
    $('#myModal').modal('hide');
    $('#app').show(); 
    socket.on('message', function (data) {
        if(data.message) {
            messages.push(data.message);
            renderChat(decodeURIComponent(data.message), "left");
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