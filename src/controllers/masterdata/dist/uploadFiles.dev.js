"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

app.post('/uploadfiles', upload.array('myFile', 10), function (req, res) {
  var files = req.files;
  var a = [];
  var paths = req.files.map(function (file) {
    var b = [];
    b.push(file.path);
    a.push(b);
  });
  console.log(a);
  console.log(_typeof(paths));
  var text = 'INSERT INTO public."FILE_STORAGE"(FILE_PATH) SELECT  FROM UNNEST ($1::text[]) RETURNING ';
  var values = paths; // promise

  client.query(text, [a]).then(function (res1) {
    console.log(res1.rows);
    var result = res1.rows;
    return res.json(result);
  })["catch"](function (e) {
    return console.error(e.stack);
  });
});