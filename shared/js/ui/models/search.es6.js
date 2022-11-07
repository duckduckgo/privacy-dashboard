import $ from 'jquery'
import Parent from '../base/model.es6'
import { OpenOptionsMessage, SearchMessage } from '../../browser/common.es6'

/** @this {any} */
function Search(attrs) {
    Parent.call(this, attrs)
}

Search.prototype = $.extend({}, Parent.prototype, {
    modelName: 'search',

    /**
     * @this {import('./site.es6').LocalThis}
     * @param searchTerm
     */
    doSearch: function (searchTerm) {
        this.searchText = searchTerm
        this.fetch(new SearchMessage({ term: searchTerm }))
    },

    /**
     * @this {import('./site.es6').LocalThis}
     */
    openOptionsPage: function () {
        this.fetch(new OpenOptionsMessage())
    },
})

export default Search
