// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useNav } from '../navigation'

export function MainNav() {
    const { goto } = useNav()
    return (
        <nav id="main-nav">
            <ul className="default-list main-nav token-body-em js-site-main-nav">
                <li className="main-nav__row">
                    <a
                        href="javascript:void(0)"
                        role="button"
                        draggable={false}
                        onClick={() => goto(['primary', 'breakage', 'connection'])}
                        aria-label="View Connection Information"
                        className="main-nav__item main-nav__item--link link-action link-action--dark"
                    >
                        <span className="main-nav__icon icon-small--secure"></span>{' '}
                        <span className="main-nav__text">Connection Is Encrypted</span> <span className="main-nav__chev"></span>
                    </a>
                </li>
                <li className="main-nav__row">
                    <a
                        href="javascript:void(0)"
                        role="button"
                        draggable={false}
                        aria-label="View Tracker Companies"
                        className="main-nav__item main-nav__item--link link-action link-action--dark"
                    >
                        <span className="main-nav__icon icon-small--blocked"></span>{' '}
                        <span className="main-nav__text">Requests Blocked from Loading</span> <span className="main-nav__chev"></span>
                    </a>
                </li>
                <li className="main-nav__row">
                    <a
                        href="javascript:void(0)"
                        role="button"
                        draggable={false}
                        aria-label="View Non-Tracker Companies"
                        className="main-nav__item main-nav__item--link link-action link-action--dark"
                    >
                        <span className="main-nav__icon icon-small--blocked"></span>{' '}
                        <span className="main-nav__text">No Third-Party Requests Found</span> <span className="main-nav__chev"></span>
                    </a>
                </li>
            </ul>
        </nav>
    )
}
