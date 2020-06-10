const express = require('express')
const app = express()
const port = 3000

app.post('/post', (req, res) => res.send({
	code: 200,
	data: '请求到了端口3000的数据!'
}))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))