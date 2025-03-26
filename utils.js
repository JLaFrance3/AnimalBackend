//https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs
//https://www.npmjs.com/package/js-sha256

import fs from 'node:fs/promises';
import sha256 from 'js-sha256';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Get data from file and return a converted JSON object
async function getData() {
    try {
        const data = await fs.readFile('data.json', { encoding: 'utf8'});
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
    }
}

// Return animals from json object
async function getAnimals() {
    const data = await getData();
    return data.animals;
}

// Return users from json object
async function getUsers() {
    const data = await getData();
    return data.users;
}

// Verify and decode auth token
function verifyToken(token) {
    try {
        const decodedToken = jwt.verify(token, process.env.KEY);
        return decodedToken;
    } catch (err) {
        console.error("Invalid token");
    }
}

// Display all animal objects to console
export async function displayAll() {
    const animals = await getAnimals();
    if (animals) {
        console.log(animals);
    }
    else {
        console.error('Error displaying animals')
    }
}

// Display specific animal object to console
export async function displayOne(id) {
    const animals = await getAnimals();
    const animal = animals.find(animal => animal.id === Number(id));
    if (animals) {
        console.log(animal);
    }
    else {
        console.error(`Error displaying animal with ID: ${id}`)
    }
}

// Create new animal. Requires auth token
export async function createAnimal(authToken, animalData) {
    //Created by user must be an id of existing user
    //Auth not obtained until after login
    //Check for valid token
    //Validation:
        //All required fields
        //name/sciname length > 0
        //description array length > 1
        //images/events array length > 0
        //event must have required fields, name/url > 0, date: mm/dd/yyyy
    //Business logic: unique id, createdByUser
    console.log(`Creating animal ${animalData}`)
}

// Login accepts username and password. Outputs authentication token
export async function login(username, password) {
    const userhash = sha256(username + ":" + password);
    const users = await getUsers();
    const user = users.find(user => user.hash === userhash);
    if (user) {
        //JSON Web Token using user id
        const data = {
            userId: user.id
        }
        //Create token
        const token = jwt.sign(data, process.env.KEY, { expiresIn: '1hr' });

        console.log(token);
    }
    else {
        console.error("Username and password do not match");
    }
}

// Output account details. Requires auth token
export async function accountDetails(authToken) {
    //TODO: Output id and name to console
    console.log('You\'ve added the following animals to the system:\n');
    //TODO: Output id and name of each animal user added
}