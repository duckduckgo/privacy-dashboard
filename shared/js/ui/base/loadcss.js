function loadCss (file) {
    const head = document.getElementsByTagName('head')[0]
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = '../public/css/' + file + '.css'
    head.appendChild(link)
}

setTimeout(() => {
    loadCss('base')
    loadCss('popup')
}, 5)
