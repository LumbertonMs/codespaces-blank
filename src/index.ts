import { Gateway } from './gateway/Gateway';
import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));

const gateway = new Gateway(config);
gateway.start();