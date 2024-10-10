import { useEffect } from 'preact/hooks'
import { platform } from '../../../browser/communication'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useToggleReportState } from './use-toggle-report-state'

/**
 * Smoothly animate the content back to the top, and then remove all animations to allow the content
 * below to display as normal
 *
 * @param {ReturnType<typeof useToggleReportState>[0]} state
 * @param {ReturnType<typeof useToggleReportState>[1]} dispatch
 */
export function useIosAnimation(state, dispatch) {
    useEffect(() => {
        if (platform.name !== 'ios' && platform.name !== 'android') return
        if (state.value === 'animating') {
            const child = /** @type {HTMLDivElement | null} */ (document.querySelector('[data-toggle-report="child"]'))
            if (!child) return
            child.addEventListener('transitionend', () => {
                dispatch('animation-complete')
            })
            child.style.transform = 'translateY(0)'
        }
    }, [state.value])

    useEffect(() => {
        if (platform.name !== 'ios' && platform.name !== 'android') return
        const child = /** @type {HTMLDivElement | null} */ (document.querySelector('[data-toggle-report="child"]'))
        const parent = /** @type {HTMLDivElement | null} */ (document.querySelector('[data-toggle-report="parent"]'))

        if (!child || !parent) return

        const rs = new ResizeObserver((r) => {
            for (let resizeObserverEntry of r) {
                if (resizeObserverEntry.contentRect.height === 0) continue
                const childSize = child.clientHeight
                const parentHeight = resizeObserverEntry.contentRect.height - 56
                const offset = (parentHeight - childSize) / 2
                child.style.transform = 'translateY(' + offset + 'px)'
                child.dataset.ready = 'true'
                setTimeout(() => {
                    child.style.transition = 'all .3s'
                }, 0)
            }
        })

        rs.observe(parent)

        return () => {
            rs.disconnect()
        }
    }, [])
}
