// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createContext, h } from 'preact'
import { useEffect, useReducer } from 'preact/hooks'
import {
    CloseMessage,
    FetchToggleReportOptions,
    RejectToggleBreakageReport,
    SeeWhatIsSent,
    SendToggleBreakageReport,
} from '../../../browser/common'
import { toggleReportScreenSchema } from '../../../../../schema/__generated__/schema.parsers.mjs'
import { useConnectionCount } from '../../../../../v2/data-provider'

export const ToggleReportContext = createContext({
    value: /** @type {import('../../../../../schema/__generated__/schema.types').ToggleReportScreen} */ ({}),
    /** @type {() => void} */
    send: () => {
        throw new Error('todo implement send')
    },
    /** @type {() => void} */
    reject: () => {
        throw new Error('todo implement reject')
    },
    /** @type {() => void} */
    didShowWhatIsSent: () => {
        throw new Error('todo implement didShowWhatIsSent')
    },
    /** @type {() => void} */
    didClickSuccessScreen: () => {
        throw new Error('todo implement didClickSuccessScreen')
    },
})

/**
 * @param {object} params
 * @param {import("preact").ComponentChild} params.children
 * @param {{ fetch: (msg: import("../../../browser/common.js").Msg) => Promise<any> | void}} params.model
 * @param {import('../../platform-features.mjs').InitialScreen} params.screen
 */
export function ToggleReportProvider({ children, model, screen }) {
    const initial = { status: 'pending' }
    const [state, dispatch] = useReducer((state, action) => action, initial)
    useEffect(() => {
        const msg = new FetchToggleReportOptions()
        model
            .fetch(msg)
            ?.then((data) => {
                const parsed = toggleReportScreenSchema.safeParse(data)
                if (parsed.success) {
                    dispatch({ status: 'ready', value: data })
                } else {
                    console.group('ToggleReportProvider')
                    console.error('the response for FetchToggleReportOptions did not match the schema')
                    console.error('response:', data)
                    console.error('error:', parsed.error.toString())
                    console.groupEnd()
                    dispatch({ status: 'error', error: parsed.error.toString() })
                }
            })
            .catch((e) => {
                dispatch({ status: 'error', error: e.toString() })
            })
    }, [model])

    function send() {
        useConnectionCount.pause()
        model.fetch(new SendToggleBreakageReport())
    }
    function reject() {
        model.fetch(new RejectToggleBreakageReport())
    }
    function didShowWhatIsSent() {
        model.fetch(new SeeWhatIsSent())
    }
    function didClickSuccessScreen() {
        model.fetch(new CloseMessage({ eventOrigin: { screen } }))
    }
    if (state.status === 'ready') {
        return (
            <ToggleReportContext.Provider
                value={{
                    value: state.value,
                    send,
                    reject,
                    didShowWhatIsSent,
                    didClickSuccessScreen,
                }}
            >
                {children}
            </ToggleReportContext.Provider>
        )
    }
    if (state.status === 'error')
        return (
            <div>
                <p>Something went wrong</p>
                <pre>
                    <code>{state.error}</code>
                </pre>
            </div>
        )
    return null
}
