// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, createContext } from 'preact';
import comms, { platform } from '../shared/js/browser/communication.js';
import { useCallback, useContext, useEffect, useState } from 'preact/hooks';
import { i18n } from '../shared/js/ui/base/localize';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createPlatformFeatures, FeatureSettings, PlatformFeatures } from '../shared/js/ui/platform-features.mjs';
import {
    CloseMessage,
    SetListsMessage,
    ShowAlertForMissingDescription,
    ShowNativeFeedback,
    SubmitBrokenSiteReportMessage,
    TelemetrySpanMsg,
} from '../shared/js/browser/common';
import { useNav } from './navigation';

/**
 * @typedef {Object} DataChannelPublicData
 * @property {boolean} protectionsEnabled
 * @property {'secure' | 'upgraded' | 'none' | 'invalid' | 'phishing'} httpsState
 * @property {boolean} isBroken
 * @property {boolean} isAllowlisted
 * @property {boolean} isDenylisted
 * @property {boolean} displayBrokenUI
 * @property {boolean} isaMajorTrackingNetwork
 * @property {boolean} disabled
 * @property {PlatformFeatures} features
 * @property {FeatureSettings} featureSettings
 * @property {any[] | null | undefined} permissions
 * @property {import('../shared/js/browser/utils/request-details.mjs').TabData} tab
 * @property {number} count
 * @property {number} connection
 * @property {import('../schema/__generated__/schema.types').EmailProtectionUserData|null} emailProtectionUserData
 * @property {{ enabled: boolean }} [fireButton]
 */

export class DataChannel extends EventTarget {
    protectionsEnabled = false;
    /** @type {'secure' | 'upgraded' | 'none' | 'invalid' | 'phishing'} */
    httpsState = 'none';
    isBroken = false;
    isAllowlisted = false;
    isDenylisted = false;
    displayBrokenUI = false;
    isaMajorTrackingNetwork = false;
    // always disabled by default
    disabled = true;
    features = createPlatformFeatures(platform);
    /** @type {FeatureSettings | null} */
    featureSettings = null;
    /** @type {any[] | null | undefined} */
    permissions = null;
    /** @type {import('../shared/js/browser/utils/request-details.mjs').TabData | null} */
    tab = null;
    /** @type {import('../schema/__generated__/schema.types').EmailProtectionUserData | null} */
    emailProtectionUserData = null;
    count = 0;
    connection = 1;

    _timeout = /** @type {any} */ (null);

    /**
     * Sets a timeout to send a message
     *
     * @param {string} _messageName - The name of the message to send
     */
    send(_messageName) {
        clearTimeout(this._timeout);
        this._timeout = window.setTimeout(() => {
            comms
                .getBackgroundTabData()
                .then((resp) => {
                    this.accept(resp);
                })
                .catch((e) => {
                    console.log('❌ [models/site.es6.js:handleBackgroundMsg()] --> ', e);
                });
        }, 100);
    }

    /**
     * Allow producers to indicate when their connection was re-established
     */
    didReconnect() {
        this.connection += 1;
        this.broadcast();
    }

    /**
     * @param {import('../shared/js/browser/common.js').BackgroundTabData} data
     */
    accept({ tab, emailProtectionUserData, fireButton, featureSettings }) {
        if (tab) {
            if (tab.locale) {
                // @ts-ignore
                if (Object.keys(i18n.options.resources).includes(tab.locale)) {
                    i18n.changeLanguage(tab.locale);
                } else {
                    console.warn(`Unsupported locale ${tab.locale}`);
                }
            }

            this.tab = tab;
            this.domain = tab.domain;
            const MAJOR_TRACKER_THRESHOLD_PCT = 15;
            this.isaMajorTrackingNetwork = (tab.parentEntity?.prevalence || 0) >= MAJOR_TRACKER_THRESHOLD_PCT;
        } else {
            this.domain = 'new tab';
            console.debug('Site model: no tab');
        }

        if (emailProtectionUserData) {
            this.emailProtectionUserData = emailProtectionUserData;
        }
        this.fireButton = fireButton;
        this.featureSettings = FeatureSettings.create(featureSettings, platform);

        this.setSiteProperties();
        this.setHttpsMessage();

        if (this.tab) {
            this.permissions = this.tab.permissions;
        }

        this.broadcast();
    }

    initial() {
        comms
            .getBackgroundTabData()
            .then((resp) => {
                this.accept(resp);
            })
            .catch((e) => {
                console.log('❌ [DataChannel .initial()] --> ', e);
            });
    }

    setSiteProperties() {
        if (!this.tab) {
            this.domain = 'new tab'; // tab can be null for firefox new tabs
        } else {
            this.initAllowlisted(this.tab.protections.allowlisted, this.tab.protections.denylisted);
            if (this.tab.specialDomainName) {
                this.domain = this.tab.specialDomainName; // eg "extensions", "options", "new tab"
            } else {
                this.disabled = false;
            }
        }

        if (this.domain && this.domain === '-') {
            this.disabled = true;
        }
    }

    initAllowlisted(allowListValue, denyListValue) {
        this.isAllowlisted = allowListValue;
        this.isDenylisted = denyListValue;

        this.isBroken = Boolean(
            this.tab?.protections.unprotectedTemporary || !this.tab?.protections.enabledFeatures?.includes('contentBlocking')
        );
        this.displayBrokenUI = this.isBroken;

        if (denyListValue) {
            this.displayBrokenUI = false;
            this.protectionsEnabled = true;
        } else {
            this.displayBrokenUI = this.isBroken;
            this.protectionsEnabled = !(this.isAllowlisted || this.isBroken);
        }
    }

    setHttpsMessage() {
        if (!this.tab) return;

        /** @type {import('../shared/js/ui/models/site.js').PublicSiteModel['httpsState']} */
        const nextState = (() => {
            if (this.features.supportsPhishingWarning) {
                if (this.tab.phishingStatus) {
                    return 'phishing';
                }
            }

            if (this.tab.isInvalidCert === true) {
                return 'invalid';
            }

            if (this.tab.upgradedHttps) {
                return 'upgraded';
            }

            if (/^https/.exec(this.tab.url)) {
                if (this.features.supportsInvalidCertsImplicitly) {
                    if (!this.tab.certificate || this.tab.certificate.length === 0) {
                        return 'invalid';
                    }
                }
                return 'secure';
            }

            return 'none';
        })();

        this.httpsState = nextState;
    }

    broadcast() {
        this.count += 1;
        this.dispatchEvent(new CustomEvent('data', { detail: this.lastValue() }));
    }

    /**
     * @return {DataChannelPublicData}
     */
    lastValue() {
        if (!this.tab) throw new Error('unreachable, missing this.tab');
        if (!this.featureSettings) throw new Error('unreachable, missing this.featureSettings');
        return {
            fireButton: this.fireButton,
            protectionsEnabled: this.protectionsEnabled,
            httpsState: this.httpsState,
            isBroken: this.isBroken,
            isAllowlisted: this.isAllowlisted,
            isDenylisted: this.isDenylisted,
            displayBrokenUI: this.displayBrokenUI,
            isaMajorTrackingNetwork: this.isaMajorTrackingNetwork,
            disabled: this.disabled,
            features: this.features,
            featureSettings: this.featureSettings,
            permissions: this.permissions,
            tab: this.tab,
            count: this.count,
            emailProtectionUserData: this.emailProtectionUserData,
            connection: this.connection,
        };
    }
}

export class ToggleAllowList {
    /**
     * @param {DataChannelPublicData} data
     * @param {import('../schema/__generated__/schema.types.js').EventOrigin} eventOrigin
     * @return {import('../shared/js/browser/common.js').Msg}
     */
    intoMessage(data, eventOrigin) {
        /** @type {SetListsMessage["lists"]} */
        const lists = [];
        if (data.tab && data.tab.domain) {
            if (data.isBroken) {
                lists.push({
                    list: 'denylisted',
                    domain: data.tab.domain,
                    value: !data.isDenylisted,
                });
            } else {
                // Explicitly remove all denylisting if the site is isn't broken. This covers the case when the site has been removed from the list.
                lists.push({
                    list: 'denylisted',
                    domain: data.tab.domain,
                    value: false,
                });
                lists.push({
                    list: 'allowlisted',
                    domain: data.tab.domain,
                    value: !data.isAllowlisted,
                });
            }
        }
        return new SetListsMessage({ lists, eventOrigin });
    }
}

const dc = new DataChannel();
comms.backgroundMessage(dc);

const ChannelContext = createContext({
    /** @type {DataChannel} */
    channel: /** @type {any} */ (null),
});

/**
 * Provides data to the children components.
 *
 * @param {Object} props - The properties of the DataProvider component.
 * @param {import("preact").ComponentChild} props.children - The children components to be rendered.
 */
export function DataProvider({ children }) {
    const d = useInternalData();
    if (!d || d.count === 0) return null;
    return <ChannelContext.Provider value={{ channel: dc }}>{children}</ChannelContext.Provider>;
}

export function useChannel() {
    return useContext(ChannelContext).channel;
}

/**
 * @return {null | DataChannelPublicData}
 */
function useInternalData() {
    const [state, setState] = useState(null);
    useEffect(() => {
        dc.initial();
        const handler = (evt) => {
            setState(evt.detail);
        };
        dc.addEventListener('data', handler);
        return () => {
            dc.removeEventListener('data', handler);
        };
    }, []);
    return state;
}

/**
 * @return {{ count: number }}
 */
export function useConnectionCount() {
    const [count, setCount] = useState(() => dc.lastValue().connection);

    useEffect(() => {
        const controller = new AbortController();
        dc.addEventListener(
            'data',
            (/** @type {any} */ evt) => {
                setCount(evt.detail.connection);
            },
            { signal: controller.signal }
        );

        window.addEventListener(
            useConnectionCount.PAUSE_EVENT,
            () => {
                controller.abort();
            },
            { signal: controller.signal }
        );

        return () => {
            controller.abort();
        };
    }, []);

    return { count };
}

/**
 * @type {string}
 */
useConnectionCount.PAUSE_EVENT = 'ignore-reconnections';

/**
 * Allow consumers to trigger the event without knowing any details
 */
useConnectionCount.pause = () => {
    window.dispatchEvent(new Event(useConnectionCount.PAUSE_EVENT));
};

/**
 * Public data is always ready to read.
 * @return {DataChannelPublicData}
 */
export function useData() {
    const [state, setState] = useState(() => dc.lastValue());
    useEffect(() => {
        const handler = (evt) => {
            setState(evt.detail);
        };
        dc.addEventListener('data', handler);
        return () => {
            dc.removeEventListener('data', handler);
        };
    }, []);
    return state;
}

/**
 * Static access to `features` since it doesn't change
 * @return {DataChannelPublicData['features']}
 */
export function useFeatures() {
    return dc.lastValue().features;
}

/**
 * Static access to `featureSettings` since it doesn't change
 * @return {DataChannelPublicData['featureSettings']}
 */
export function useFeatureSettings() {
    return dc.lastValue().featureSettings;
}

/**
 * decide which state the primary screen is in
 * @return {'ready' | 'error' | 'cta'}
 */
export function usePrimaryStatus() {
    const { disabled, tab } = dc.lastValue();
    if (tab?.error) return 'error';
    if (tab?.ctaScreens && disabled) return 'cta';
    return 'ready';
}

export function useFetcher() {
    /** @type {(msg: import("../shared/js/browser/common.js").Msg) => Promise<any>} */
    return useCallback(async (msg) => {
        try {
            if (!window.__ddg_integration_test) {
                console.log('📤 [outgoing useFetcher]', msg);
            }
            return comms.fetch(msg);
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }, []);
}

export function useClose() {
    const fetcher = useFetcher();
    const nav = useNav();
    return useCallback(() => {
        const msg = new CloseMessage({ eventOrigin: { screen: nav.screen() } });
        fetcher(msg).catch(console.error);
    }, [nav]);
}

export function useToggle() {
    const fetcher = useFetcher();
    const data = useData();
    const nav = useNav();
    return useCallback(() => {
        const msg = new ToggleAllowList().intoMessage(data, { screen: nav.screen() });
        fetcher(msg).catch(console.error);
    }, [data, nav]);
}

export function useSendReport() {
    const fetcher = useFetcher();
    const nav = useNav();
    return useCallback(
        ({ category, description }) => {
            const msg = new SubmitBrokenSiteReportMessage({
                category: category || '',
                description: description || '',
                eventOrigin: { screen: nav.screen() },
            });
            fetcher(msg).catch(console.error);
        },
        [nav]
    );
}

export function useShowAlert() {
    const fetcher = useFetcher();
    const nav = useNav();
    return useCallback(() => {
        const msg = new ShowAlertForMissingDescription();
        fetcher(msg).catch(console.error);
    }, [nav]);
}

export function useShowNativeFeedback() {
    const fetcher = useFetcher();
    const nav = useNav();
    return useCallback(() => {
        const msg = new ShowNativeFeedback();
        fetcher(msg).catch(console.error);
    }, [nav]);
}

export function useTelemetry() {
    const fetcher = useFetcher();
    const nav = useNav();
    return function (/** @type {import('../schema/__generated__/schema.types').TelemetrySpan['attributes']} */ attrs) {
        const msg = new TelemetrySpanMsg({
            eventOrigin: { screen: nav.screen() },
            attributes: attrs,
        });
        fetcher(msg).catch(console.error);
    };
}
