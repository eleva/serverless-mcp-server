// __tests__/tool-list/tool-list.test.ts
import { handler } from '../../src/index';
import { describe, it, expect } from '@jest/globals';
import { createMockEvent, createMockContext } from '../test-utils';

describe('MCP Server - tools/list method', () => {
    it('Should return a list of tools', async () => {
        const event = createMockEvent({
            rawPath: '/list-tools', 
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'tools/list',
                id: 1,
            }),
        });

        const context = createMockContext();

        const response = await handler(event, context);

        expect(response.statusCode).toBe(200);

        const body = JSON.parse(response.body);
        expect(body).toHaveProperty('jsonrpc', '2.0');
        expect(body).toHaveProperty('id', 1);
        expect(body).toHaveProperty('result');
        expect(body.result).toHaveProperty('tools');
        expect(Array.isArray(body.result.tools)).toBe(true);
    });
});
