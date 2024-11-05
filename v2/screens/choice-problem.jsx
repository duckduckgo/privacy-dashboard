// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { SecondaryTopNavAlt, Title } from '../components/top-nav';
import { Nav, NavItem } from '../components/nav';
import { KeyInsightsMain } from '../components/key-insights';
import { useNav } from '../navigation';
import { TextLink } from '../../shared/js/ui/components/text-link';
import { ProtectionToggle } from '../../shared/js/ui/components/toggle';
import { useData, useFeatures, useSendReport, useShowAlert, useShowNativeFeedback, useTelemetry, useToggle } from '../data-provider';
import { FormElement } from './breakage-form-screen';
import { ns } from '../../shared/js/ui/base/localize';
import { useMemo } from 'preact/hooks';
import { createBreakageFeaturesFrom, defaultCategories } from '../breakage-categories';

export function CategoryTypeSelection() {
    const description = ns.report('selectTheCategoryType.title');
    const { push } = useNav();
    const send = useTelemetry();
    const { tab } = useData();

    const showNativeFeedback = useShowNativeFeedback();
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
                            send({ name: 'categoryTypeSelected', value: 'notWorking' });
                            push('categorySelection');
                        }}
                    >
                        {ns.report('categoryType1.title')}
                    </NavItem>
                    <NavItem
                        onClick={() => {
                            send({ name: 'categoryTypeSelected', value: 'dislike' });
                            push('choiceBreakageForm', { category: 'dislike' });
                        }}
                    >
                        {ns.report('categoryType2.title')}
                    </NavItem>
                    <NavItem
                        onClick={() => {
                            send({ name: 'categoryTypeSelected', value: 'general' });
                            showNativeFeedback();
                        }}
                    >
                        {ns.report('categoryType3.title')}
                    </NavItem>
                </Nav>
            </div>
        </div>
    );
}

export function CategorySelection() {
    const description = ns.report('selectTheCategory.title');
    const { push } = useNav();
    const send = useTelemetry();
    const { protectionsEnabled, tab } = useData();
    const text = tab.domain;
    const platformFeatures = useFeatures();
    const showToggle =
        protectionsEnabled &&
        (platformFeatures.breakageScreen === 'categoryTypeSelection' || platformFeatures.initialScreen === 'categoryTypeSelection');

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
                                    send({ name: 'categorySelected', value: /** @type {any} */ (value) });
                                    if (showToggle) {
                                        push('choiceToggle', { category: value });
                                    } else {
                                        push('choiceBreakageForm', { category: value });
                                    }
                                }}
                            >
                                {title}
                            </NavItem>
                        );
                    })}
                </Nav>
            </div>
        </div>
    );
}

export function ChoiceToggleScreen() {
    const description = ns.report('tryTurningProtectionsOff.title');
    const { push } = useNav();
    const data = useData();
    const text = data.tab.domain;
    const onToggle = useToggle();
    const send = useTelemetry();
    return (
        <div className="site-info page-inner card" data-page="choice-category">
            <NavWrapper />
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
                    <TextLink
                        onClick={() => {
                            push('choiceBreakageForm');
                            send({ name: 'toggleSkipped' });
                        }}
                    >
                        {ns.report('skipThisStep.title')}
                    </TextLink>
                </div>
            </div>
        </div>
    );
}

export const validCategories = () => {
    return {
        ...defaultCategories(),
        dislike: ns.report('dislike.title'),
    };
};
export function ChoiceBreakageForm() {
    const { tab } = useData();
    const sendReport = useSendReport();
    const nav = useNav();
    const showAlert = useShowAlert();
    const categories = validCategories();
    let category = nav.params.get('category');

    if (!category || !Object.hasOwnProperty.call(categories, category)) {
        category = 'other';
    }
    const description = categories[category];
    const placeholder = category === 'other' ? ns.report('otherRequired.title') : ns.report('otherOptional.title');

    function submit(e) {
        e.preventDefault();
        const values = Object.fromEntries(new FormData(e.target));
        const desc = String(values.description).trim();
        if (category === 'other' && desc.length === 0) {
            showAlert();
        } else {
            sendReport({
                category: category,
                description: desc,
            });
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
    );
}

function NavWrapper() {
    return (
        <SecondaryTopNavAlt>
            <Title>{ns.report('reportTitle.title')}</Title>
        </SecondaryTopNavAlt>
    );
}
