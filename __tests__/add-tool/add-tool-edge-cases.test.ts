// __tests__/mcpAddToolEdgeCases.test.ts
import { handler } from '../../src/index';
import { describe, it, expect } from '@jest/globals';
import { createMockEvent, createMockContext } from '../test-utils';

describe('MCP Server - tools/call "add" method (edge cases)', () => {

    const createAddBody = (params: any, id = 999): string => {
        return JSON.stringify({
            jsonrpc: '2.0',
            id,
            method: 'tools/call',
            params: {
                name: 'add',
                arguments: params,
            },
        });
    };

    it('should return a validation error if "a" is missing', async () => {
        const body = createAddBody({ b: 2 }, 101);
        const event = createMockEvent({ body, rawPath: '/add-edge-case' });
        const context = createMockContext();
        const response = await handler(event, context);
        const responseBody = JSON.parse(response.body);
        expect(responseBody).toHaveProperty('error');
        expect(responseBody.error.message).toMatch(/a/i);
    });

    it('should return a validation error if "b" is missing', async () => {
        const body = createAddBody({ a: 2 }, 102);
        const event = createMockEvent({ body, rawPath: '/add-edge-case' });
        const context = createMockContext();
        const response = await handler(event, context);
        const responseBody = JSON.parse(response.body);
        expect(responseBody.error.message).toMatch(/b/i);
    });

    it('should return a validation error if "a" is a string', async () => {
        const body = createAddBody({ a: '5', b: 2 }, 103);
        const event = createMockEvent({ body, rawPath: '/add-edge-case' });
        const context = createMockContext();
        const response = await handler(event, context);
        const responseBody = JSON.parse(response.body);
        expect(responseBody.error.message).toMatch(/a/i);
    });

    it('should return a validation error if both are strings', async () => {
        const body = createAddBody({ a: 'foo', b: 'bar' }, 104);
        const event = createMockEvent({ body, rawPath: '/add-edge-case' });
        const context = createMockContext();
        const response = await handler(event, context);
        const responseBody = JSON.parse(response.body);
        expect(responseBody.error.message).toMatch(/number/i);
    });

    it('should return 0 when both a and b are 0', async () => {
        const body = createAddBody({ a: 0, b: 0 }, 105);
        const event = createMockEvent({ body, rawPath: '/add-edge-case' });
        const context = createMockContext();
        const response = await handler(event, context);
        const responseBody = JSON.parse(response.body);
        expect(responseBody.result.content[0].text).toBe('0');
    });

    it('should handle negative numbers correctly', async () => {
        const body = createAddBody({ a: -3, b: -7 }, 106);
        const event = createMockEvent({ body, rawPath: '/add-edge-case' });
        const context = createMockContext();
        const response = await handler(event, context);
        const responseBody = JSON.parse(response.body);
        expect(responseBody.result.content[0].text).toBe('-10');
    });
});
