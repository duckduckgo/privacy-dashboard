import $ from 'jquery'
import Parent from '../base/view.es6.js'

function Failover (ops) {
    this.template = ops.template
    this.message = ops.message
    Parent.call(this, ops)
}

Failover.prototype = $.extend({},
    Parent.prototype,
    {

    }
)

export default Failover
