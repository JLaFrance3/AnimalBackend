import { displayAll, displayOne, createAnimal, login } from "./utils.js";

//Get commands arguments
const args = process.argv.slice(2)

async function handleRequest(args) {
    if (args.length < 2) {
        console.error('Invalid number of arguments');
        return;
    }

    const main = args[0];
    const command = args[1];

    switch (main) {
        // Handle animals commands
        case 'animals':
            switch (command) {
                case 'all':
                    await displayAll();
                    break;
                case 'one':
                    await displayOne(args[2]);
                    break;
                case 'create':
                    await createAnimal(args[2], args[3]);
                    break;
                default:
                    console.error(`Unknown command: ${command}`);
                    return;
            }
        // Handle user commands
        case 'user':
            switch (command) {
                case '':

                    break;
                default:
                    console.error(`Unknown command: ${command}`);
                    return;
            }
        // Handle login commands
        case 'login':
            if (args.length < 3) {
                console.error("Invalid number of arguments. Please provide username and password.");
                return;
            }
            await login(args[1], args[2]);
            break;
        // Main command not recognized, throw error
        default:
            console.error(`Unknown command: ${main}`);
            return;
    }
}

handleRequest(args);