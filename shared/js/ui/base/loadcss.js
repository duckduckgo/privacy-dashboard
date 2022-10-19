function loadCssFile (file) {
    const head = document.getElementsByTagName('head')[0]
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = '../public/css/' + file + '.css'
    head.appendChild(link)
}

export function loadCss () {
    setTimeout(() => {
        loadCssFile('base')
        loadCssFile('popup')
    }, 5)
}
