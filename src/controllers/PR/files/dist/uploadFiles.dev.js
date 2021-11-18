"use strict";

//CREATE EXPRESS APP
var express = require('express');

var app = express();

var cors = require('cors');

var bodyParser = require('body-parser');

var db = require("../../../db/db");

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

          if (!(req.headers.pr_no !== '0' && req.headers.pr_no !== 0 && req.headers.pr_no !== '')) {
            _context.next = 13;
            break;
          }

          stringValue = "INSERT INTO prm.\"FileUpload\" (\"PR_NO\",\"filename\",\"size\", \"type\",\"path\",\"relativeSize\",\"createBy\",\"changeBy\") VALUES";
          leng = req.files.length;

          for (index in req.files) {
            stringValueChiden = '';
            stringValueChiden = "('".concat(req.headers.pr_no, "','").concat(req.files[index].filename, "','").concat(req.files[index].size, "'\n\t\t\t\t,'").concat(req.files[index].mimetype, "','").concat(req.files[index].path, "','").concat((Number(req.files[index].size) / (1024 * 1024)).toFixed(2) + ' MB', "','trungtp','trungtp')");

            if (leng > Number(index) + 1) {
              stringValueChiden += ',';
            }

            stringValue += stringValueChiden;
          }

          _context.next = 10;
          return regeneratorRuntime.awrap(db.query("".concat(stringValue)));

        case 10:
          return _context.abrupt("return", res.status(200).json({
            message: 'Success'
          }));

        case 13:
          return _context.abrupt("return", res.status(403).json({
            message: 'Tạo PR trước'
          }));

        case 14:
          _context.next = 19;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", res.status(403).json({
            message: _context.t0.message
          }));

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

var downloadFile = function downloadFile(req, res) {
  return regeneratorRuntime.async(function downloadFile$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          // var listData = '';
          res.download("".concat(req.query.dataRQ)); // res.download('../Uploads/imsap.zip');
          // const leng = req.query.listPath.length;
          // for(let index in req.query.listPath){
          // 	var stringValueChiden = '';
          // 	stringValueChiden = req.query.listPath[index];
          // 	if(leng > Number(index)+1){
          // 		stringValueChiden += ','
          // 	}
          // 	listData += stringValueChiden;
          // }
          // // console.log('object')
          // res.download(`${req.query.listPath}`); 
          // res.sendFile('./Uploads/11-1.jpg' + '/index.html');
          // return res.status(200).json({ message: 'Success' });

          _context2.next = 7;
          break;

        case 4:
          _context2.prev = 4;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(403).json({
            message: _context2.t0.message
          }));

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 4]]);
}; // app.post('/uploadFiles', upload.array('myFile', 10), (req, res) => {
// 	try {
// 		for(let index in req.files){
// 		}
// 	} catch (error) {
// 	}
// })


module.exports = {
  uploadFiles: uploadFiles,
  upload: upload,
  downloadFile: downloadFile
};