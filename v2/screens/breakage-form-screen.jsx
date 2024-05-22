// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useNav } from '../navigation'

export function BreakageFormScreen() {
    const { pop } = useNav()
    return (
        <div className="breakage-form">
            <div>
                <div className="top-nav">
                    <a
                        href="javascript:void(0)"
                        onClick={() => pop()}
                        role="button"
                        aria-label="Back"
                        className="top-nav__back js-sliding-subview-close js-site-done link-action link-action--dark"
                    >
                        <span data-icon-text="Back" className="icon icon__back-arrow"></span>
                    </a>
                </div>
                <div className="top-nav__spacer"></div>
            </div>
            <div data-state="idle" className="breakage-form__inner js-breakage-form-element">
                <div className="header header--breakage">
                    <div data-testid="breakage-form-protection-header">
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
                                <div className="protection-toggle__row protection-toggle__row--alt">
                                    Turning protections OFF might help.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="key-insight key-insight--breakage padding-x-double">
                    <div className="large-icon-container hero-icon--breakage-form"></div>
                    <div className="breakage-form__advise">
                        <p className="token-title-3">Submitting an anonymous broken site report helps us improve the app.</p>
                    </div>
                    <div className="thanks">
                        <p className="thanks__primary">Thank you!</p>
                        <p className="thanks__secondary">
                            Your report will help improve our products and make the experience better for other people.
                        </p>
                    </div>
                </div>
                <div className="breakage-form__content padding-x-double">
                    <div className="breakage-form__element">
                        <div className="form__group">
                            <div className="form__select breakage-form__input--dropdown">
                                <select className="js-breakage-form-dropdown">
                                    <option value="">Describe what happened</option>
                                    <option value="blocked">Site blocked or didn't load</option>
                                    <option value="layout">Site layout broken</option>
                                    <option value="empty-spaces">Site contains large empty spaces</option>
                                    <option value="paywall">Site asked me to disable ad blocker</option>
                                    <option value="videos">Video didn’t play or load</option>
                                    <option value="comments">Comments, reviews, or chats didn’t load</option>
                                    <option value="login">Can’t sign in/register</option>
                                    <option value="shopping">Can't pay, check out, or shop</option>
                                    <option value="other">Something else</option>
                                </select>
                            </div>
                            <textarea
                                placeholder="Share more details (optional):
 • What happened?
 • What should have happened?
 • Did turning protections off help?"
                                maxLength={250}
                                className="form__textarea js-breakage-form-description"
                            ></textarea>
                            <button role="button" className="form__submit token-label-em js-breakage-form-submit">
                                Send Report
                            </button>
                        </div>
                    </div>
                </div>
                <div className="breakage-form__footer padding-x-double token-breakage-form-body">
                    Reports sent to DuckDuckGo only include info required to help us address your feedback.
                </div>
            </div>
        </div>
    )
}
