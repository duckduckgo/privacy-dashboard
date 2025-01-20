// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import cn from 'classnames';
import { platform } from '../../shared/js/browser/communication.js';
import { useMemo, useState, useRef, useContext, useLayoutEffect, useEffect } from 'preact/hooks';
import { SecondaryTopNavAlt, Title } from '../components/top-nav';
import { Nav, NavItem } from '../components/nav';
import { KeyInsightsMain } from '../components/key-insights';
import { useNav } from '../navigation';
import { ns } from '../../shared/js/ui/base/localize';
import { Stack } from '../../shared/js/ui/components/stack';
import { createBreakageFeaturesFrom, defaultCategories } from '../breakage-categories';
import { BreakageFormContext, BreakageFormProvider } from '../components/breakage-form-provider.jsx';
import { namedString } from '../../shared/data/text.js';
import {
    useData,
    useFeatures,
    useSendReport,
    useShowNativeFeedback,
    useFetcher,
    useClose,
    useReportBrokenSiteShown,
} from '../data-provider';

/** @typedef {'choice-problem'|'choice-category'|'form'|'success'} BreakagePageId */

export function BreakagePrimaryScreen() {
    const description = ns.report('selectTheCategoryType.title');
    const { push } = useNav();
    const { tab } = useData();
    const reportBrokenSiteShown = useReportBrokenSiteShown();

    useEffect(() => {
        reportBrokenSiteShown();
    }, []);

    const showNativeFeedback = useShowNativeFeedback();
    return (
        <BreakageScreenWrapper pageId="choice-problem" className="breakage-screen--choice">
            <div className="padding-x-double">
                {/* @ts-ignore */}
                <KeyInsightsMain title={tab.domain}>{description}</KeyInsightsMain>
            </div>
            <div className="padding-x">
                <Nav>
                    <NavItem
                        onClick={() => {
                            push('breakageFormCategorySelection');
                        }}
                    >
                        {ns.report('categoryType1.title')}
                    </NavItem>
                    <NavItem
                        onClick={() => {
                            push('breakageFormFinalStep', { category: 'dislike' });
                        }}
                    >
                        {ns.report('categoryType2.title')}
                    </NavItem>
                    {platform.name !== 'browser' && (
                        <NavItem
                            onClick={() => {
                                showNativeFeedback();
                            }}
                        >
                            {ns.report('categoryType3.title')}
                        </NavItem>
                    )}
                </Nav>
            </div>
        </BreakageScreenWrapper>
    );
}

export function BreakageCategorySelection() {
    const description = ns.report('selectTheCategory.title');
    const { push } = useNav();
    const { tab } = useData();
    const text = tab.domain;
    const platformFeatures = useFeatures();

    // shuffle once and remember
    const randomised = useMemo(() => {
        const f = createBreakageFeaturesFrom(platformFeatures);

        // override the description for 'login' on this screen.
        // this is deliberately different to the 'regular' breakage form.
        return f.categoryList({
            login: ns.report('loginV2.title'),
        });
    }, [platformFeatures]);

    return (
        <BreakageScreenWrapper pageId="choice-category" className="breakage-screen--choice">
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
                                    push('breakageFormFinalStep', { category: value });
                                }}
                            >
                                {title}
                            </NavItem>
                        );
                    })}
                </Nav>
            </div>
        </BreakageScreenWrapper>
    );
}

export const validCategories = () => {
    return {
        ...defaultCategories(),
        dislike: ns.report('dislike.title'),
    };
};

export function BreakageForm() {
    const fetcher = useFetcher();
    const { tab } = useData();
    const sendReport = useSendReport();
    const { params, push } = useNav();

    const desktop = platform.name === 'macos' || platform.name === 'windows';
    const extension = platform.name === 'browser';

    const categories = validCategories();
    let category = params.get('category');

    if (!category || !Object.hasOwnProperty.call(categories, category)) {
        category = 'other';
    }
    const description = categories[category];
    const placeholder = category === 'other' ? ns.report('otherRequired.title') : ns.report('otherOptional.title');
    const shouldShowDescriptionPrompt = category !== 'dislike';

    /**
     * @param {string} description
     */
    function submit(description) {
        sendReport({ category, description });

        if (desktop || extension) {
            push('breakageFormSuccess', {}, { animate: false });
        }
    }

    return (
        <BreakageFormProvider fetcher={fetcher} screen={'breakageFormFinalStep'}>
            <BreakageScreenWrapper pageId="form" className="breakage-screen--form">
                <div className="padding-x">
                    {/* @ts-ignore */}
                    <KeyInsightsMain title={tab.domain}>{description}</KeyInsightsMain>
                </div>
                <div className="padding-x">
                    <Stack gap="24px">
                        <FormElement
                            placeholder={placeholder}
                            after={
                                shouldShowDescriptionPrompt && (
                                    <ul class="form__description-prompt padding-x">
                                        <li>{ns.report('suggestionWhatHappened.title')}</li>
                                        <li>{ns.report('suggestionWhatHappened2.title')}</li>
                                        <li>{ns.report('suggestionWhatHappened3.title')}</li>
                                    </ul>
                                )
                            }
                            onSubmit={submit}
                            required={category === 'other'}
                        />
                    </Stack>
                </div>
            </BreakageScreenWrapper>
        </BreakageFormProvider>
    );
}

/**
 *
 * @param {object} props
 * @param {string} [props.className='']
 * @param {BreakagePageId} props.pageId
 * @param {import("preact").ComponentChild} props.children
 */
function BreakageScreenWrapper({ className = '', pageId, children }) {
    const features = useFeatures();

    const showTitle = platform.name === 'ios' || platform.name === 'android';
    const hideBackButton = pageId === 'success' && features.opener === 'menu';
    const shouldPopToRoot = pageId === 'success';

    const classes = cn('site-info page-inner card breakage-screen', className);
    /*
     We cap the height of the form on desktop to avoid a gigantic window when expanding the data disclosure message
     */
    const shouldCapHeight = pageId === 'form' && (platform.name === 'macos' || platform.name === 'windows' || platform.name === 'browser');
    const maxViewHeight = 700;

    return (
        <div className={classes} data-page={pageId} data-max-view-height={shouldCapHeight && maxViewHeight}>
            <SecondaryTopNavAlt hideBackButton={hideBackButton} shouldPopToRoot={shouldPopToRoot}>
                {showTitle && <Title>{ns.report('reportTitle.title')}</Title>}
            </SecondaryTopNavAlt>
            {children}
        </div>
    );
}

export function BreakageFormSuccess() {
    const onClose = useClose();
    const clickHandler = () => {
        if (platform.name === 'windows' || platform.name === 'macos') {
            onClose();
        }
    };

    return (
        <BreakageScreenWrapper pageId="success">
            <div className="success__container" onClick={clickHandler}>
                <div className="success__icon"></div>
                <h1 className="token-body-em">{ns.report('thankYou.title')}</h1>
                <p className="token-body success__message">{ns.report('yourReportWillHelpDesc.title', { newline: '\n' })}</p>
            </div>
        </BreakageScreenWrapper>
    );
}

/**
 * Creates a form element.
 *
 * @param {Object} options - The options for the form element.
 * @param {(args:any) => void} options.onSubmit - The submit event handler function for the form.
 * @param {import('preact').ComponentChild} [options.before] - The content to display before the textarea.
 * @param {import('preact').ComponentChild} [options.after] - The content to display before the textarea.
 * @param {string} [options.placeholder] - The placeholder text in the textare
 * @param {boolean} [options.required=false] - Whether the field is required
 */
export function FormElement({ onSubmit, before, after, placeholder, required = false }) {
    const [userSubmitted, setUserSubmitted] = useState(false);
    const [description, setDescription] = useState('');

    let bullet = '\u000A • ';
    placeholder = placeholder || ns.report('tellUsMoreDesc.title', { bullet });

    /* All of this validation code could be replaced by the required attribute and :user-invalid pseudo selector. However:
     - We want to trim the value of textarea before validation. "required" would allow whitespaces through.
     - The textarea element doesn't support the pattern attribute.
     - Most browsers only started supporting :user-invalid in 2023.
     - The :invalid pseudo-selector would flag the field as invalid before form submission. */

    const isInvalid = required && userSubmitted && description.length === 0;

    const textareaClasses = cn({
        textarea: true,
        form__textarea: true,
        invalid: isInvalid,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setUserSubmitted(true);
        if (required && description.length === 0) return;
        onSubmit(description);
    };

    const handleInput = (e) => {
        const target = /** @type {HTMLTextAreaElement} */ (e.target);
        setDescription(String(target.value).trim());
    };

    return (
        <form className="breakage-form__element" onSubmit={handleSubmit} novalidate>
            <Stack gap="24px">
                <div className="form__group">
                    <Stack gap="16px">
                        {before}
                        <Stack gap="8px">
                            <textarea
                                className={textareaClasses}
                                placeholder={placeholder}
                                maxLength={2500}
                                name="description"
                                onInput={handleInput}
                            ></textarea>
                            {isInvalid && <p className="form__error-message">{ns.report('descriptionRequired.title')}</p>}
                        </Stack>
                        {after}
                    </Stack>
                </div>
                <DetailsDisclosureMessage />
                <footer className="breakage-form__footer">
                    <button className="form__submit" type="submit">
                        {ns.report('sendReport.title')}
                    </button>
                </footer>
            </Stack>
        </form>
    );
}

/**
 * Displays a control that reveals hidden text (in this case, the disclosure message)
 */
function DetailsDisclosureMessage() {
    const { value } = useContext(BreakageFormContext);
    const detailsRef = useRef(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    // Animates height of details container
    useLayoutEffect(() => {
        if (platform.name !== 'android' && platform.name !== 'ios') return;

        let height = 0;

        if (detailsRef.current) {
            const detailsElement = /** @type HTMLDetailsElement */ (detailsRef.current);
            const summaryElement = /** @type HTMLElement */ (detailsElement.querySelector('summary'));
            height += summaryElement.clientHeight;

            if (detailsOpen) {
                const contentElement = /** @type HTMLElement */ (detailsElement.querySelector('.disclosure-message__content'));
                height += contentElement.clientHeight;
            }

            detailsElement.style.height = `${height}px`;
            detailsElement.dataset.open = `${detailsOpen}`;
        }
    }, [detailsOpen]);

    const toggleHandler = (e) => {
        const detailsElement = /** @type HTMLDetailsElement */ (e.target);
        setDetailsOpen(detailsElement.open);
    };

    return (
        <details className="disclosure-message" ref={detailsRef} onToggle={toggleHandler}>
            <summary className="disclosure-message__summary">
                <div className="disclosure-message__summary-container">
                    <span className="disclosure-message__title">{ns.toggleReport('siteNotWorkingInfoReveal.title')}</span>
                    <div className="disclosure-message__control">
                        <svg
                            className="control__chevron"
                            aria-hidden="true"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill="currentColor"
                                fill-rule="evenodd"
                                d="M3.293 7.793a1 1 0 0 0 0 1.414l8 8a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0-1.414-1.414L12 15.086 4.707 7.793a1 1 0 0 0-1.414 0"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </div>
                </div>
            </summary>
            <div className="disclosure-message__content">
                <DisclosureDataList rows={value.data} />
            </div>
        </details>
    );
}

export function DisclosureDataList({ rows }) {
    return (
        <Stack gap="8px" className="data-list__content data-list__content--breakage">
            <p className="data-list__heading">{ns.toggleReport('reportsNoInfoSent.title')}</p>
            <ul className="data-list">
                {rows.map((item) => {
                    const string = namedString(item);
                    const additional = item.id === 'siteUrl' ? '[' + item.additional?.url + ']' : null;
                    return (
                        <li className="data-list__item">
                            <span dangerouslySetInnerHTML={{ __html: `<!-- ${item.id} -->` }}></span>
                            {string}
                            {additional && <strong className="block">{additional}</strong>}
                        </li>
                    );
                })}
            </ul>
        </Stack>
    );
}
