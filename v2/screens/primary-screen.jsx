// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { MainNav } from '../components/main-nav'
import { KeyInsights } from '../components/key-insights'
import { ProtectionHeader } from '../components/protection-header'
import { SearchBar } from '../components/search-bar'
import { isAndroid, isBrowser, isIOS } from '../../shared/js/ui/environment-check'
import { Back, Done, TopNav } from '../components/top-nav'
import { useClose } from '../data-provider'
import { EmailBar, EmailProvider } from '../components/email'

export function PrimaryScreen() {
    return (
        <div class="site-info page">
            <SearchBar />
            <PrimaryScreenTopNav />
            <div class="page-inner">
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
                <footer class="footer">
                    <div class="padding-x">
                        {isBrowser() && (
                            <EmailProvider>
                                <EmailBar />
                            </EmailProvider>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    )
}

function PrimaryScreenTopNav() {
    const onClose = useClose()
    if (isAndroid()) return <TopNav back={<Back onClick={onClose} />} />
    if (isIOS()) return <TopNav done={<Done onClick={onClose} />} />
    return null
}
