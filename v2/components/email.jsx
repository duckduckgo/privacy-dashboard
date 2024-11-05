// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createContext, h } from 'preact';
import { useContext, useReducer } from 'preact/hooks';
import { useData, useFetcher } from '../data-provider';
import { i18n } from '../../shared/js/ui/base/localize';
import { RefreshEmailAliasMessage } from '../../shared/js/browser/common';
import { z } from 'zod';

/**
 * Given a username, returns a valid email address with the duck domain
 * @param {string} address
 * @returns {string}
 */
const formatAddress = (address) => address + '@duck.com';

const EmailContext = createContext({
    /** @type {EmailState} */
    state: {
        state: 'unknown',
        alias: null,
    },
    /** @type {() => void} */
    copyAlias: () => {
        throw new Error('todo: implement refresh');
    },
});

/**
 * @typedef {{state: 'unknown' | 'idle' | 'added', alias: string | null | undefined}} EmailState
 * @typedef {{type: 'update', alias: string | null} | {type: 'copy'} | {type: 'reset'}} EmailActions
 */

export function EmailProvider({ children }) {
    const data = useData();
    const fetcher = useFetcher();
    const hasAlias = typeof data.emailProtectionUserData?.nextAlias === 'string';
    /** @type {EmailState} */
    const initialState = {
        state: hasAlias ? 'idle' : 'unknown',
        alias: hasAlias ? data.emailProtectionUserData?.nextAlias : null,
    };
    const [state, dispatch] = useReducer((/** @type {EmailState} */ state, /** @type {EmailActions} */ action) => {
        switch (state.state) {
            case 'added': {
                switch (action.type) {
                    case 'update': {
                        return {
                            ...state,
                            alias: action.alias,
                        };
                    }
                    case 'reset': {
                        return {
                            ...state,
                            state: /** @type {const} */ ('idle'),
                        };
                    }
                    default:
                        return state;
                }
            }
            case 'idle':
            case 'unknown':
                switch (action.type) {
                    case 'copy': {
                        return {
                            ...state,
                            state: /** @type {const} */ ('added'),
                        };
                    }
                }
                break;
        }
        return state;
    }, initialState);
    function copyAlias() {
        dispatch({ type: 'copy' });
        if (!state.alias) {
            return console.warn('missing state.alias');
        }
        navigator.clipboard?.writeText(formatAddress(state.alias));
        const msg = new RefreshEmailAliasMessage();
        fetcher(msg)
            .then((resp) => {
                console.log('--', resp);
                const response = z.object({
                    privateAddress: z.string().optional(),
                });
                const parsed = response.safeParse(resp);
                if (!parsed.success) {
                    console.warn('response did not contain a valid private address', resp);
                    dispatch({
                        type: 'update',
                        alias: null,
                    });
                } else {
                    if (!parsed.data.privateAddress) {
                        return console.warn('missing `privateAddress`');
                    }
                    dispatch({
                        type: 'update',
                        alias: parsed.data.privateAddress,
                    });
                }
            })
            .catch((e) => console.error('error refreshing', e))
            .finally(() => {
                setTimeout(() => {
                    dispatch({ type: 'reset' });
                }, 2000);
            });
    }
    if (state.state === 'unknown') return null;
    return <EmailContext.Provider value={{ state, copyAlias }}>{children}</EmailContext.Provider>;
}

export function EmailBar() {
    const { state, copyAlias } = useContext(EmailContext);
    const text = state.state === 'idle' ? i18n.t('site:createNewDuckAddress.title') : i18n.t('site:createNewDuckAddressCopied.title');
    const icon = state.state === 'idle' ? <WandIcon /> : <CheckMarkIcon />;

    return (
        <div id="email-alias-container">
            <div className="js-email-alias email-alias token-body-em">
                <button
                    className="email-alias__button"
                    type="button"
                    data-state={state.state}
                    disabled={state.state === 'added'}
                    onClick={copyAlias}
                >
                    {icon}
                    <span className="email-alias__text">{text}</span>
                </button>
            </div>
        </div>
    );
}

function WandIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10.4998 0.75C10.4998 0.335786 10.164 0 9.74976 0C9.33554 0 8.99976 0.335786 8.99976 0.75V3.25C8.99976 3.66421 9.33554 4 9.74976 4C10.164 4 10.4998 3.66421 10.4998 3.25V0.75Z" />
            <path d="M10.4998 9.75C10.4998 9.33579 10.164 9 9.74976 9C9.33554 9 8.99976 9.33579 8.99976 9.75V12.25C8.99976 12.6642 9.33554 13 9.74976 13C10.164 13 10.4998 12.6642 10.4998 12.25V9.75Z" />
            <path d="M15.9998 6.25C15.9998 6.66421 15.664 7 15.2498 7H12.7498C12.3355 7 11.9998 6.66421 11.9998 6.25C11.9998 5.83579 12.3355 5.5 12.7498 5.5H15.2498C15.664 5.5 15.9998 5.83579 15.9998 6.25Z" />
            <path d="M6.24976 7C6.66397 7 6.99976 6.66421 6.99976 6.25C6.99976 5.83579 6.66397 5.5 6.24976 5.5H3.74976C3.33554 5.5 2.99976 5.83579 2.99976 6.25C2.99976 6.66421 3.33554 7 3.74976 7H6.24976Z" />
            <path d="M14.2801 10.7803C13.9872 11.0732 13.5123 11.0732 13.2194 10.7803L11.4694 9.03033C11.1765 8.73744 11.1765 8.26256 11.4694 7.96967C11.7623 7.67678 12.2372 7.67678 12.5301 7.96967L14.2801 9.71967C14.573 10.0126 14.573 10.4874 14.2801 10.7803Z" />
            <path d="M6.71942 4.28033C7.01231 4.57322 7.48719 4.57322 7.78008 4.28033C8.07297 3.98744 8.07297 3.51256 7.78008 3.21967L6.03008 1.46967C5.73719 1.17678 5.26231 1.17678 4.96942 1.46967C4.67653 1.76256 4.67653 2.23744 4.96942 2.53033L6.71942 4.28033Z" />
            <path d="M11.4694 4.53032C11.1765 4.23743 11.1765 3.76256 11.4694 3.46966L13.2194 1.71966C13.5123 1.42677 13.9872 1.42677 14.2801 1.71966C14.573 2.01256 14.573 2.48743 14.2801 2.78032L12.5301 4.53032C12.2372 4.82322 11.7623 4.82322 11.4694 4.53032Z" />
            <path d="M2.28296 12.658L9.24784 5.69307C9.54074 5.40018 10.0156 5.40018 10.3085 5.69307V5.69307C10.6014 5.98597 10.6014 6.46084 10.3085 6.75373L3.34362 13.7186L2.28296 12.658Z" />
            <path d="M0.243221 15.7588C-0.0496725 15.466 -0.0496726 14.9911 0.243221 14.6982L1.75195 13.1895L2.81261 14.2501L1.30388 15.7588C1.01099 16.0517 0.536114 16.0517 0.243221 15.7588V15.7588Z" />
        </svg>
    );
}

function CheckMarkIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M11.809 6.2501C12.0851 5.94141 12.0588 5.46727 11.7501 5.19108C11.4414 4.91488 10.9673 4.94122 10.6911 5.24991L7.0255 9.34675L5.33049 7.27508C5.06819 6.9545 4.59568 6.90724 4.27509 7.16954C3.95451 7.43183 3.90726 7.90435 4.16955 8.22494L6.41955 10.9749C6.55833 11.1446 6.76436 11.245 6.98346 11.2498C7.20256 11.2547 7.41282 11.1634 7.55895 11.0001L11.809 6.2501Z" />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8Z"
            />
        </svg>
    );
}
