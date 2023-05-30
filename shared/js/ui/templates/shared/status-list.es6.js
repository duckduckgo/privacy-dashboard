import html from 'nanohtml'

export default function (items, extraClasses) {
    extraClasses = extraClasses || ''

    return html`<ul class="status-list ${extraClasses}">
        ${items.map(renderItem)}
    </ul>`
}

function renderItem(item) {
    return html`<li
        class="status-list__item status-list__item--${item.modifier}
    bold ${item.highlight ? 'is-highlighted' : ''}"
    >
        ${item.msg}
    </li>`
}
