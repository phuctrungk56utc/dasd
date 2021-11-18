"use strict";

//CREATE EXPRESS APP
var cors = require('cors');

var bodyParser = require('body-parser');

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

var uploadFile = function uploadFile(req, res) {
  var index;
  return regeneratorRuntime.async(function uploadFile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          try {
            for (index in req.files) {}
          } catch (error) {}

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

app.get('/getFile', function (req, res) {
  res.download('../Uploads/11-1.jpg'); // res.sendFile('../Uploads/11-1.jpg' + '/index.html');
});
app.post('/uploadFiles', upload.array('myFile', 10), function (req, res) {
  try {
    for (var index in req.files) {}
  } catch (error) {}
});
module.exports = {
  uploadFile: uploadFile,
  upload: upload
};