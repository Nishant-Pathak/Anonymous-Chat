var messages = [];
var socket;
var tabActive = false;

function renderChat(msg, side) {
    if(msg === "") return;

    var name = "Anonymous";
    var d = '  <div class="row well well-sm">'
        + '<div class="col-xs-2">'
        + '  <!--span>Anonymous</span--><img src="./images/manager.png" class="img-circle" style="height:30px; width:30px;">'
        + ' </div>'
        + ' <div class="col-xs-10">'
        + ' <strong class="msgdiv">'+ msg +'</strong>'
        + '</div>'
        + '</div>';
    if(side == "right") {
        d = '  <div class="row well well-sm">'
            +' <div class="col-xs-10">'
            +' <strong class="msgdivYou">'+ msg +'</strong>'
            +'</div>'
            +  '<div class="col-xs-2">'
            + '  <img src="./images/employee.png" class="img-circle" style="height:30px; width:30px;"> <!--span>You</span-->'
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