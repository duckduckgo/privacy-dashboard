// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { Raw } from './Text'
import { useData } from '../data-provider'

export function KeyInsights() {
    const data = useData()
    console.log(data)
    return (
        <div id="key-insight">
            <div className="key-insight key-insight--main">
                <div data-company-count="1" aria-label="List of Blocked Company Icons" className="key-insight__icon icon-list">
                    <span style="order: 1" data-company-icon-position="1" className="icon-list__item">
                        {' '}
                        <span data-company-icon-size="large" className="icon-list__wrapper">
                            {' '}
                            <span className="icon-list__icon G color-8 google"></span>{' '}
                            <span className="icon-list__blocked-icon">
                                {' '}
                                <svg viewBox="0 0 32 32" fill="none">
                                    <circle fill="white" cx="16" cy="16" r="15"></circle>
                                    <path
                                        fill="#EE1025"
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16ZM24 16C24 20.4183 20.4183 24 16 24C14.5164 24 13.1271 23.5961 11.9361 22.8924L22.8924 11.9361C23.5961 13.1271 24 14.5164 24 16ZM9.10763 20.0639L20.0639 9.10763C18.8729 8.40386 17.4836 8 16 8C11.5817 8 8 11.5817 8 16C8 17.4836 8.40386 18.8729 9.10763 20.0639Z"
                                    ></path>
                                </svg>
                            </span>
                        </span>
                    </span>
                </div>
                <h1 className="token-title-3-em">example.com</h1>
                <div className="token-title-3">
                    <Raw text={'We blocked <b>Google</b> from loading tracking requests on this page.'} />
                </div>
            </div>
        </div>
    )
}
