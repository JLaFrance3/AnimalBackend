import express from 'express'
import { displayAll, displayOne, createAnimal, login, accountDetails } from "../src/utils.js";

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    return res.send('Hello World');
});

// Get animals
app.get('/animals/all', async (req, res) => {
    const result = await displayAll();
    res.status(200).json(result);
});

// Get one animal by ID
app.get('/animals/:id', async (req, res) => {
    const id = req.params.id;
    const result = await displayOne(id);
    return res.status(200).json(result);
});

app.listen(port, () => {
    console.log(`Running server on port ${port}`);
});