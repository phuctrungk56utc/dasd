app.post('/uploadfiles', upload.array('myFile', 10), (req, res) => {

	const files = req.files
	var a = []

	var paths = req.files.map(file => {
		var b = []
		b.push(file.path)
		a.push(b)

	})
	console.log(a)
	console.log(typeof (paths))


	const text = 'INSERT INTO public."FILE_STORAGE"(FILE_PATH) SELECT  FROM UNNEST ($1::text[]) RETURNING '
	const values = paths

	// promise
	client
		.query(text, [a])
		.then(res1 => {
			console.log(res1.rows)
			let result = res1.rows
			return res.json(result)
			
		})
		.catch(e => console.error(e.stack))


})