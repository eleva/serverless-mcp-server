// __tests__/mcpAddToolEdgeCases.test.mjs
import { handler } from '../../src/index.mjs';

describe('MCP Server - tools/call "add" method (edge cases)', () => {
    const baseEvent = {
        httpMethod: 'POST',
        headers: {
            'content-type': 'application/json',
            accept: 'application/json',
            jsonrpc: '2.0',
        },
    };

    const callAdd = (params, id = 999) => ({
        ...baseEvent,
        body: JSON.stringify({
            jsonrpc: '2.0',
            id,
            method: 'tools/call',
            params: {
                name: 'add',
                arguments: params,
            },
        }),
    });

    it('should return a validation error if "a" is missing', async () => {
        const response = await handler(callAdd({ b: 2 }, 101));
        const body = JSON.parse(response.body);
        expect(body).toHaveProperty('error');
        expect(body.error.message).toMatch(/a/i);
    });

    it('should return a validation error if "b" is missing', async () => {
        const response = await handler(callAdd({ a: 2 }, 102));
        const body = JSON.parse(response.body);
        expect(body.error.message).toMatch(/b/i);
    });

    it('should return a validation error if "a" is a string', async () => {
        const response = await handler(callAdd({ a: '5', b: 2 }, 103));
        const body = JSON.parse(response.body);
        expect(body.error.message).toMatch(/a/i);
    });

    it('should return a validation error if both are strings', async () => {
        const response = await handler(callAdd({ a: 'foo', b: 'bar' }, 104));
        const body = JSON.parse(response.body);
        expect(body.error.message).toMatch(/number/i);
    });

    it('should return 0 when both a and b are 0', async () => {
        const response = await handler(callAdd({ a: 0, b: 0 }, 105));
        const body = JSON.parse(response.body);
        expect(body.result.content[0].text).toBe('0');
    });

    it('should handle negative numbers correctly', async () => {
        const response = await handler(callAdd({ a: -3, b: -7 }, 106));
        const body = JSON.parse(response.body);
        expect(body.result.content[0].text).toBe('-10');
    });
});
