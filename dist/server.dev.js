"use strict";

// require('dotenv').config()
// const express = require('express')
// const jwt = require('jsonwebtoken')
// const verifyToken = require('./middleware/auth')
// const app = express()
// //CREATE EXPRESS APP
// var cors = require('cors');
// const bodyParser = require('body-parser')
// const multer = require('multer');
// app.use(cors())
// app.use(bodyParser.urlencoded({
// 	extended: true
// }))
// // SET STORAGE
// var storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, '../Uploads')
// 	},
// 	filename: function (req, file, cb) {
// 		cb(null, file.originalname) // + '-' + Date.now())
// 	}
// })
// var upload = multer({
// 	storage: storage
// })
// app.use(express.json())
// // database
// const { Pool, Client } = require('pg')
// // const client = new Client({
// //     user: 'postgres',
// //     host: 'localhost',
// //     database: 'PRM_SYSTEM',
// //     password: '@@@@',
// //     port: 5433,
// // });
// // const { Pool } = require('pg')
// // const pool = new Pool({
// //   user: 'postgres',
// //   host: 'localhost',
// //   database: 'PRM_SYSTEM',
// //   password: '@@@@',
// //   port: 5433,
// // })
// const client = new Client({
// 	user: 'postgres',
// 	host: 'localhost',
// 	database: 'PRM_SYSTEM',
// 	password: '@@@@',
// 	port: 5433,
//   })
// client.connect()
// const posts = [
// 	{
// 		userId: 1,
// 		post: 'post henry'
// 	},
// 	{
// 		userId: 2,
// 		post: 'post jim'
// 	},
// 	{
// 		userId: 1,
// 		post: 'post henry 2'
// 	}
// ]
// app.get('/getFile', (req, res) => {
// 	res.download('../Uploads/11-1.jpg'); 
// 	// res.sendFile('../Uploads/11-1.jpg' + '/index.html');
// })
// app.post('/uploadFiles', upload.array('myFile', 10), (req, res) => {
// 	try {
// 		for(let index in req.files){
// 		}
// 	} catch (error) {
// 	}
//   res.status(200).json({ item: 'resp.rows' });
// 	// const files = req.body.myFile
// 	// var a = []
// 	// var paths = files.map(file => {
// 	// 	var b = []
// 	// 	b.push(file.path)
// 	// 	a.push(b)
// 	// })
// 	// console.log(a)
// 	// console.log(typeof (paths))
// 	// const text = 'INSERT INTO public."FILE_STORAGE"(FILE_PATH) SELECT  FROM UNNEST ($1::text[]) RETURNING '
// 	// const values = paths
// 	// // promise
// 	// client
// 	// 	.query(text, [a])
// 	// 	.then(res1 => {
// 	// 		console.log(res1.rows)
// 	// 		let result = res1.rows
// 	// 		return res.json(result)
// 	// 	})
// 	// 	.catch(e => console.error(e.stack))
// })
// // app
// app.get('/posts', verifyToken, (req, res) => {
// 	res.json(posts.filter(post => post.userId === req.userId))
// })
// app.post('/api/company', (req, res) => {
// 	// const id = 'i8Lhazl2J9lED12iRFRUzVshU0/u6oTV5ZzVM3JBw24937gmv0zjZ197RY7Bi2e5'
// 	// const accessToken = jwt.sign(
// 	// 	{ id },
// 	// 	process.env.ACCESS_TOKEN_SECRET,
// 	// 	{
// 	// 		// expiresIn: '20s'
// 	// 	}
// 	// )
// 	// pool.query('SELECT * FROM prm.demo', (err, res) => {
// 	// 	console.log(res.rows) 
// 	// 	pool.end() 
// 	//   })
// 	client.query('SELECT * FROM prm.demo', (err, res) => {
// 		console.log(res.rows)
// 		client.end()
// 	  })
// 	console.log(req.body)
// 	res.json('accessToken')
// })
// app.post('/check', (req, res) => {
// 	const tocKen = req.body.tocKen
// 	try {
// 		jwt.verify(tocKen, process.env.ACCESS_TOKEN_SECRET)
// 		res.json('success')
// 	} catch (error) {
// 		// var moment = require('moment')
// 		// var created = moment().format(error.expiredAt)
// 		var datetimeTocken = new Date(error.expiredAt);
// 		var datetimeCurrent = new Date();
// 		// var timeStampTocken = datetimeTocken.getTime();
// 		// var timeStampCurrent = datetimeCurrent.getTime();
// 		// var d = timeStampCurrent - timeStampTocken;
// 		var seconds = Math.floor((datetimeCurrent - (datetimeTocken))/1000);
// 		var minutes = Math.floor(seconds/60);
// 		var hours = Math.floor(minutes/60);
// 		var days = Math.floor(hours/24);
// 		hours = hours-(days*24);
// 		minutes = minutes-(days*24*60)-(hours*60);
// 		seconds = seconds-(days*24*60*60)-(hours*60*60)-(minutes*60);
// 		res.sendStatus(error)
// 		console.log(error)
// 	}
// 	res.json(accessToken)
// })
// const PORT = process.env.PORT || 8017
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
// // var express = require('express')
// // const http = require("http");
// // var app = express();
// // const server = http.createServer(app);
// // const socketIo = require("socket.io")(server, {
// //   cors: {
// //     origin: "*",
// //   }
// // });
// // // nh??? th??m c??i cors n??y ????? tr??nh b??? Exception nh?? :D  ??? ????y m??nh l??m nhanh n??n cho ph??p t???t c??? c??c trang ?????u cors ???????c. 
// // // socketIo.on("connection", function (socket) {
// // //   console.log("New client connected " + socket.id); 
// // //   socket.on('sendDataClient', function (msg) {
// // //     console.log('vao day'); 
// // //     socketIo.emit('chat message', msg);
// // //   });
// // // });
// // const user = {
// //   date:'ngay nao do vang em'
// // }
// // socketIo.on("connection", (socket) => { ///Handle khi c?? connect t??? client t???i
// //   console.log("New client connected " + socket.id); 
// //   socket.on("sendDataClient", function(data) { // Handle khi c?? s??? ki???n t??n l?? sendDataClient t??? ph??a client
// //     console.log(data)
// //     socketIo.to(socket.id).emit("sendDataServer", { user });// ph??t s??? ki???n  c?? t??n sendDataServer c??ng v???i d??? li???u tin nh???n t??? ph??a server
// //   })
// //   socket.on("disconnect", () => {
// //     console.log("Client disconnected"); // Khi client disconnect th?? log ra terminal.
// //   });
// // });
// // server.listen(3001, () => {
// //   console.log('Server ??ang chay tren cong 3001 hehehe');
// // });

/**
 * Created by trungquandev.com's author on 16/10/2019.
 * src/server.js
 */
var express = require("express");

var app = express();

var initAPIs = require("./src/routes/api");

var axios = require('axios'); // var express = require('express')


var http = require("http"); // var app = express();


var server = http.createServer(app); // Cho ph??p c??c api c???a ???ng d???ng x??? l?? d??? li???u t??? body c???a request

app.use(express.json()); // Kh???i t???o c??c routes cho ???ng d???ng

initAPIs(app); // socketIo

var socketIo = require("socket.io")(server, {
  cors: {
    origin: "*"
  }
}); // const user = {
//   date: 'ngay nao do vang em'
// }


var listUSer = [];
socketIo.on("connection", function (socket) {
  ///Handle khi c?? connect t??? client t???i
  // console.log("New client connected " + socket.id);
  // const socClient = {userId:'',socId:''}
  // socClient.userId = 'trungtp';
  // socClient.socId = socket.id;
  // listUSer.push(socClient);
  socket.on("sendDataClient", function (data) {
    // Handle khi c?? s??? ki???n t??n l?? sendDataClient t??? ph??a client
    var user = {
      userId: '',
      id: ''
    };
    user.userId = data.userId.toUpperCase();
    user.id = socket.id;
    var obj = listUSer.find(function (o) {
      return o.id === socket.id;
    });

    if (!obj) {
      listUSer.push(user);
    }

    console.log(listUSer); // socketIo.to(socket.id).emit("sendDataServer", { user });// ph??t s??? ki???n  c?? t??n sendDataServer c??ng v???i d??? li???u tin nh???n t??? ph??a server
  });
  socket.on("disconnect", function () {
    console.log("Client disconnected: " + socket.id); // Khi client disconnect th?? log ra terminal.

    for (var i = 0; i < listUSer.length; i++) {
      if (listUSer[i].id == socket.id) {
        listUSer.splice(i, 1);
        break;
      }
    } // listUSer.splice(listUSer.indexOf(socket.id), 1);
    // listUSer = listUSer.filter(function( obj ) {
    //   return obj.id !== socket.id;
    // });
    // console.log("Client disconnected"); // Khi client disconnect th?? log ra terminal.

  });
}); ////////////////////
// Node.js
// const options = {
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `key=AAAAODuKmmQ:APA91bFyfubFmoGlazPFYwnBaYrjO-Wda9ZRl3EE0_LT8uPdjDPmgVafBA2a8h4rRIZtP-zMFIprf_Y-ihUqUCOomXERR2f8UurVFQT4UPBJ4Fh8i0JxecHPNVF_kyCC7l4nullOFs1V`
//   }
//   };
//   const data = { 
//   "registration_ids": ["fupLfKdmRCSxri7rvCUdfe:APA91bGUSxEOToUDSIeY4b39U_wU2Ti-L2ijwiHifRUtfOJ7UHdxlbZ_8JBKSC8VyVMUZfCdA5xZULXiwUeDkhT8Yg3jNjRqPFLfM5QFG8V7C9vi_6jkTgZW664sIl8bLdpQcNWMwf-9"], 
//    "notification" : {
//    "body" : "New announcement assigned",
//    "OrganizationId":"2",
//    "content_available" : true,
//    "priority" : "high",
//    "subtitle":"Elementary School",
//    "title":"hello"
//    },
//    "data" : {
//    "priority" : "high",
//    "sound":"app_sound.wav",
//    "content_available" : true,
//    "bodyText" : "New Announcement assigned",
//    "organization" :"Elementary school"
//   }
//   };
// axios.post('https://fcm.googleapis.com/fcm/send?',data,options)
//   .then(function (response) {
//     // handle success
//     console.log(response);
//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   })
//   .then(function () {
//     // always executed
//   });
// module.exports.lisUser = listUSer;
// ch???n m???t port m?? b???n mu???n v?? s??? d???ng ????? ch???y ???ng d???ng t???i local

var port = 8017;
server.listen(3001, function () {
  console.log("Hello trungtp, I'm running at localhost:".concat(port, "/"));
});
app.listen(8017, function () {
  console.log("Hello trungtp, I'm running/");
});
module.exports.ioObject = {
  socketIo: socketIo,
  listUSer: listUSer
};