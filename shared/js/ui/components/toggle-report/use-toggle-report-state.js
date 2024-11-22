import { useContext, useReducer } from 'preact/hooks';
import { ToggleReportContext } from './toggle-report-provider';

export function useToggleReportState() {
    const { send, reject, didShowWhatIsSent } = useContext(ToggleReportContext);
    return useReducer(
        (state, /** @type {'toggle' | 'toggle-ios' | 'animation-complete' | 'send' | 'reject'} */ action) => {
            switch (action) {
                case 'toggle-ios': {
                    didShowWhatIsSent();
                    return {
                        ...state,
                        value: /** @type {const} */ ('animating'),
                    };
                }
                case 'animation-complete': {
                    return {
                        ...state,
                        value: /** @type {const} */ ('showing'),
                    };
                }
                case 'toggle': {
                    const next = state.value === 'hiding' ? /** @type {const} */ ('showing') : /** @type {const} */ ('hiding');
                    if (next === 'showing') {
                        didShowWhatIsSent();
                    }
                    return {
                        ...state,
                        value: next,
                    };
                }
                case 'send': {
                    send();
                    return {
                        ...state,
                        value: /** @type {const} */ ('sent'),
                    };
                }
                case 'reject': {
                    reject();
                    return state;
                }
            }
            return state;
        },
        { value: /** @type {'hiding' | 'showing' | 'sent' | 'rejected' | 'animating'} */ ('hiding') }
    );
}
