// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { Done, SecondaryTopNav, TopNav } from '../components/top-nav'
import { Nav, NavItem } from '../components/nav'
import { KeyInsightsMain } from '../components/key-insights'
import { ns } from '../../shared/js/ui/base/localize'
import { useNav } from '../navigation'
import { TextLink } from '../../shared/js/ui/components/text-link'
import { ProtectionToggle } from '../../shared/js/ui/components/toggle'
import { useClose, useData, useSendReport, useToggle } from '../data-provider'
import { FormElement } from './breakage-form-screen'

export function ChoiceProblemScreen() {
    const text = `example.com`
    const description = `What's the problem?`
    const { push } = useNav()

    return (
        <div className="site-info card" data-page="choice-problem">
            <SecondaryTopNav />
            <div className="padding-x-double">
                {/* @ts-ignore */}
                <KeyInsightsMain title={text}>{description}</KeyInsightsMain>
            </div>
            <div className="padding-x">
                <Nav>
                    <NavItem onClick={() => push('choiceCategory')}>The site is not working as expected</NavItem>
                    <NavItem onClick={() => console.log('onclick')}>I dislike the content on this site</NavItem>
                    <NavItem onClick={() => console.log('onclick')}>General DuckDuckGo browser feedback</NavItem>
                </Nav>
            </div>
        </div>
    )
}

export function ChoiceCategoryScreen() {
    const categories = [
        { category: ns.report('blocked.title'), value: 'blocked' },
        { category: ns.report('layout.title'), value: 'layout' },
        { category: ns.report('emptySpaces.title'), value: 'empty-spaces' },
        { category: ns.report('paywall.title'), value: 'paywall' },
        { category: ns.report('videos.title'), value: 'videos' },
        { category: ns.report('comments.title'), value: 'comments' },
        { category: ns.report('login.title'), value: 'login' },
        { category: ns.report('shopping.title'), value: 'shopping' },
        { category: ns.report('other.title'), value: 'other' },
    ]
    const text = `example.com`
    const description = 'What’s not working on this site?'
    const { push } = useNav()
    return (
        <div className="site-info card" data-page="choice-category">
            <SecondaryTopNav />
            <div className="padding-x-double">
                {/* @ts-ignore */}
                <KeyInsightsMain title={text}>{description}</KeyInsightsMain>
            </div>
            <div className="padding-x">
                <Nav>
                    {categories.map((category) => {
                        return (
                            <NavItem key={category.value} onClick={() => push('choiceToggle')}>
                                {category.category}
                            </NavItem>
                        )
                    })}
                </Nav>
            </div>
        </div>
    )
}

export function ChoiceToggleScreen() {
    const text = `example.com`
    const description = 'Try turning Privacy Protections off to see if that resolves the issue.'
    const { push } = useNav()
    const data = useData()
    const onToggle = useToggle()
    return (
        <div className="site-info card" data-page="choice-category">
            <SecondaryTopNav />
            <div className="padding-x-double">
                {/* @ts-ignore */}
                <KeyInsightsMain title={text} icon="switch-shield">
                    {description}
                </KeyInsightsMain>
            </div>
            <div className="padding-x">
                <div class="card-list--bordered">
                    <div className="protection-toggle">
                        <div className="protection-toggle__row">
                            <ProtectionToggle model={data} toggle={onToggle} />
                        </div>
                    </div>
                </div>
                <div class="text--center">
                    <TextLink onClick={() => push('choiceBreakageReport')}>Skip this step</TextLink>
                </div>
            </div>
        </div>
    )
}

export function ChoiceBreakageReport() {
    const text = `example.com`
    // todo(v2): pass this catgegory?
    const description = 'Video didn’t play or load'
    const sendReport = useSendReport()
    const nav = useNav()
    const canPop = nav.canPop()
    const onClose = useClose()

    function submit(e) {
        e.preventDefault()
        const values = Object.fromEntries(new FormData(e.target))
        sendReport({
            category: String(values.category || ''),
            description: String(values.description || ''),
        })
    }

    return (
        <div className="site-info card" data-page="choice-category">
            {canPop ? <SecondaryTopNav /> : <TopNav done={<Done onClick={onClose} />} />}
            <div className="padding-x-third">
                {/* @ts-ignore */}
                <KeyInsightsMain title={text}>{description}</KeyInsightsMain>
            </div>
            <div className="padding-x-third">
                <FormElement
                    placeholder={'Please describe the issue you experienced (optional)'}
                    after={
                        <p>
                            What happened? <br />
                            What should have happened? <br />
                            Did turning protections off help?
                            <br />
                        </p>
                    }
                    onSubmit={submit}
                />
            </div>
        </div>
    )
}
