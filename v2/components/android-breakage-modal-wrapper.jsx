// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, Fragment } from 'preact';
import { useEffect, useMemo, useRef } from 'preact/hooks';
import { ns } from '../../shared/js/ui/base/localize';
import { useFeatures } from '../data-provider';
import { createBreakageFeaturesFrom } from '../breakage-categories';
import { CustomElementLoader } from './custom-element-loader';

/**
 * This cant be exports from the module that contains it, since it's a separate entry point.
 */
const DDG_DIALOG_NAME = 'ddg-android-breakage-dialog';
const DDG_DIALOG_PATH = '../public/js/android-breakage-dialog.js';

/**
 * When the Form element uses a dialog to set the value of the select
 * EG: on android
 */
export function FormSelectElementWithDialog() {
    const platformFeatures = useFeatures();

    // shuffle once and remember
    const randomised = useMemo(() => {
        const f = createBreakageFeaturesFrom(platformFeatures);
        return f.categoryList();
    }, [platformFeatures]);

    /**
     * @type {import('preact').RefObject<HTMLSelectElement>}
     */
    const selectRef = useRef(null);

    function onClick(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        /** @type {import("../custom-elements/android-breakage-dialog").AndroidBreakageDialog | null} */
        const elem = document.querySelector(DDG_DIALOG_NAME);
        if (!elem) return console.warn('could not find custom element', 'ddg-android-breakage-dialog');
        if (!selectRef.current) return console.warn('could not find select ref');
        elem.show(selectRef.current.value);
    }

    return (
        <>
            <CustomElementLoader src={DDG_DIALOG_PATH} element={DDG_DIALOG_NAME}>
                <AndroidBreakageDialogWrapper
                    items={randomised}
                    onSelect={(value) => {
                        if (!selectRef.current) return;
                        selectRef.current.value = value;
                    }}
                />
            </CustomElementLoader>
            <div className="form__select breakage-form__input--dropdown" onClick={onClick} data-testid="select-click-capture">
                <select name="category" ref={selectRef}>
                    <option value="" selected disabled>
                        {ns.report('pickYourIssueFromTheList.title')}
                    </option>
                    {randomised.map(([key, value]) => {
                        return <option value={key}>{value}</option>;
                    })}
                </select>
            </div>
        </>
    );
}

/**
 * @params {Parameters<AndroidModalWrapper>} props
 */
export function AndroidBreakageDialogWrapper({ items, onSelect }) {
    /** @type {import("preact").RefObject<import("../custom-elements/android-breakage-dialog.js").AndroidBreakageDialog | null>} */
    const ref = useRef(null);

    useEffect(() => {
        const controller = new AbortController();
        ref.current?.addEventListener(
            'did-select',
            (/** @type {any} */ e) => {
                const selection = /** @type {{value: string}} */ e.detail;
                const matched = items.find(([name]) => name === selection.value);
                if (!matched) throw new Error('value did not match a variant');
                const [value] = matched;
                onSelect(value);
            },
            { signal: controller.signal }
        );
        return () => {
            return controller.abort();
        };
    }, []);

    return (
        <ddg-android-breakage-dialog
            items={items}
            ref={ref}
            title={ns.report('pickYourIssueFromTheList.title')}
            cancelText={ns.site('navigationCancel.title')}
            okText={ns.site('okDialogAction.title')}
        ></ddg-android-breakage-dialog>
    );
}
