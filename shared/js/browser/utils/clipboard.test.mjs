import { describe, it, afterEach } from 'node:test';
import { equal } from 'node:assert';
import { formatAddress, copyToClipboard } from './clipboard.mjs';

describe('clipboard utils', () => {
    const originalNavigatorDesc = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
    const originalDocumentDesc = Object.getOwnPropertyDescriptor(globalThis, 'document');

    const setNavigator = (value) => {
        Object.defineProperty(globalThis, 'navigator', {
            value,
            configurable: true,
            writable: true,
        });
    };

    const setDocument = (value) => {
        Object.defineProperty(globalThis, 'document', {
            value,
            configurable: true,
            writable: true,
        });
    };

    afterEach(() => {
        if (originalNavigatorDesc) {
            Object.defineProperty(globalThis, 'navigator', originalNavigatorDesc);
        } else {
            Reflect.deleteProperty(globalThis, 'navigator');
        }
        if (originalDocumentDesc) {
            Object.defineProperty(globalThis, 'document', originalDocumentDesc);
        } else {
            Reflect.deleteProperty(globalThis, 'document');
        }
    });

    describe('formatAddress', () => {
        it('appends @duck.com to alias username', () => {
            equal(formatAddress('test_alias_123'), 'test_alias_123@duck.com');
            equal(formatAddress('user.name'), 'user.name@duck.com');
        });
    });

    describe('copyToClipboard', () => {
        it('copies via navigator.clipboard.writeText when available and succeeding', async () => {
            let writtenText = null;
            setNavigator({
                clipboard: {
                    writeText: async (text) => {
                        writtenText = text;
                    },
                },
            });

            const result = await copyToClipboard('test@duck.com');
            equal(result, true);
            equal(writtenText, 'test@duck.com');
        });

        it('falls back to document.execCommand when navigator.clipboard.writeText fails (e.g. NotAllowedError)', async () => {
            let execCommandCalledWith = null;
            let appendedChild = null;
            let removedChild = null;

            setNavigator({
                clipboard: {
                    writeText: async () => {
                        const err = new Error('Clipboard write was blocked due to lack of user activation.');
                        err.name = 'NotAllowedError';
                        throw err;
                    },
                },
            });

            const mockTextarea = {
                value: '',
                style: {},
                setAttribute: () => {},
                select: () => {},
            };

            setDocument({
                createElement: (tag) => {
                    if (tag === 'textarea') return mockTextarea;
                    return {};
                },
                body: {
                    appendChild: (node) => {
                        appendedChild = node;
                    },
                    removeChild: (node) => {
                        removedChild = node;
                    },
                },
                getSelection: () => null,
                execCommand: (command) => {
                    execCommandCalledWith = command;
                    return true;
                },
            });

            const result = await copyToClipboard('fallback@duck.com');
            equal(result, true);
            equal(execCommandCalledWith, 'copy');
            equal(mockTextarea.value, 'fallback@duck.com');
            equal(appendedChild, mockTextarea);
            equal(removedChild, mockTextarea);
        });

        it('falls back to document.execCommand when navigator.clipboard is undefined', async () => {
            let execCommandCalledWith = null;

            setNavigator({});

            const mockTextarea = {
                value: '',
                style: {},
                setAttribute: () => {},
                select: () => {},
            };

            setDocument({
                createElement: () => mockTextarea,
                body: {
                    appendChild: () => {},
                    removeChild: () => {},
                },
                getSelection: () => null,
                execCommand: (command) => {
                    execCommandCalledWith = command;
                    return true;
                },
            });

            const result = await copyToClipboard('no-clipboard-api@duck.com');
            equal(result, true);
            equal(execCommandCalledWith, 'copy');
            equal(mockTextarea.value, 'no-clipboard-api@duck.com');
        });

        it('returns false gracefully when both writeText and execCommand fail without throwing unhandled rejection', async () => {
            setNavigator({
                clipboard: {
                    writeText: async () => {
                        throw new Error('Denied');
                    },
                },
            });
            setDocument({
                createElement: () => {
                    throw new Error('DOM failure');
                },
            });

            const result = await copyToClipboard('fail@duck.com');
            equal(result, false);
        });
    });
});
