// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createContext, h } from 'preact';
import { useContext, useEffect, useReducer } from 'preact/hooks';
import { requestFeatureScreenSchema } from '../../../schema/__generated__/schema.parsers.mjs';
import { FetchRequestFeatureOptions, SendFeatureRequest } from '../../../shared/js/browser/common.js';

export const FeatureRequestContext = createContext({
    value: /** @type {import('../../../schema/__generated__/schema.types').RequestFeatureScreen} */ ({}),
    /** @type {(features: string[]) => void} */
    submit: () => {
        throw new Error('todo implement send');
    },
});

/**
 * @param {object} params
 * @param {import("preact").ComponentChild} params.children
 * @param {{ fetch: (msg: import('../../../shared/js/browser/common.js').Msg) => Promise<any> | void}} params.model
 */
export function FeatureRequestProvider({ children, model }) {
    const initial = { status: 'pending' };
    const [state, dispatch] = useReducer((state, action) => action, initial);
    useEffect(() => {
        const msg = new FetchRequestFeatureOptions();
        model
            .fetch(msg)
            ?.then((data) => {
                const parsed = requestFeatureScreenSchema.safeParse(data);
                if (parsed.success) {
                    dispatch({ status: 'ready', value: data });
                } else {
                    console.group('FeatureRequestProvider');
                    console.error('the response for FeatureRequestProvider did not match the schema');
                    console.error('response:', data);
                    console.error('error:', parsed.error.toString());
                    console.groupEnd();
                    dispatch({ status: 'error', error: parsed.error.toString() });
                }
            })
            .catch((e) => {
                dispatch({ status: 'error', error: e.toString() });
            });
    }, [model]);

    /**
     * @param {string[]} features
     */
    function submit(features) {
        model.fetch(new SendFeatureRequest(features));
    }

    if (state.status === 'ready') {
        return (
            <FeatureRequestContext.Provider
                value={{
                    value: state.value,
                    submit,
                }}
            >
                {children}
            </FeatureRequestContext.Provider>
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

/**
 * @returns {import('../../../schema/__generated__/schema.types').FeatureRequestScreenDataItem[]}
 */
export function useRequestFeatureList() {
    return useContext(FeatureRequestContext).value.data;
}

/**
 * @returns {(features: string[]) => void}
 */
export function useSubmitRequestFeature() {
    return useContext(FeatureRequestContext).submit;
}
