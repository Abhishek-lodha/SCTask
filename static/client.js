function loadPage(href) {
    $.ajax({
        url: href,
        type: 'get',
        headers: {
            'token': window.localStorage.sc_token
        },
        success: (data) => {
            document.getElementById('bottom').innerHTML = data;
        }
    });
}

$('#loginForm').submit(function() {
    $.ajax({
        url: $('#loginForm').attr('action'),
        type: $('#loginForm').attr('method'),
        data: $('#loginForm').serialize(),
        success: (data) => {
            var token = data['token'];
            window.localStorage.sc_token = token;
            loadPage('/tasks');
        },
        error: (err) => {
            var jsonResponse = JSON.parse(err.responseText);
            alert(jsonResponse['message']);
        }
    });
    return false;
});

function patchObject() {
    var packet = {
        'default': document.getElementById("default_json").innerHTML,
        "patch": document.getElementById("patch").value
    };
    $.ajax({
        url: '/patch',
        type: 'post',
        headers: {
            'token': window.localStorage.sc_token
        },
        data: packet,
        success: (data) => {
            document.getElementById("updated_json").innerHTML = JSON.stringify(data);
        },
        error: (err) => {
            var jsonResponse = JSON.parse(err.responseText);
            alert(jsonResponse['message']);
        }
    });
}

function createThumbnail() {
    var image_url = {
        'url': document.getElementById("image_url").value
    };
    $.ajax({
        url: '/thumbnail',
        type: 'post',
        headers: {
            'token': window.localStorage.sc_token
        },
        data: image_url,
        success: (data) => {
            const src = data;
            var newImage = document.createElement('img');
            newImage.src = src;
            $("#thumbnail").html("<img src='" + data +"' />");
        },
        error: (err) => {
            var jsonResponse = JSON.parse(err.responseText);
            alert(jsonResponse['message']);
        }
    });
}