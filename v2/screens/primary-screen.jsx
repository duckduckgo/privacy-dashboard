// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { MainNav } from '../components/main-nav'
import { KeyInsights } from '../components/key-insights'
import { ProtectionHeader } from '../components/protection-header'
import { SearchBar } from '../components/search-bar'
import { EmailBar, EmailProvider } from '../components/email'
import { platformSwitch } from '../../shared/js/ui/environment-check'

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
