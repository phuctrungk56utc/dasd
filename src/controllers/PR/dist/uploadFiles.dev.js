"use strict";

//CREATE EXPRESS APP
var express = require('express');

var app = express();

var cors = require('cors');

var bodyParser = require('body-parser');

var db = require("../../db/db");

var multer = require('multer');

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
})); // SET STORAGE

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, '../Uploads');
  },
  filename: function filename(req, file, cb) {
    cb(null, file.originalname); // + '-' + Date.now())
  }
});
app.use(express.json());
var upload = multer({
  storage: storage
});

var uploadFiles = function uploadFiles(req, res) {
  var checkFileExist, stringValue, leng, index, stringValueChiden;
  return regeneratorRuntime.async(function uploadFiles$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(db.query("select filename from prm.\"FileUpload\" where \"PR_NO\"=".concat(req.headers.pr_no)));

        case 3:
          checkFileExist = _context.sent;

          if (!(checkFileExist.rowCount > 0)) {
            _context.next = 7;
            break;
          }

          _context.next = 12;
          break;

        case 7:
          stringValue = "INSERT INTO prm.\"FileUpload\" (\"PR_NO\",\"filename\",\"size\", \"type\",\"path\",\"createBy\",\"changeBy\") VALUES";
          leng = req.files.length;

          for (index in req.files) {
            stringValueChiden = '';
            stringValueChiden = "('".concat(req.headers.pr_no, "','").concat(req.files[index].filename, "','").concat(req.files[index].size, "'\n\t\t\t\t,'").concat(req.files[index].mimetype, "','").concat(req.files[index].path, "','trungtp','trungtp')");

            if (leng > Number(index) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 12;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue)));

        case 12:
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(403).json({
            message: _context.t0.message
          }));

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
}; // app.get('/getFile', (req, res) => {
// 	res.download('../Uploads/11-1.jpg'); 
// 	// res.sendFile('../Uploads/11-1.jpg' + '/index.html');
// })
// app.post('/uploadFiles', upload.array('myFile', 10), (req, res) => {
// 	try {
// 		for(let index in req.files){
// 		}
// 	} catch (error) {
// 	}
// })


module.exports = {
  uploadFiles: uploadFiles,
  upload: upload
};