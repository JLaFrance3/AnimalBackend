import { displayAll, displayOne, createAnimal, login, accountDetails } from "./utils.js";

//Get commands arguments
const args = process.argv.slice(2)

export async function handleRequest(args) {
    if (args.length < 2) {
        console.error('Error 400. Bad request: Invalid number of arguments');
        console.log(args);
        return;
    }

    const resource = args[0];
    const command = args[1];

    switch (resource) {
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
                    console.log();
                    await createAnimal(args[2], args[3]);
                    break;
                // Command not recognized, throw error
                default:
                    console.error(`Error 400. Bad request: Unknown command ${command}`);
                    return;
            }
            break;
        // Handle user commands
        case 'user':
            await accountDetails(args[1]);
            break;
        // Handle login commands
        case 'login':
            if (args.length < 3) {
                console.error("Error 400. Bad request: Please provide username and password.");
                return;
            }
            await login(args[1], args[2]);
            break;
        // Resource not recognized, throw error
        default:
            console.error(`Error 400. Bad request: Unknown command ${resource}`);
            return;
    }
}

try {
    handleRequest(args);
} catch (err) {
    console.error("Error 500. Internal error")
}