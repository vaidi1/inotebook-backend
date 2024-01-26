const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();

const app = express()
const port = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

//Available routes
app.use('/api', (req, res) => res.send({"res": "success"})
app.use('/api/auth', require('./routes/auth'))
app.use('/api/note', require('./routes/note'))


app.listen(port, () => {
  console.log(`iNotebook backend listening on port http://localhost:${port}`)
})

export default app;

