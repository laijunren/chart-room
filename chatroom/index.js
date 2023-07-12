const express = require("express");
const socket = require("socket.io");
const path = require('path');


const PORT = 8800;
const app = express();

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Listening port
const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
  });

// Home page routing
app.get("/", function(req, res){
    res.sendFile("./public/home.html", {root: __dirname})
})

// Online user set
const activeUsers = new Set();

// Binding socket operation
const io = socket(server);
io.on("connection", function(socket){
    // New user
    socket.on("New User", function(data){
        socket.userId = data;
        socket.emit("Users", [...activeUsers])
        activeUsers.add(data);
        io.emit("New User", socket.userId);
    })

    // disconnect
    socket.on("disconnect", function () {
        activeUsers.delete(socket.userId);
        io.emit("User Disconnected", socket.userId);
      });

    // socket.on("Change Name", function(old_username, new_username){
    //     activeUsers.delete(old_username);
    //     socket.userId = new_username;
    //     activeUsers.add(new_username);
    //     io.emit("Change Name", old_username, new_username)
    // })

    // The message sent by the client was received.
    socket.on("Message", function(data){
        io.emit("Message", socket.userId, data, new Date().toLocaleString());
    })
});


