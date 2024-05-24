// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { MainNav } from '../components/main-nav'
import { KeyInsights } from '../components/key-insights'
import { ProtectionHeader } from '../components/protection-header'
import { SearchBar } from '../components/search-bar'
import { EmailBar, EmailProvider } from '../components/email'
import { isAndroid, isIOS, platformSwitch } from '../../shared/js/ui/environment-check'
import { Back, Done, TopNav } from '../components/top-nav'
import { CloseMessage } from '../../shared/js/browser/common'
import { useData, useFetcher } from '../data-provider'

export function PrimaryScreen() {
    const email = platformSwitch({
        browser: () => (
            <EmailProvider>
                <EmailBar />
            </EmailProvider>
        ),
        default: () => null,
    })
    return (
        <div className="site-info page">
            <SearchBar />
            <PrimaryScreenTopNav />
            <div className="page-inner">
                <header className="header">
                    <ProtectionHeader />
                </header>
                <div className="header-spacer"></div>
                <div className="padding-x-double">
                    <KeyInsights />
                </div>
                <div className="padding-x">
                    <MainNav />
                </div>
                <footer className="footer">
                    <div className="padding-x">{email}</div>
                </footer>
            </div>
        </div>
    )
}

function PrimaryScreenTopNav() {
    const data = useData()
    const fetcher = useFetcher()
    function goBack() {
        const msg = new CloseMessage({ eventOrigin: { screen: data.features.initialScreen } })
        fetcher(msg).catch(console.error)
    }
    if (isAndroid()) return <TopNav back={<Back onClick={goBack} />} />
    if (isIOS()) return <TopNav done={<Done onClick={goBack} />} />
    return null
}
