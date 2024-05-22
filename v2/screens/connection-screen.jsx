// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useNav } from '../navigation'

export function ConnectionScreen() {
    const { pop } = useNav()
    return (
        <div data-page="connection" className="site-info card">
            <div>
                <div className="top-nav">
                    <a
                        href="javascript:void(0)"
                        role="button"
                        aria-label="Back"
                        onClick={() => pop()}
                        className="top-nav__back js-sliding-subview-close js-site-done link-action link-action--dark"
                    >
                        <span data-icon-text="Back" className="icon icon__back-arrow"></span>
                    </a>
                </div>
                <div className="top-nav__spacer"></div>
            </div>
            <div className="padding-x-double">
                <div data-suffix="none" className="key-insight">
                    <div className="large-icon-container hero-icon--connection-secure"></div>
                    <p className="token-title-3">
                        This page uses an encrypted connection, which prevents third parties from viewing your activity or intercepting
                        sensitive information you send on this page.
                    </p>
                </div>
                <div>
                    <div className="section-list-header">Certificate for example.com</div>
                    <div className="page-connection__certificate">
                        <div className="page-connection__certificate-details">
                            <h3 className="token-body-em">Security Certificate Detail</h3>
                            <div>
                                <span>Common Name</span> <span className="page-connection__certificate-value">sni.cloudflaressl.com</span>
                            </div>
                            <div>
                                <span>Summary</span> <span className="page-connection__certificate-value">sni.cloudflaressl.com</span>
                            </div>
                        </div>
                        <div className="page-connection__certificate-details">
                            <h3 className="token-body-em">Public Key</h3>
                            <div>
                                <span>Algorithm</span> <span className="page-connection__certificate-value">Elliptic Curve</span>
                            </div>
                            <div>
                                <span>Key Size</span> <span className="page-connection__certificate-value">256 bits</span>
                            </div>
                            <div>
                                <span>Effective Size</span> <span className="page-connection__certificate-value">256 bits</span>
                            </div>
                            <div>
                                <span>Usage</span> <span className="page-connection__certificate-value">Encrypt, Verify, Derive</span>
                            </div>
                            <div>
                                <span>Permanent</span> <span className="page-connection__certificate-value">No</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
