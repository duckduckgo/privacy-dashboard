// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, createContext } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

const SettingsContext = createContext({
    /** @type {boolean} */
    reducedMotion: false,
});

/**
 * @param {object} props
 * @param {import("preact").ComponentChild} props.children
 */
export function SettingsProvider({ children }) {
    // The following code should be added at your current caret position
    const [reducedMotion, setReducedMotion] = useState(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    useEffect(() => {
        const mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
        const listener = (event) => setReducedMotion(event.matches);

        mediaQueryList.addEventListener('change', listener);
        return () => {
            mediaQueryList.removeEventListener('change', listener);
        };
    }, []);

    return <SettingsContext.Provider value={{ reducedMotion }}>{children}</SettingsContext.Provider>;
}

export function useGlobalSettings() {
    return useContext(SettingsContext);
}
