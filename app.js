import 'dotenv/config';
import Server from './src/server.js';

const server = new Server(process.env.PORT_APP);
server.listen();
