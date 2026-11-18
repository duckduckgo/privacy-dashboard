/**
 * Visible text of the "+N" pill: the number of blocked companies not shown as logos, capped at "99+".
 * @param {number} count - 1 or more
 * @returns {string}
 */
export function heroMoreLabel(count) {
    return count > 99 ? '99+' : `+${count}`;
}
