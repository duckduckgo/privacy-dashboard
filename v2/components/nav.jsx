// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'

export function Nav({ children }) {
    return <ul className="default-list main-nav token-body-em">{children}</ul>
}

/**
 * Represents a navigation item component.
 * @param {Object} props - The props object containing the properties of the NavItem component.
 * @param {import("preact").ComponentChild} props.children - The children elements of the NavItem component.
 * @param {string} [props.label] - The label of the NavItem component if children is not a string
 * @param {() => void} props.onClick - The onClick event handler function for the NavItem component.
 */
export function NavItem({ children, label, onClick }) {
    return (
        <li className="main-nav__row">
            <a
                href="javascript:void(0)"
                role="button"
                draggable={false}
                aria-label={typeof children === 'string' ? children : label}
                className="main-nav__item main-nav__item--link link-action link-action--dark"
                onClick={onClick}
            >
                <span className="main-nav__text">{children}</span>
                <span className="main-nav__chev"></span>
            </a>
        </li>
    )
}
