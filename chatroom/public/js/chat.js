
// Create a user name
function random_name(){
    return faker.fake('{{name.firstName}} {{name.lastName}}');
}

var UserName = window.prompt("Enter your name", random_name());
// var UserName = random_name();

$(".Name").html(UserName);

// $('.Name').val(UserName)

// Creating a socket instance
//const socket = io();
let url = "https://lineardisney-jumbobalsa-8800.codio-box.uk"
const socket = io(url);
// Online user set
const activeUsers = new Set();

socket.emit("New User", UserName)

// Bind the operation on which the information is received
// List of all users
socket.on("Users", function(data){
    let msg = "There are currently users: " + data.join(", ");

    system_message(msg);

    data.forEach(element => {
        activeUsers.add(element);
    });
    refresh_users();
})

// socket.on("Change Name", function(old_username, new_username){
//     if (UserName == old_username){
//         UserName = new_username;
//     }
//     activeUsers.delete(old_username);
//     activeUsers.add(new_username);
//     refresh_users();
// });


// New user
socket.on("New User", function(data){
    let msg = '"' + data + '"' + " join the group chat";
    activeUsers.add(data);
    system_message(msg);
    refresh_users();
});


//  User exit
socket.on("User Disconnected", function(data){
    let msg = '"' + data + '"' + " left the group chat";
    system_message(msg);
    activeUsers.delete(data);
    refresh_users();
});

// The message sent by the user was received. Procedure
socket.on("Message", function(name, text, date){
    let msg = `<div class="item">
                    <div class="info">
                        <span class="name">${name}</span>
                        <span class="date">${date}</span>
                    </div>
                    <div class="content">${text}</div>
                </div>`
    $(".message").append(msg);
    $('.message').scrollTop($('.message').height())
});

// Refresh online users
function refresh_users(){
    console.log(activeUsers);
    $(".count").html([...activeUsers].length);
    $("ul").empty();
    [...activeUsers].forEach(element => {
        let li =  `<li>${element}</li>`
        $("ul").append(li);
        console.log(li);
    });
};

// System information
function system_message(msg){
    let div = `<div class="system">${msg}</div>`
    $(".message").append(div);
    $('.message').scrollTop($('.message').height())
};

// Send a message
$("#send").click(function(){
    let text = $.trim($("#textarea").val());
    if (text == ""){
        ;;;
    } else {
        socket.emit("Message", text);
    }
    $("#textarea").val('');
});

// Change username
// $(".Change").click(function(){
//     let new_username = $('.Name').val();
//     socket.emit("Change Name", UserName, new_username);
// })
