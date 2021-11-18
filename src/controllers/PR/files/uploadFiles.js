//CREATE EXPRESS APP
const express = require('express')
const app = express()
var cors = require('cors');
const bodyParser = require('body-parser');
const db = require("../../../db/db");
const multer = require('multer');
app.use(cors())
app.use(bodyParser.urlencoded({
	extended: true
}))
// SET STORAGE
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, '../Uploads')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname) // + '-' + Date.now())
	}
})
app.use(express.json());

var upload = multer({
	storage: storage
})
let uploadFiles = async (req, res) => {
    try {
		const checkFileExist = await db.query(`select filename from prm."FileUpload" where "PR_NO"=${req.headers.pr_no}`);
		if(req.headers.pr_no !== '0' && req.headers.pr_no !== 0 && req.headers.pr_no !== ''){
			var stringValue = `INSERT INTO prm."FileUpload" ("PR_NO","filename","size", "type","path","relativeSize","createBy","changeBy") VALUES`;
			const leng = req.files.length;
			for(let index in req.files){
				var stringValueChiden = '';
				stringValueChiden = `('${req.headers.pr_no}','${req.files[index].filename}','${req.files[index].size}'
				,'${req.files[index].mimetype}','${req.files[index].path}','${(Number(req.files[index].size) /(1024 * 1024)).toFixed(2) + ' MB'}','trungtp','trungtp')`;
				if(leng > Number(index)+1){
					stringValueChiden += ','
				}

				stringValue += stringValueChiden;
			}
			await db.query(`${stringValue}`);
			// console.log('object')
			return res.status(200).json({ message: 'Success' });
			
		}else{
			return res.status(403).json({ message: 'Tạo PR trước' });
		}
	} catch (error) {
		return res.status(403).json({ message: error.message });
	}
}
let downloadFile = async (req, res) => {
	try {
		// var listData = '';
		res.download(`${req.query.dataRQ}`);
		// res.download('../Uploads/imsap.zip');
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
	} catch (error) {
		return res.status(403).json({ message: error.message });
	}

	// res.sendFile('../Uploads/11-1.jpg' + '/index.html');
}
// app.post('/uploadFiles', upload.array('myFile', 10), (req, res) => {
// 	try {
// 		for(let index in req.files){

// 		}
// 	} catch (error) {

// 	}
// })
module.exports = {
	uploadFiles: uploadFiles,
    upload:upload,
	downloadFile:downloadFile
}