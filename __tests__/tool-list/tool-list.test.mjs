import { handler } from '../../src/index.mjs';

describe('MCP Server - tools/list method', () => {
    it('Should return a list of tools', async () => {
        const event = {
            httpMethod: 'POST',
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
                jsonrpc: '2.0',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'tools/list',
                id: 1,
            }),
        };

        const context = {}; // Lambda context (empty for unit tests)

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
