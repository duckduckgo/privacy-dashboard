// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createContext, h, render } from 'preact'
import html from 'nanohtml'
import { topNav } from '../templates/shared/top-nav'
import { ns } from '../base/localize'
import { PlainTextLink } from './text-link'
import { Button, ButtonBar } from './button'
import { platform } from '../../browser/communication'
import { Scrollable, Stack } from './stack'
import { useContext, useEffect, useReducer } from 'preact/hooks'
import { FetchSimpleReportOptions } from '../../browser/common'

export function SimpleBreakageReport() {
    const buttonVariant = platform.name === 'ios' ? 'ios-secondary' : 'macos-standard'
    const buttonLayout = platform.name === 'ios' ? 'vertical' : 'horizontal'
    const buttonSize = platform.name === 'ios' ? 'big' : 'small'
    const innerGap = platform.name === 'ios' ? '24px' : '16px'
    const [state, dispatch] = useReducer(
        (state, /** @type {"toggle"} */ action) => {
            switch (action) {
                case 'toggle': {
                    const next = state.value === 'hiding' ? /** @type {const} */ ('showing') : /** @type {const} */ ('hiding')
                    return { ...state, value: next }
                }
            }
            return state
        },
        { value: /** @type {'hiding' | 'showing' | 'sent'} */ ('hiding') }
    )
    const { value } = useContext(DataContext)
    console.log(value)
    return (
        <Stack gap="24px">
            <Stack gap={innerGap}>
                <div className="large-icon-container hero-icon--simple-breakage-form"></div>
                <h1 className="token-title-2-em text--center">{ns.report('siteNotWorkingTitle.title')}</h1>
                <div>
                    <h2 className="token-title-3 text--center">{ns.report('siteNotWorkingSubTitle.title')}</h2>
                    {platform.name === 'macos' && (
                        <div>
                            <p className={'text--center token-title-3'}>
                                <PlainTextLink onClick={() => dispatch('toggle')}>
                                    {state.value === 'hiding' && ns.report('siteNotWorkingInfoReveal.title')}
                                    {state.value === 'showing' && ns.report('siteNotWorkingInfoHide.title')}
                                </PlainTextLink>
                            </p>
                        </div>
                    )}
                </div>
            </Stack>
            {platform.name === 'macos' && state.value === 'showing' && (
                <Scrollable>
                    <Stack gap="4px">
                        <p className="token-body-em">{ns.report('reportsNoInfoSent.title')}</p>
                        <ul className="data-list">
                            <li>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur corporis cumque cupiditate dolores,
                                earum hic in nobis perspiciatis quo. Aliquam aspernatur atque consequuntur dolorem iusto libero saepe
                                voluptatem? Cum, explicabo?
                            </li>
                            <li>
                                Accusantium amet aperiam aut beatae dicta dolores et eum fugiat fugit harum, hic illo illum iusto magni modi
                                molestiae neque nobis officiis placeat possimus quia quibusdam quidem ullam vel voluptatum?
                            </li>
                            <li>
                                Architecto beatae eveniet facere numquam voluptatibus? A adipisci aperiam, consequatur corporis culpa
                                delectus, enim eos est fuga fugiat hic incidunt laborum minus nesciunt provident quaerat quam, ratione
                                sapiente sunt suscipit.
                            </li>
                            <li>
                                Ad delectus dicta doloremque fugiat, illum ipsam minima modi nam obcaecati odit optio porro quia quisquam
                                sed ullam ut vitae voluptas voluptate? Aut distinctio expedita fugit labore nostrum voluptates?
                                Reprehenderit.
                            </li>
                            <li>
                                Ab exercitationem iusto minus molestias nostrum perferendis praesentium saepe temporibus voluptatibus. Autem
                                delectus eaque earum, eius et ex fugit ipsam ipsum, maiores molestiae officia quod repellat sapiente totam,
                                unde vel.
                            </li>
                        </ul>
                    </Stack>
                </Scrollable>
            )}
            <ButtonBar layout={buttonLayout}>
                <Button variant={buttonVariant} btnSize={buttonSize}>
                    {ns.report('dontSendReport.title')}
                </Button>
                <Button variant={buttonVariant} btnSize={buttonSize}>
                    {ns.report('sendReport.title')}
                </Button>
            </ButtonBar>
        </Stack>
    )
}

const DataContext = createContext({
    value: /** @type {import('../../../../schema/__generated__/schema.types').SimpleReportScreen} */ ({}),
})

function DataProvider({ children, model }) {
    const initial = { status: 'pending' }
    const [state, dispatch] = useReducer((state, action) => action, initial)
    useEffect(() => {
        const msg = new FetchSimpleReportOptions()
        return model
            .fetch(msg)
            .then((data) => {
                dispatch({ status: 'ready', value: data })
            })
            .catch((e) => {
                dispatch({ status: 'error', error: e.toString() })
            })
    }, [model])
    if (state.status === 'ready') return <DataContext.Provider value={{ value: state.value }}>{children}</DataContext.Provider>
    if (state.status === 'error') return <p>Something went wrong</p>
    return <p>wait...</p>
}

/**
 * @this {{
 *     mainModel: import('../models/site.js').PublicSiteModel,
 *     model: import('../models/breakage-form').BreakageFormModel & { opener: string },
 *     roots: Map<HTMLElement, boolean>,
 *     immediate: boolean,
 *     fetch: any,
 * }}
 */
export function simpleBreakageFormTemplate() {
    const root = html`<div data-testid="simple-breakage-report"></div>`
    const template = html`
        <section class="sliding-subview">
            <div class="breakage-form" data-opener=${this.model.opener}>
                ${topNav({ view: 'secondary', immediate: this.immediate })}
                <div class="padding-x-double">${root}</div>
            </div>
        </section>
    `
    this.roots.set(root, true)
    render(
        <DataProvider model={this.model}>
            <SimpleBreakageReport />
        </DataProvider>,
        root
    )
    return template
}
