// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, Fragment } from 'preact';
import { MainNav } from '../components/main-nav';
import { KeyInsights } from '../components/key-insights';
import { ProtectionHeader } from '../components/protection-header';
import { SearchBar } from '../components/search-bar';
import { isAndroid, isBrowser, isIOS } from '../../shared/js/ui/environment-check';
import { Back, Done, TopNav } from '../components/top-nav';
import { useClose, usePrimaryStatus } from '../data-provider';
import { EmailBar, EmailProvider } from '../components/email';
import { Permissions } from '../components/permissions';
import { CtaScreen } from './cta-screen';
import { i18n } from '../../shared/js/ui/base/localize';

export function PrimaryScreen() {
    const status = usePrimaryStatus();

    return (
        <div class="site-info page">
            <div className="page-inner">
                <SearchBar />
                <PrimaryScreenTopNav />
                {status === 'error' && <ErrorInner />}
                {status === 'cta' && <CtaScreenInner />}
                {status === 'ready' && <PrimaryScreenInner />}
                <Footer />
                <Permissions />
            </div>
        </div>
    );
}

function Footer() {
    return (
        <footer className="footer">
            <div className="padding-x">
                {isBrowser() && (
                    <EmailProvider>
                        <EmailBar />
                    </EmailProvider>
                )}
            </div>
        </footer>
    );
}

function PrimaryScreenInner() {
    return (
        <>
            <header class="header">
                <ProtectionHeader />
            </header>
            <div class="header-spacer"></div>
            <div class="padding-x-double">
                <KeyInsights />
            </div>
            <div class="padding-x">
                <MainNav />
            </div>
        </>
    );
}

function PrimaryScreenTopNav() {
    const onClose = useClose();
    if (isAndroid()) return <TopNav back={<Back onClick={onClose} />} />;
    if (isIOS()) return <TopNav done={<Done onClick={onClose} />} />;
    return null;
}

function CtaScreenInner() {
    return (
        <div class="padding-x">
            <CtaScreen />
        </div>
    );
}

function ErrorInner() {
    const errorText = i18n.t('site:errorMessage.title');
    return (
        <div className="padding-x">
            <div className="cta-screen">
                <p className="note token-title-3 text--center">{errorText}</p>
            </div>
        </div>
    );
}
