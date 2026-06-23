import { APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { JSONRPCMessage } from '@modelcontextprotocol/sdk/types.js';

type HandlerContext = Context & { jsonRPCMessages: JSONRPCMessage[] };

/**
 * Creates a mock APIGatewayProxyEventV2 object for testing.
 * Allows overriding specific properties.
 */
export function createMockEvent(overrides: Partial<APIGatewayProxyEventV2> = {}): APIGatewayProxyEventV2 {
    const defaultEvent: APIGatewayProxyEventV2 = {
        version: '2.0',
        routeKey: '$default',
        rawPath: '/test',
        rawQueryString: '',
        headers: {
            'content-type': 'application/json',
            accept: 'application/json',
            jsonrpc: '2.0',
            ...overrides.headers,
        },
        requestContext: {
            accountId: '123456789012',
            apiId: 'api-id',
            domainName: 'id.execute-api.us-east-1.amazonaws.com',
            domainPrefix: 'id',
            http: {
                method: 'POST',
                path: '/test',
                protocol: 'HTTP/1.1',
                sourceIp: '127.0.0.1',
                userAgent: 'Test Agent',
            },
            requestId: 'request-id',
            routeKey: '$default',
            stage: '$default',
            time: '01/Mar/2020:00:00:00 +0000',
            timeEpoch: 1583011200000,
            ...(overrides.requestContext as any),
        },
        body: '{}',
        isBase64Encoded: false,
        ...overrides,
    };
    return defaultEvent;
}

/**
 * Creates a mock Lambda Context object for testing.
 * Includes the jsonRPCMessages property expected by the middleware.
 */
export function createMockContext(overrides: Partial<HandlerContext> = {}): HandlerContext {
    const defaultContext: HandlerContext = {
        callbackWaitsForEmptyEventLoop: true,
        functionName: 'test-function',
        functionVersion: '$LATEST',
        invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
        memoryLimitInMB: '128',
        awsRequestId: 'test-request-id',
        logGroupName: '/aws/lambda/test-function',
        logStreamName: '2023/01/01/[$LATEST]abcdef1234567890',
        getRemainingTimeInMillis: () => 5 * 60 * 1000,
        done: () => {},
        fail: () => {},
        succeed: () => {},
        jsonRPCMessages: [],
        ...overrides,
    };
    return defaultContext;
} 