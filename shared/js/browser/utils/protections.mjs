export class Protections {
    /**
     * @param {boolean} unprotectedTemporary
     * @param {string[]} enabledFeatures
     * @param {boolean} allowlisted
     * @param {boolean} denylisted
     */
    constructor(unprotectedTemporary, enabledFeatures, allowlisted = false, denylisted = false) {
        this.unprotectedTemporary = unprotectedTemporary
        this.enabledFeatures = enabledFeatures
        this.allowlisted = allowlisted
        this.denylisted = denylisted
    }

    static default() {
        return new Protections(false, ['contentBlocking'], false, false)
    }
}
