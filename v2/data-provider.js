// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, createContext } from 'preact'
import comms from '../shared/js/browser/communication.js'
import { useContext, useEffect, useState } from 'preact/hooks'

class DataChannel extends EventTarget {
    timeout = /** @type {any} */ (null)
    tab = {}
    emailProtectionUserData = {}
    count = 0

    send() {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            comms
                .getBackgroundTabData()
                .then(({ tab, emailProtectionUserData }) => {
                    this.tab = tab
                    this.emailProtectionUserData = emailProtectionUserData
                    this.broadcast()
                })
                .catch((e) => {
                    console.log('❌ [models/site.es6.js:handleBackgroundMsg()] --> ', e)
                })
        }, 100)
    }

    broadcast() {
        this.count += 1
        this.dispatchEvent(new CustomEvent('data', { detail: this.lastValue() }))
    }

    lastValue() {
        return {
            tab: this.tab,
            emailProtectionUserData: this.emailProtectionUserData,
            count: this.count,
        }
    }
}

const dc = new DataChannel()
comms.backgroundMessage(dc)

const ChannelContext = createContext({
    /** @type {DataChannel} */
    channel: /** @type {any} */ (null),
})

/**
 * Provides data to the children components.
 *
 * @param {Object} props - The properties of the DataProvider component.
 * @param {import("preact").ComponentChild} props.children - The children components to be rendered.
 */
export function DataProvider({ children }) {
    const d = useData()
    if (d.count === 0) return null
    return <ChannelContext.Provider value={{ channel: dc }}>{children}</ChannelContext.Provider>
}

export function useChannel() {
    return useContext(ChannelContext).channel
}

export function useData() {
    const [state, setState] = useState(() => dc.lastValue())
    useEffect(() => {
        const handler = (evt) => {
            setState(evt.detail)
        }
        dc.addEventListener('data', handler)
        return () => {
            dc.removeEventListener('data', handler)
        }
    }, [])
    return state
}
