const express = require("express");
const cors = require("cors");
const pool = require('./DB/DB');
const validateRequest = require('./MiddleWare/reqestValidate');

const PORT = process.env.PORT || 3000;

const app = express();


app.use(express.json());
app.use(cors());

app.post('/addproduct', validateRequest, async (req, res) => {
	try {
		const request = req.requestInfo;
		const newValues = [];
		for (let key in request) {
			if (key == 'id') {
				continue;
			}
			newValues.push(request[key]);
		}
		console.log(newValues);
		const query = 'INSERT INTO products(name,description,quality,price) VALUES($1,$2,$3,$4) RETURNING *';
		const result = await pool.query(query, newValues);
		return res.status(201).json(result.rows[0]);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: err.message, detail: err.detail, code: err.code });
	}
});

app.get('/products', async (req, res) => {
	try {
		const query = 'select * from products';
		const result = await pool.query(query);
		return res.status(201).json(result.rows);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Internal server error.", detail: err.detail.toString() });
	}
});

app.get('/products/expensive', async (req, res) => {
	try {
		const query = 'select * from products where price > 10000';
		const result = await pool.query(query);
		res.status(201).json(result.rows);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Internal server error.", detail: err.detail.toString() });
	}
});

app.get('/products/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const query = 'select * from products where id = $1';
		const result = await pool.query(query, [id]);
		if (result.rows.length === 0) {
			return res.status(404).json({ message: "Product not found." });
		}
		return res.status(200).json(result.rows[0]);
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Internal server error.", detail: err.detail.toString() });
	}
});

app.put('/products/:id', validateRequest, async (req, res) => {
	try {
		const { id } = req.params;
		const request = req.requestInfo;
		const query = 'update products set name=$1, price=$2, description=$3 where id=$4 returning *';
		const result = await pool.query(query, [request.name, request.price, request.description, id]);
		if (result.rowCount === 0) {
			return res.status(404).json({ message: "Product not found." });
		}
		return res.status(200).json({ message: "Product updated successfully.", oldProduct: result.rows[0] });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Internal server error.", detail: err.detail.toString() });
	}
});

app.delete('/products/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const query = 'delete from products where id=$1 returning *';
		const result = await pool.query(query, [id]);
		if (result.rowCount === 0) {
			return res.status(404).json({ message: "Product not found." });
		}
		return res.status(200).json({ message: "Product deleted successfully.", oldProduct: result.rows[0] });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Internal server error.", detail: err.detail.toString() });
	}
});

app.listen(PORT, () => {
	console.log(`Server run on ${PORT}`);
	console.log(`Server url is:\nhttp://localhost:${PORT}`);
});