import $ from 'jquery'
import browserUIWrapper from '../../browser/communication.es6.js'
import Parent from '../base/model.es6'

/** @this {any} */
function Search(attrs) {
    Parent.call(this, attrs)
}

Search.prototype = $.extend({}, Parent.prototype, {
    modelName: 'search',

    doSearch: function (searchTerm) {
        this.searchText = searchTerm
        searchTerm = encodeURIComponent(searchTerm)
        browserUIWrapper.search(searchTerm)
    },

    openOptionsPage: function () {
        this.fetch({ messageType: 'getBrowser' })
            .then((browserName) => {
                browserUIWrapper.openOptionsPage(browserName)
            })
            .catch((e) => {
                console.error('openOptionsPage', e)
            })
    },
})

export default Search
