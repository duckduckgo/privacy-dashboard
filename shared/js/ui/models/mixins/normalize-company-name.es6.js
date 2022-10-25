export function normalizeCompanyName(companyName) {
    return (
        (companyName || '')
            .toLowerCase()
            // Remove TLD suffixes
            // e.g. Fixes cases like "amazon.com" -> "amazon"
            .replace(/\.[a-z]+$/i, '')
            // Remove non-alphanumeric characters
            // e.g. Fixes cases like "new relic" -> "newrelic"
            .replace(/[^a-z0-9]/g, '')
    )
}

/**
 * @param {string | ""} entityName
 */
export function removeTLD(entityName) {
    return entityName.replace(/\.[a-z]+$/i, '')
}
