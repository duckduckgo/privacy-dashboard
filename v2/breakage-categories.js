import { ns } from '../shared/js/ui/base/localize';

/**
 * A list of category keys and their descriptions
 */
export const defaultCategories = () => {
    return {
        blocked: ns.report('blocked.title'),
        layout: ns.report('layout.title'),
        'empty-spaces': ns.report('emptySpaces.title'),
        paywall: ns.report('paywall.title'),
        videos: ns.report('videos.title'),
        comments: ns.report('comments.title'),
        login: ns.report('login.title'),
        shopping: ns.report('shopping.title'),
        other: ns.report('other.title'),
    };
};

/**
 * @param {import("../shared/js/ui/platform-features.mjs").PlatformFeatures} platformFeatures
 */
export function createBreakageFeaturesFrom(platformFeatures) {
    return {
        /**
         * @param {Record<string, string>} [additional]
         * @return {[key: string, description: string][]}
         */
        categoryList(additional = {}) {
            const items = {
                ...defaultCategories(),
                ...additional,
            };

            let list = Object.entries(items);
            
            if (platformFeatures.randomisedCategories) {
                list = shuffle(list);
            }

            // Move "other" category to end of list
            const otherItemIndex = list.findIndex(([key]) => key === 'other');
            if (otherItemIndex !== -1) {
                list.push(list.splice(otherItemIndex, 1)[0]);
            }

            return list;
        },
    };
}

/**
 * Shuffles an array randomly.
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 * @template T
 * @param {T[]} arr - The array to be shuffled.
 * @returns {T[]} - The shuffled array.
 */
function shuffle(arr) {
    let len = arr.length;
    let temp;
    let index;
    while (len > 0) {
        index = Math.floor(Math.random() * len);
        len--;
        temp = arr[len];
        arr[len] = arr[index];
        arr[index] = temp;
    }
    return arr;
}
