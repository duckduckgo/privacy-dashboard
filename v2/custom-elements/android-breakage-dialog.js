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
        title: { type: String },
        okText: { type: String },
        cancelText: { type: String },
        opened: {
            type: Boolean,
        },
    }

    title = 'please set the title prop'
    okText = 'OK'
    cancelText = 'Cancel'
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

        for (const element of Array.from(radioElements)) {
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

    render() {
        return html`
            <md-dialog @close=${this._onClose}>
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
                    <!-- added autofocus as mentioned here: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog#usage_notes -->
                    <md-text-button form="form" value="cancel" autofocus>${this.cancelText}</md-text-button>
                    <md-filled-button form="form" value="ok">${this.okText}</md-filled-button>
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
            label md-radio {
                flex-shrink: 0;
            }
            md-dialog {
                text-align: left;

                --md-ref-typeface-plain: system, system-ui, Roboto;
                --md-ref-typeface-brand: system, system-ui, Roboto;

                --md-sys-typescale-headline-small-weight: 500;
                --md-dialog-headline-size: 20px;
                --md-dialog-container-shape: 12px;
                --md-dialog-container-color: white;

                --md-sys-color-primary: #3969ef;
                --md-sys-color-on-primary: white;
                --md-radio-icon-color: #3969ef;
                --md-sys-typescale-body-medium-size: 1rem;
            }

            @media screen and (prefers-color-scheme: dark) {
                md-dialog {
                    --md-sys-color-primary: #7295f6;
                    --md-radio-icon-color: #7295f6;
                    --md-dialog-container-color: #282828;
                    --md-sys-color-on-primary: black;
                    --md-sys-color-on-surface: rgba(255, 255, 255, 0.9);
                    --md-sys-color-on-surface-variant: rgba(255, 255, 255, 0.9);
                    --md-sys-color-outline-variant: rgba(255, 255, 255, 0.18);
                }
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
