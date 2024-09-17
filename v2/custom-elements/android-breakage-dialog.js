import { css, html, LitElement } from 'lit'
import { map } from 'lit/directives/map.js'
import '@material/web/button/filled-button.js'
import '@material/web/button/filled-tonal-button.js'
import '@material/web/button/text-button.js'
import '@material/web/dialog/dialog.js'
import '@material/web/icon/icon.js'
import '@material/web/iconbutton/icon-button.js'
import '@material/web/radio/radio.js'
import '@material/web/textfield/outlined-text-field.js'

export class AndroidBreakageDialog extends LitElement {
    static properties = {
        items: {
            type: Array,
        },
        title: {
            type: String,
        },
        opened: {
            type: Boolean,
        },
    }

    title = 'please set the title prop'
    /** @type {[string, string][]} */
    items = []
    opened = false

    /**
     * Every time we show the modal, reset the form to
     * ensure it's in sync with the one in the page
     *
     * @param {string} initial - the category value
     */
    show(initial) {
        if (!this.shadowRoot) throw new Error('unreachable')
        const elem = this.shadowRoot?.querySelector('md-dialog')
        if (!elem) throw new Error('unreachable')

        const form = elem?.querySelector('form')
        if (!form) throw new Error('unreachable, missing form')

        const radioElements = this.shadowRoot?.querySelectorAll('md-radio')

        form.reset()

        for (let element of Array.from(radioElements)) {
            if (element.value === initial) {
                element.checked = true
            }
        }

        elem.show()
    }
    get _currentFormValue() {
        const elem = this.shadowRoot?.querySelector('md-dialog')
        if (!elem) throw new Error('unreachable')

        const form = elem?.querySelector('form')
        if (!form) throw new Error('unreachable, missing form')

        const formData = new FormData(form)
        const value = formData.get('category')
        return value
    }
    _onClose(e) {
        const dialog = e.target
        if (dialog.returnValue === 'ok') {
            const value = this._currentFormValue
            const options = { detail: { value }, composed: true, bubbles: true }
            const event = new CustomEvent('did-select', options)
            this.dispatchEvent(event)
        }
    }

    _didOpen() {
        this.opened = true
        this.requestUpdate()
    }

    _didClose() {
        this.opened = false
        this.requestUpdate()
    }

    render() {
        return html`
            <md-dialog @close=${this._onClose} @opened=${this._didOpen} @closed=${this._didClose} data-opened=${String(this.opened)}>
                <div slot="headline">${this.title}</div>
                <form slot="content" id="form" method="dialog">
                    ${map(this.items, ([value, title]) => {
                        return html`
                            <label>
                                <md-radio name="category" value=${value} aria-label=${title} touch-target="wrapper"></md-radio>
                                <span aria-hidden="true">${title}</span>
                            </label>
                        `
                    })}
                </form>
                <div slot="actions">
                    <md-text-button form="form" value="cancel">Cancel</md-text-button>
                    <md-filled-button form="form" value="ok">OK</md-filled-button>
                </div>
            </md-dialog>
        `
    }
    static styles = [
        css`
            :root {
                text-align: left;
            }
            label {
                display: flex;
                align-items: center;
            }
            md-dialog {
                text-align: left;

                --md-ref-typeface-plain: system, system-ui, Roboto;
                --md-ref-typeface-brand: system, system-ui, Roboto;

                --md-dialog-headline-size: 18px;
                --md-dialog-container-shape: 8px;
                --md-dialog-container-color: white;

                --md-sys-color-primary: #3969ef;
                --md-radio-icon-color: #3969ef;
            }
            md-dialog label {
                pointer-events: none;
            }
            md-dialog[data-opened='true'] label {
                pointer-events: unset;
            }
            md-filled-button {
                --md-filled-button-container-shape: 8px;
            }
            md-text-button {
                --md-text-button-container-shape: 8px;
            }
        `,
    ]
}

customElements.define('ddg-android-breakage-dialog', AndroidBreakageDialog)