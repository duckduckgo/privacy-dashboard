// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createContext, h } from 'preact';
import { useEffect, useReducer } from 'preact/hooks';
import { FetchBreakageFormOptions } from '../../shared/js/browser/common';
import { toggleReportScreenSchema } from '../../schema/__generated__/schema.parsers.mjs';

export const BreakageFormContext = createContext({
    value: /** @type {import('../../schema/__generated__/schema.types').ToggleReportScreen} */ ({}),
});

/**
 * @param {object} params
 * @param {import("preact").ComponentChild} params.children
 * @param {(msg: import("../../shared/js/browser/common.js").Msg) => Promise<any> | void} params.fetcher
 * @param {import('../../shared/js/ui/platform-features.mjs').InitialScreen} params.screen
 */
export function BreakageFormProvider({ children, fetcher, screen }) {
    const initial = { status: 'pending' };
    const [state, dispatch] = useReducer((state, action) => action, initial);
    useEffect(() => {
        const msg = new FetchBreakageFormOptions();
        fetcher(msg)
            ?.then((data) => {
                const parsed = toggleReportScreenSchema.safeParse(data);
                if (parsed.success) {
                    dispatch({ status: 'ready', value: data });
                } else {
                    console.group('BreakageFormProvider');
                    console.error('the response for FetchBreakageFormOptions did not match the schema');
                    console.error('response:', data);
                    console.error('error:', parsed.error.toString());
                    console.groupEnd();
                    dispatch({ status: 'error', error: parsed.error.toString() });
                }
            })
            .catch((e) => {
                dispatch({ status: 'error', error: e.toString() });
            });
    }, [fetcher]);

    if (state.status === 'ready') {
        return (
            <BreakageFormContext.Provider
                value={{
                    value: state.value,
                }}
            >
                {children}
            </BreakageFormContext.Provider>
        );
    }
    if (state.status === 'error')
        return (
            <div>
                <p>Something went wrong</p>
                <pre>
                    <code>{state.error}</code>
                </pre>
            </div>
        );
    return null;
}
