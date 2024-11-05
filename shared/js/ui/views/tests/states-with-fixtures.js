import google from '../../../../../schema/__fixtures__/request-data-google.json';
import cnn from '../../../../../schema/__fixtures__/request-data-cnn.json';
import { createDataStates } from './generate-data.mjs';

// @ts-expect-error
export const testDataStates = createDataStates(google, cnn);
