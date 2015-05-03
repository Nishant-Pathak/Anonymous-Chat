var messages = [];
var socket;
var tabActive = false;
var isActiveUser = false;
var lastActiveTime;

function renderChat(msg, side) {
    if(msg === "") return;

    var name = "Anonymous";
    var d = ' <div class="row chatParent"> <div class="well well-sm anonymous">'
        + '<div class="col-xs-3">'
        + '  <!--span>Anonymous</span--><img src="./images/manager.png" class="img-circle" style="height:30px; width:30px;">'
        + ' </div>'
        + ' <div class="col-xs-9">'
        + ' <strong class="msgdiv">'+ msg +'</strong>'
        + '</div>'
        + '</div>'
        + '</div>';
    if(side == "right") {
        d = '  <div class="row chatParent"><div class=" well well-sm you">'
            +' <div class="col-xs-9">'
            +' <strong class="msgdivYou">'+ msg +'</strong>'
            +'</div>'
            +  '<div class="col-xs-2">'
            + '  <img src="./images/employee.png" class="img-circle" style="height:30px; width:30px;"> <!--span>You</span-->'
            + '</div>'
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
    isActiveUser = true;
    lastActiveTime = new Date().getTime();

}

function sendMsg(e) {
    if(e.keyCode == 13) {
        sendToServer();
        return false;
    }
}

$(window).blur(function() {
    tabActive = false;
});

$(window).focus(function() {
    tabActive = true;
});

function meStillActive() {
    if(isActiveUser) {
        var currentTime = new Date().getTime();
        console.log(currentTime - lastActiveTime);
        if(currentTime - lastActiveTime  > 5000 * 60) {
            console.log("No activity from long time");
            isActiveUser = false;
        }
    }
}

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

    socket.on('status', function (data) {
        if(data === "0") { // other left
            meStillActive();
            if(isActiveUser) {
                location.reload();
            } else {
                socket.disconnect();
                $('#status').addClass('alert-warning').removeClass('alert-info').removeClass('alert-success');
                $('#status')[0].innerHTML = "<strong>Reload manually to connect.</strong> Happy chatting";
                $("html, body").animate({ scrollTop: 0 }, 1000);
            }
        } else if(data === "1") { //first user
        } else if(data === "2") {
            $('#status').addClass('alert-success').removeClass('alert-info').removeClass('alert-warning');
            $('#status')[0].innerHTML = "<strong>User connected.</strong> Start chatting";
        }
    });
    

    $('#send').on('click', function () {
        sendToServer();
    });  
}())