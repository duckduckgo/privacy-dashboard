import { describe, it } from 'node:test';
import { equal } from 'node:assert';
import { heroMoreLabel } from './hero-more-label.mjs';

describe('heroMoreLabel', () => {
    it('shows the count with a plus sign', () => {
        equal(heroMoreLabel(1), '+1');
        equal(heroMoreLabel(4), '+4');
    });
    it('shows 99 as is', () => {
        equal(heroMoreLabel(99), '+99');
    });
    it('caps the count at 99+', () => {
        equal(heroMoreLabel(100), '99+');
        equal(heroMoreLabel(1234), '99+');
    });
});
