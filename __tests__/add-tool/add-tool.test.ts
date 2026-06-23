// __tests__/add-tool/add-tool.test.ts
import { handler } from '../../src/index';
import { describe, it, expect } from '@jest/globals';
import { createMockEvent, createMockContext } from '../test-utils'; 


describe('MCP Server - tools/call "add" method', () => {
    it('Should return the sum of a and b', async () => {

        const event = createMockEvent({
            rawPath: '/add-tool', 
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 2,
                method: 'tools/call',
                params: {
                    name: 'add',
                    arguments: {
                        a: 5,
                        b: 3,
                    },
                },
            }),
        });
        const context = createMockContext();
        const response = await handler(event, context);
        expect(response.statusCode).toBe(200);

        const body = JSON.parse(response.body);
        expect(body).toHaveProperty('jsonrpc', '2.0');
        expect(body).toHaveProperty('id', 2);
        expect(body).toHaveProperty('result');
        expect(body.result).toHaveProperty('content');

        const content = body.result.content;
        expect(Array.isArray(content)).toBe(true);
        expect(content[0]).toEqual({
            type: 'text',
            text: '8',
        });
    });
}); 