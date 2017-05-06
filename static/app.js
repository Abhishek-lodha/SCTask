$('#loginForm').submit(function() {
    $.ajax({
        url: $('#loginForm').attr('action'),
        type: $('#loginForm').attr('method'),
        data: $('#loginForm').serialize(),
        success: function(data) {
            var token = data['token'];
            window.localStorage.sc_token = token;
            $('#available_actions').show();
        },
        error: function(err) {
            var jsonResponse = JSON.parse(err.responseText);
            alert(jsonResponse['message']);
        }
    });
    return false;
});

function patchObject() {
    var packet = {
        'default': document.getElementById("default_json").innerHTML,
        "patch": document.getElementById("patch").innerHTML
    };
    $.ajax({
        url: '/patch',
        type: 'post',
        headers: {
            'token': window.localStorage.sc_token
        },
        data: packet,
        success: function(data) {
            document.getElementById("updated_json").innerHTML = JSON.stringify(data);
        },
        error: function(err) {
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
        success: function(data) {
            console.log(data);
            var src = 'data:image/jpg;base64,' + data;
            var newImage = document.createElement('img');
            newImage.src = src;
            document.querySelector('#thumbnail').innerHTML = newImage.outerHTML;
            // $("#thumbnail").html("<img src='data:image/jpg;base64," + data +"' />");
        },
        error: function(err) {
            var jsonResponse = JSON.parse(err.responseText);
            alert(jsonResponse['message']);
        }
    });
}
