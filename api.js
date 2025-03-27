import express from 'express'
import { handleRequest } from './index.js'

const app = express();
const port = 3000;

app.get('/', (request, response) => {
    return response.send('Hello World');
});

app.get('/animals', async (req, res) => {
    const result = await handleRequest(['animals', 'all']);
    res.status(200).json(result);
});

app.get('/animals/:id', async (req, res) => {
    const id = req.params.id;
    return res.status(200).json(animals);

    //TODO: get animal by id, if id not valid 400, if animal not found 404, if animal found return animal
});

app.listen(port, () => {
    console.log(`Running server on port ${port}`);
});