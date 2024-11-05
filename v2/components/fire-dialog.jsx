// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { fireSummaryTemplate } from '../../shared/js/ui/views/fire-dialog';
import { i18n } from '../../shared/js/ui/base/localize';
import { DomNode } from '../dom-node';
import { useEffect, useState } from 'preact/hooks';
import { BurnMessage, FetchBurnOptions, SetBurnDefaultOption } from '../../shared/js/browser/common';
import { useFetcher } from '../data-provider';

/**
 * @typedef {import('../../schema/__generated__/schema.types.js').FireOption} FireOption
 */

export function FireProvider({ onCancel }) {
    const [fireOptions, setFireOptions] = useState(/** @type {null | FireOption[]} */ (null));
    const fetcher = useFetcher();
    useEffect(() => {
        const msg = new FetchBurnOptions();
        fetcher(msg)
            .then((resp) => {
                setFireOptions(resp.options);
            })
            .catch(console.error);
    }, [fetcher]);

    /**
     * @param {number} index
     */
    function onUpdate(index) {
        if (!fireOptions) return;
        const selectedOption = index;
        const opts = fireOptions[selectedOption];
        fetcher(new SetBurnDefaultOption(opts.name)).catch(console.error);
    }

    /**
     * @param {number} index
     */
    function onBurn(index) {
        if (!fireOptions) return;
        const selectedOption = index;
        const opts = fireOptions[selectedOption].options;
        fetcher(new BurnMessage(/** @type {any} */ (opts))).then(() => {
            onCancel();
        });
    }
    if (fireOptions === null) return null;

    return <FireDialog fireOptions={fireOptions} onUpdate={onUpdate} onCancel={onCancel} onBurn={onBurn} />;
}

/**
 * @param {object} props
 * @param {import('../../schema/__generated__/schema.types.js').FireOption[]} props.fireOptions
 * @param {(index: number) => void} props.onUpdate
 * @param {() => void} props.onCancel
 * @param {(index: number) => void} props.onBurn
 */
export function FireDialog({ fireOptions, onUpdate, onCancel, onBurn }) {
    if (!fireOptions) {
        return <dialog id="fire-button-container"></dialog>;
    }
    let selectedOptionIndex = fireOptions.findIndex(({ selected }) => selected);
    if (selectedOptionIndex < 0) {
        selectedOptionIndex = 0;
    }
    const [value, setValue] = useState(selectedOptionIndex);
    const selectedOption = fireOptions[value];
    const selectOptions = fireOptions.map(({ name }, index) => <option value={index}>{i18n.t(`firebutton:option${name}.title`)}</option>);
    const summary = fireSummaryTemplate(selectedOption);
    function onChange(e) {
        setValue(Number(e.target.value));
        onUpdate(Number(e.target.value));
    }
    return (
        <dialog id="fire-button-container" open>
            <div id="fire-button-content">
                <span id="fire-button-header">
                    <img src="../img/fire-button-header.svg" />
                    <h3>
                        {selectedOption.descriptionStats.openTabs > 0
                            ? i18n.t('firebutton:fireDialogHeader.title')
                            : i18n.t('firebutton:fireDialogHeaderNoTabs.title')}
                    </h3>
                </span>
                <select id="fire-button-opts" onChange={onChange} value={value}>
                    {selectOptions}
                </select>
                {/* @ts-ignore */}
                <DomNode>{summary}</DomNode>
                <div id="fire-button-row">
                    <button id="fire-button-cancel" onClick={onCancel}>
                        {i18n.t('firebutton:cancel.title')}
                    </button>
                    <button id="fire-button-burn" onClick={() => onBurn(value)}>
                        {i18n.t('firebutton:clearData.title')}
                    </button>
                </div>
            </div>
        </dialog>
    );
}
