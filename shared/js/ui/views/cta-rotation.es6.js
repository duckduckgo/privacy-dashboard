import $ from 'jquery'
import Parent from '../base/view.es6.js'

function CtaRotationView(ops) {
    this.model = ops.model
    this.pageView = ops.pageView
    this.template = ops.template
    Parent.call(this, ops)
}

CtaRotationView.prototype = $.extend({}, Parent.prototype, {})

export default CtaRotationView
