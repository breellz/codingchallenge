'use strict';

jest.mock('finale-rest', () => {
  const actual = jest.requireActual('finale-rest');
  return Object.assign({}, actual, { Errors: { ForbiddenError: Error } });
});

jest.mock('finale-rest');
jest.mock('../../config');

const authorization = require('./authorization');

const {
  API: {
    KEY,
    HEADERS: { X_API_KEY },
  },
} = require('../../config');

describe('Authorization Milestone', () => {
  const mockHeader = jest.fn();

  let req = null;
  let res = null;
  let context = null;

  beforeEach(() => {
    req = { header: mockHeader };
    context = { continue: 'some-result' };
    mockHeader.mockReturnValue(KEY);
  });

  test('should return context continue', () => {
    const result = authorization(req, res, context);
    expect(result).toEqual('some-result');
  });

  test('should call request header with x-api-key', () => {
    authorization(req, res, context);
    expect(mockHeader).toHaveBeenCalledTimes(1);
    expect(mockHeader.mock.calls[0][0]).toEqual(X_API_KEY);
  });

  test('should throw forbiden error when invalide API key', () => {
    mockHeader.mockReturnValueOnce(null);
    expect(() => {
      authorization(req, res, context);
    }).toThrow('Wrong API key');
  });
});
