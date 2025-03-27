//https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs
//https://www.npmjs.com/package/js-sha256

import fs from 'node:fs/promises';
import sha256 from 'js-sha256';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

// Get data from file and return a converted JSON object
async function getDataFromFile() {
    try {
        const data = await fs.readFile('data.json', { encoding: 'utf8'});
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
    }
}

// Add animal to file
async function writeAnimalToFile(animalData) {
    try {
        const animalJSON = JSON.stringify(animalData);
        await fs.writeFile('data.json', animalJSON);
    } catch (err) {
        console.error(err);
    }
}

// Return animals from json object
async function getAnimals() {
    const data = await getDataFromFile();
    return data.animals;
}

// Return users from json object
async function getUsers() {
    const data = await getDataFromFile();
    return data.users;
}

// Verify and decode auth token
function verifyToken(token) {
    try {
        const decodedToken = jwt.verify(token, process.env.KEY);
        return decodedToken;
    } catch (err) {
        console.error("Error 400. Bad request: Invalid token");
    }
}

// Validation for animal creation. Returns boolean.
function isValidAnimal(animalData) {
    // All required fields
    const requiredFields = ['name', 'sciName', 'description', 'images', 'events'];
    const missingFields = requiredFields.filter(field => !(field in animalData));

    if (missingFields.length > 0) {
        console.error(`Error 400. Bad request: Missing ${missingFields} fields`);
        return false;
    }

    // Name and scientific name length > 0
    if (animalData.name.length === 0) {
        console.error('Error 400. Bad request: Missing animal name value')
        return false;
    }
    if (animalData.sciName.length === 0) {
        console.error('Error 400. Bad request: Missing scientific name value')
        return false;
    }

    // Description array length >= 2
    if (animalData.description.length < 2) {
        console.error('Error 400. Bad request: Description must have at least 2 elements')
        return false;
    }

    // Images/events array length >= 1
    if (animalData.images.length < 1) {
        console.error('Error 400. Bad request: Images must have at least 1 element')
        return false;
    }

    // Validate events
    const events = animalData.events;
    const reqEventFields = ['name', 'data', 'url'];
    const dateRegex = new RegExp('/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/');
    events.forEach(event => {

        // Events must have required fields
        const missingEventFields = reqEventFields.filter(field => !(field in events));
        if (missingFields.length > 0) {
            console.error(`Error 400. Bad request: Missing ${missingEventFields} fields`);
            return false;
        }

        // Name and url length > 0
        if (event.name.length === 0) {
            console.error('Error 400. Bad request: Missing event name')
            return false;
        }
        if (event.url.length === 0) {
            console.error('Error 400. Bad request: Missing event url')
            return false;
        }

        // Date in mm/dd/yyyy format
        if (!dateRegex.test(event.date)) {
            console.error('Error 400. Bad request: Event date format must be mm/dd/yyyy')
        }

        return true;
    });
}

// Display all animal objects to console
export async function displayAll() {
    const animals = await getAnimals();
    if (animals) {
        console.log(animals);
    }
    else {
        console.error('Error 404. No animals found.')
    }
}

// Display specific animal object to console
export async function displayOne(id) {
    const animals = await getAnimals();
    const animal = animals.find(animal => animal.id === Number(id));
    if (animal) {
        console.log(animal);
    }
    else {
        console.error(`Error 404. Animal with ID ${id} not found`)
    }
}

// Create new animal. Requires auth token
export async function createAnimal(authToken, animalJSON) {
    // Decode token
    const decodedToken = verifyToken(authToken);
    if (!decodedToken) return;

    // Get specific user
    const userID = decodedToken.userId;
    const users = await getUsers();
    let user;
    if (users) {
        user = users.find(user => user.id === userID);
    }

    // Created by user must be an id of existing user
    if (!user) return;

    // Parse animalJSON
    const animalData = JSON.parse(animalJSON);

    // Validate animal information
    if (isValidAnimal(animalData)) return;
    
    // Provide animal unique id
    const animals = await getAnimals();
    let uniqueID;
    if (animals) {
        let maxID = 0;
        animals.forEach(animal => {
            maxID = Math.max(animal.id, maxID);
        });
        uniqueID = maxID++;
    }
    
    // Add uniqueID and createdByUser to animalData
    animalData.id = uniqueID;
    animalData.createdByUser = user.id;

    // Add animal to file
    writeAnimalToFile(animalData);
}

// Login accepts username and password. Outputs authentication token
export async function login(username, password) {
    const userhash = sha256(username + ":" + password);
    const users = await getUsers();
    const user = users.find(user => user.hash === userhash);
    if (user) {
        // JSON Web Token using user id
        const data = {
            userId: user.id
        }
        // Create token
        const token = jwt.sign(data, process.env.KEY, { expiresIn: '1hr' });

        console.log(token);
    }
    else {
        console.error("Error 400. Bad request: Username and password do not match");
    }
}

// Output account details. Requires auth token
export async function accountDetails(authToken) {
    // Decode token
    const decodedToken = verifyToken(authToken);
    if (!decodedToken) return;

    const userID = decodedToken.userId;
    const users = await getUsers();
    let user;
    
    // Get specific user
    if (users) {
        user = users.find(user => user.id === userID);
    }

    if (user) {
        // Output id and name to console
        console.log(`User: ${user.id}\nName: ${user.name}`);
        console.log('\nYou\'ve added the following animals to the system:');

        // Output id and name of each animal user added
        const animals = await getAnimals();
        const usersAnimals = animals.filter(animal => animal.createdByUser === user.id);
        usersAnimals.forEach(animal => {
            console.log(`Animal ID: ${animal.id}\nAnimal Name: ${animal.name}\n`);
        });
    }
}