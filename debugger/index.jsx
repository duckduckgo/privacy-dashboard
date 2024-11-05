// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, render } from 'preact';
import { Debugger, PlatformToggles, Selector } from './debugger';

import google from '../schema/__fixtures__/request-data-google.json';
import cnn from '../schema/__fixtures__/request-data-cnn.json';
import { createDataStates } from '../shared/js/ui/views/tests/generate-data.mjs';
import { Settings } from './settings';

const states = createDataStates(/** @type {any} */ (google), /** @type {any} */ (cnn));

let searchParams = new URL(window.location.href).searchParams;
const settings = new Settings()
    .withState(searchParams.get('state'))
    .withScreen(searchParams.get('screen'))
    .withPlatforms(searchParams.get('platforms'))
    .withRequests(searchParams.getAll('requests'));

function updateStateParam(value) {
    let reflectList = ['screen', 'requests'];
    const url = new URL(window.location.href);

    // remove existing reflected params
    for (let key of reflectList) {
        url.searchParams.delete(key);
    }

    // set the new state (as chosen in the dropdown)
    url.searchParams.set('state', value);
    const selected = states[value];

    // reflect explicit url params
    for (let [key, value] of Object.entries(selected.urlParams)) {
        url.searchParams.set(key, String(value));
    }

    // reload the page with all new URL
    window.location.href = url.href;
}

function updatePlatformsParam(value) {
    const url = new URL(window.location.href);
    url.searchParams.set('platforms', value.join(','));
    window.location.href = url.href;
}

function updateScreenParam(value) {
    const url = new URL(window.location.href);
    url.searchParams.set('screen', value);
    window.location.href = url.href;
}

/**
 * @param {string[]} values
 */
function updateRequestsParam(values) {
    const url = new URL(window.location.href);
    url.searchParams.delete('requests');
    for (let value of values) {
        url.searchParams.append('requests', value);
    }
    window.location.href = url.href;
}

render(
    <Debugger
        selectedRequests={settings.requests}
        platforms={settings.platforms}
        initialState={settings.state}
        reflectParams={settings.reflectParams}
        states={states}
        items={settings.items}
        updateRequests={updateRequestsParam}
        toggles={
            <div>
                <div>
                    <Selector label={'States'} options={states} selected={settings.state} onChange={updateStateParam} />
                </div>
                <div>
                    <Selector label={'Screen'} options={settings.screens} selected={settings.screen} onChange={updateScreenParam} />
                </div>
                <PlatformToggles selected={settings.platforms} onChange={updatePlatformsParam} items={settings.items} />
            </div>
        }
    />,
    /** @type {HTMLDivElement} */ (document.querySelector('#app'))
);
