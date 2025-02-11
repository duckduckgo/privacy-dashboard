import { createDataStates } from '../../shared/js/ui/views/tests/generate-data.mjs';
import { readFileSync } from 'node:fs';

const google = JSON.parse(readFileSync('./schema/__fixtures__/request-data-google.json', 'utf8'));
const cnn = JSON.parse(readFileSync('./schema/__fixtures__/request-data-cnn.json', 'utf8'));

export const testDataStates = createDataStates(google, cnn);
