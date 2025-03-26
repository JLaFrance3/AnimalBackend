import { displayAll, displayOne, createAnimal } from "./utils.js";

//Get commands arguments
const args = process.argv.slice(2)

function handleRequest(args) {
    if (args.length < 1) {
        console.error('Invalid number of arguments');
        return;
    }

    const main = args[0];
    const command = args[1];

    switch (main) {
        case 'animals':
            break;
        case 'user':
            break;
        case 'login':
            break;
        default:
            console.error(`Unknown command: ${main}`);
            return;
    }

    if (args.length < 2) {
        console.error(`Invalid number of arguments for ${main} command`);
        return;
    }
    
    switch (command) {
        case 'all':
            displayAll();
            break;
        case 'one':
            displayOne(args[2]);
            break;
        case 'create':
            createAnimal(args[2], args[3]);
            break;
        default:
            console.error(`Unknown command: ${command}`);
            return;
    }


}

handleRequest(args);