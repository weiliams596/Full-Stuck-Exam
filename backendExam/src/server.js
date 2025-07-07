const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT  || 3000;

const app = express();


app.use(express.json());
app.use(cors());

app.get('/',async(req,res)=>{
	res.send("Hello World");
});


app.listen(PORT,()=>{
	console.log(`Server run on ${PORT}`);
	console.log(`Server url is:\nhttp://localhost:${PORT}`);
});