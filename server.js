var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require('body-parser');
var all_messages = [];

app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, "./static")));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index', {messages: all_messages});
})

var server = app.listen(8000, function() {
	console.log("listening on port 8000");
})

var io = require('socket.io').listen(server) 

io.sockets.on('connection', function (socket) {

 	socket.on("got_a_new_user", function (data){ 
 		io.emit("new_user", { user_name : data.name });
	})	

	socket.on("send_message", function (data){
		all_messages.push({messages : data.name + ' : ' + data.message});
 		io.emit("new_message",  { message : data.message, name : data.name });
 		io.emit("get_messages", { messages : all_messages });
	})

})


