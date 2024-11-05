import { AndroidBreakageDialog } from './v2/android-breakage-dialog';

declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'ddg-android-breakage-dialog': {
                items: [string, string][];
                title: string;
                cancelText: string;
                okText: string;
                ref: import('preact').RefObject<AndroidBreakageDialog | null>;
            };
        }
    }
}

export {};
