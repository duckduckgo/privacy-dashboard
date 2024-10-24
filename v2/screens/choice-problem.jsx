// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { SecondaryTopNavAlt, Title } from '../components/top-nav'
import { Nav, NavItem } from '../components/nav'
import { KeyInsightsMain } from '../components/key-insights'
import { useNav } from '../navigation'
import { useData, useFeatures, useSendReport, useShowAlert, useShowNativeFeedback, useTelemetry } from '../data-provider'
import { ns } from '../../shared/js/ui/base/localize'
import { useMemo } from 'preact/hooks'
import { createBreakageFeaturesFrom, defaultCategories } from '../breakage-categories'

export function CategoryTypeSelection() {
    const description = ns.report('selectTheCategoryType.title')
    const { push } = useNav()
    const send = useTelemetry()
    const { tab } = useData()

    const showNativeFeedback = useShowNativeFeedback()
    return (
        <div className="site-info page-inner card" data-page="choice-problem">
            <NavWrapper />
            <div className="padding-x-double">
                {/* @ts-ignore */}
                <KeyInsightsMain title={tab.domain}>{description}</KeyInsightsMain>
            </div>
            <div className="padding-x">
                <Nav>
                    <NavItem
                        onClick={() => {
                            send({ name: 'categoryTypeSelected', value: 'notWorking' })
                            push('categorySelection')
                        }}
                    >
                        {ns.report('categoryType1.title')}
                    </NavItem>
                    <NavItem
                        onClick={() => {
                            send({ name: 'categoryTypeSelected', value: 'dislike' })
                            push('choiceBreakageForm', { category: 'dislike' })
                        }}
                    >
                        {ns.report('categoryType2.title')}
                    </NavItem>
                    <NavItem
                        onClick={() => {
                            send({ name: 'categoryTypeSelected', value: 'general' })
                            showNativeFeedback()
                        }}
                    >
                        {ns.report('categoryType3.title')}
                    </NavItem>
                </Nav>
            </div>
        </div>
    )
}

export function CategorySelection() {
    const description = ns.report('selectTheCategory.title')
    const { push } = useNav()
    const send = useTelemetry()
    const { tab } = useData()
    const text = tab.domain
    const platformFeatures = useFeatures()

    // shuffle once and remember
    const randomised = useMemo(() => {
        const f = createBreakageFeaturesFrom(platformFeatures)

        // override the description for 'login' on this screen.
        // this is deliberately different to the 'regular' breakage form.
        return f.categoryList({
            login: ns.report('loginV2.title'),
        })
    }, [platformFeatures])

    return (
        <div className="site-info page-inner card" data-page="choice-category">
            <NavWrapper />
            <div className="padding-x-double">
                {/* @ts-ignore */}
                <KeyInsightsMain title={text}>{description}</KeyInsightsMain>
            </div>
            <div className="padding-x">
                <Nav>
                    {randomised.map(([value, title]) => {
                        return (
                            <NavItem
                                key={value}
                                onClick={() => {
                                    send({ name: 'categorySelected', value: /** @type {any} */ (value) })
                                    push('choiceBreakageForm', { category: value })
                                }}
                            >
                                {title}
                            </NavItem>
                        )
                    })}
                </Nav>
            </div>
        </div>
    )
}

export const validCategories = () => {
    return {
        ...defaultCategories(),
        dislike: ns.report('dislike.title'),
    }
}
export function ChoiceBreakageForm() {
    const { tab } = useData()
    const sendReport = useSendReport()
    const nav = useNav()
    const showAlert = useShowAlert()
    const categories = validCategories()
    let category = nav.params.get('category')

    if (!category || !Object.hasOwnProperty.call(categories, category)) {
        category = 'other'
    }
    const description = categories[category]
    const placeholder = category === 'other' ? ns.report('otherRequired.title') : ns.report('otherOptional.title')

    function submit(e) {
        e.preventDefault()
        const values = Object.fromEntries(new FormData(e.target))
        const desc = String(values.description).trim()
        if (category === 'other' && desc.length === 0) {
            showAlert()
        } else {
            sendReport({
                category: category,
                description: desc,
            })
        }
    }

    return (
        <div className="site-info page-inner card" data-page="choice-category">
            <NavWrapper />
            <div className="padding-x-third">
                {/* @ts-ignore */}
                <KeyInsightsMain title={tab.domain}>{description}</KeyInsightsMain>
            </div>
            <div className="padding-x-third">
                <FormElement
                    placeholder={placeholder}
                    after={
                        <ul class="padding-x">
                            <li>{ns.report('suggestionWhatHappened.title')}</li>
                            <li>{ns.report('suggestionWhatHappened2.title')}</li>
                            <li>{ns.report('suggestionWhatHappened3.title')}</li>
                        </ul>
                    }
                    onSubmit={submit}
                />
            </div>
        </div>
    )
}

function NavWrapper() {
    return (
        <SecondaryTopNavAlt>
            <Title>{ns.report('reportTitle.title')}</Title>
        </SecondaryTopNavAlt>
    )
}

/**
 * Creates a form element.
 *
 * @param {Object} options - The options for the form element.
 * @param {(args:any) => void} options.onSubmit - The submit event handler function for the form.
 * @param {import('preact').ComponentChild} [options.before] - The content to display before the textarea.
 * @param {import('preact').ComponentChild} [options.after] - The content to display before the textarea.
 * @param {string} [options.placeholder] - The placeholder text in the textare
 */
export function FormElement({ onSubmit, before, after, placeholder }) {
    let bullet = '\u000A • '
    placeholder = placeholder || ns.report('tellUsMoreDesc.title', { bullet })

    return (
        <form className="breakage-form__element" onSubmit={onSubmit}>
            <div className="form__group">
                {before}
                <textarea className="form__textarea" placeholder={placeholder} maxLength={2500} name="description"></textarea>
                {after}
            </div>
            <button className="form__submit token-label-em" type="submit">
                {ns.report('sendReport.title')}
            </button>
        </form>
    )
}
