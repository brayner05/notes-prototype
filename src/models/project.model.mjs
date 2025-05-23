/**
 * @public
 */
export class Project {
    /**
     * @param {string} title
     * @param {string} path
     */
    constructor(title, path) {
        /**
         * @type {string}
         * @public
         */
        this.title = title

        /**
         * @type {string}
         * @public
         */
        this.path = path
    }
}
