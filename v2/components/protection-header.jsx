// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useNav } from '../navigation'

export function ProtectionHeader() {
    const { push } = useNav()
    return (
        <div data-testid="protectionHeader">
            <div className="card-list--bordered">
                <div className="protection-toggle">
                    <div className="protection-toggle__row">
                        <div className="site-info-toggle is-active">
                            <p className="site-info__protection">
                                <span role="textbox">
                                    Protections are <b>ON</b> for this site
                                </span>
                            </p>
                            <div className="site-info__toggle-container">
                                <button
                                    className="toggle-button"
                                    type="button"
                                    role="switch"
                                    aria-checked="true"
                                    aria-label="Disable Protections"
                                >
                                    <div className="toggle-button__track"></div>
                                    <div className="toggle-button__handle"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text--center">
                <a
                    href="javascript:void(0)"
                    onClick={() => push('breakage')}
                    className="link-action link-action--text link-action--rounded"
                    draggable={false}
                >
                    Website not working?
                </a>
            </div>
        </div>
    )
}
