// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import styles from './debugger.module.css';
import { requests } from '../shared/js/ui/views/tests/generate-data.mjs';

export function Debugger({ states, initialState, selectedRequests, updateRequests, platforms, items, reflectParams, toggles }) {
    return (
        <div class={styles.grid}>
            <div class={styles.header}>
                <div class={styles.toggles}>{toggles}</div>
                {initialState?.includes('with-overrides') && (
                    <div class={styles.requests}>
                        <Requests selected={selectedRequests} onChange={updateRequests} />
                    </div>
                )}
            </div>
            <div class={styles.content}>
                <Frames platforms={platforms} initialState={initialState} reflectParams={reflectParams} items={items} states={states} />
            </div>
        </div>
    );
}

/**
 * The Selector component renders a select element with options based on the provided options object.
 * It allows the user to select an option and triggers the onChange callback when the selected option changes.
 *
 * @template {any} T
 * @param {Object} props - The component props.
 * @param {Record<string, T>} props.options - The options object.
 * @param {string|null|undefined} props.selected - The currently selected option.
 * @param {import("preact").ComponentChild} props.label - The currently selected option.
 * @param {function} props.onChange - The callback function triggered when the selected option changes.
 */
export function Selector({ options, selected, label, onChange }) {
    return (
        <label>
            {label}
            <select onChange={(/** @type {any} */ e) => onChange(e.target.value)}>
                {Object.entries(options).map(([key]) => {
                    return (
                        <option value={key} selected={selected === key}>
                            {key}
                        </option>
                    );
                })}
            </select>
        </label>
    );
}

export function PlatformToggles({ selected, onChange, items }) {
    function onChanged(e) {
        const d = new FormData(e.target.form);
        onChange(d.getAll('platform'));
    }
    return (
        <form onChange={onChanged}>
            {items.map((item) => {
                return (
                    <label class={styles.label}>
                        <input type="checkbox" name="platform" value={item.platform} checked={selected.includes(item.platform)}></input>{' '}
                        {item.platform}
                    </label>
                );
            })}
        </form>
    );
}

function Requests({ selected, onChange }) {
    function onChanged(e) {
        const d = new FormData(e.target.form);
        onChange(d.getAll('request'));
    }
    return (
        <div>
            <p>Request types:</p>
            <form onChange={onChanged}>
                {Object.entries(requests).map(([key]) => {
                    return (
                        <label class={styles.label}>
                            <input type="checkbox" name="request" value={key} checked={selected.includes(key)}></input>
                            {key}
                        </label>
                    );
                })}
            </form>
        </div>
    );
}

function Frames({ platforms, initialState, states, items, reflectParams }) {
    const previewJSON = states[initialState];
    const { certificate, ...rest } = previewJSON;
    rest.certificate = certificate;
    return (
        <div class={styles.frames}>
            <div class={styles.code} data-state="ready">
                <pre>
                    <code>{JSON.stringify(rest, null, 2)}</code>
                </pre>
            </div>
            {items.map((item) => {
                const { platform } = item;
                const src = new URL(item.platform + '.html?' + reflectParams.toString(), location.href);
                const height = item.height ?? 600;
                return (
                    <div class={styles.frame} data-state={platforms.includes(platform) ? 'ready' : 'hidden'}>
                        <p>
                            <a href={src.href} target="_blank">
                                Open in new tab
                            </a>
                        </p>
                        <p>
                            <code>{item.platform}</code> <small>{initialState}</small>
                        </p>
                        <iframe
                            src={src.href}
                            frameBorder="0"
                            style={{
                                width: '360px',
                                height: height + 'px',
                            }}
                        ></iframe>
                    </div>
                );
            })}
        </div>
    );
}
