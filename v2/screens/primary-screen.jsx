// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { MainNav } from '../components/main-nav'
import { KeyInsights } from '../components/key-insights'
import { ProtectionHeader } from '../components/protection-header'
import { useData } from '../data-provider'

export function PrimaryScreen() {
    // const c = useChannel()
    const d = useData()
    console.log(d)
    return (
        <div className="site-info page">
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
                    <div className="padding-x"></div>
                </footer>
            </div>
        </div>
    )
}
