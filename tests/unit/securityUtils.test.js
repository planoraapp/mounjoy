import { describe, it, expect } from 'vitest';
import { sanitizeInput, maskSensitiveData } from '../../src/utils/securityUtils';

describe('sanitizeInput', () => {
    it('escapes HTML-significant characters', () => {
        expect(sanitizeInput('<script>alert("x")</script>')).toBe(
            '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'
        );
    });

    it('escapes single quotes', () => {
        expect(sanitizeInput("O'Brien")).toBe('O&#039;Brien');
    });

    it('trims surrounding whitespace', () => {
        expect(sanitizeInput('  Ana  ')).toBe('Ana');
    });

    it('passes through non-string values unchanged', () => {
        expect(sanitizeInput(42)).toBe(42);
        expect(sanitizeInput(null)).toBe(null);
        expect(sanitizeInput(undefined)).toBe(undefined);
    });
});

describe('maskSensitiveData', () => {
    it('masks known sensitive keys without mutating the original object', () => {
        const original = { name: 'Ana', email: 'ana@example.com', password: 'hunter2', phone: '11999999999' };
        const masked = maskSensitiveData(original);

        expect(masked).toEqual({
            name: 'Ana',
            email: '********',
            password: '********',
            phone: '********',
        });
        expect(original.email).toBe('ana@example.com');
    });

    it('leaves objects without sensitive keys untouched', () => {
        const original = { name: 'Ana', currentDose: '0.25 mg' };
        expect(maskSensitiveData(original)).toEqual(original);
    });
});
