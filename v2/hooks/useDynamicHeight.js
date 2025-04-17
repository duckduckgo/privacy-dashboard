import { useEffect } from 'preact/hooks';
import { getContentHeight, setupMutationObserverUnrestricted } from '../../shared/js/browser/common.js';

/**
 * @param {import("../../shared/js/ui/platform-features.mjs").PlatformFeatures} features
 */
export function useDynamicHeight(features) {
    useEffect(() => {
        // return early if we don't need this
        if (!features.dynamicHeight) return;

        // max height is the tallest this can be
        const MAX = features.dynamicHeight.max;

        // otherwise, set the height immediately
        set(getContentHeight());

        // and then continue to set the height when the content changes
        const unsub = setupMutationObserverUnrestricted(set);

        /**
         * Update `--height` at the body level, allowing any CSS to access it.
         * @param {number | null | undefined} height
         */
        function set(height) {
            if (height === null || height === undefined) return;
            document.body.style.setProperty('--height', `${Math.min(height, MAX)}px`);
        }

        return () => {
            unsub();
        };
    }, [features]);
}
