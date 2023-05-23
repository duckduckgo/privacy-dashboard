import $ from 'jquery'
import Parent from '../base/model.js'
import { OpenOptionsMessage, SearchMessage } from '../../browser/common.js'

/** @this {any} */
function Search(attrs) {
    Parent.call(this, attrs)
}

Search.prototype = $.extend({}, Parent.prototype, {
    modelName: 'search',

    /**
     * @this {import('./site.js').LocalThis}
     * @param searchTerm
     */
    doSearch: function (searchTerm) {
        this.searchText = searchTerm
        this.fetch(new SearchMessage({ term: searchTerm }))
    },

    /**
     * @this {import('./site.js').LocalThis}
     */
    openOptionsPage: function () {
        this.fetch(new OpenOptionsMessage())
    },
})

export default Search
