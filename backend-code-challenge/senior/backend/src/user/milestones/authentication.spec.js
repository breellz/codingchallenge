'use strict';

jest.mock('finale-rest', () => {
  const actual = jest.requireActual('finale-rest');
  return Object.assign({}, actual, { Errors: { BadRequestError: Error } });
});

jest.mock('finale-rest');
jest.mock('../../config');

const authentication = require('./authentication');

const {
  API: {
    HEADERS: { X_SLUG },
    SLUGS: { MYSELF },
  },
} = require('../../config');

describe('Authentication Milestone', () => {
  const slug = 'c2VuaW9yLWNhbmRpZGF0ZQ==';
  const mockHeader = jest.fn();

  let req = null;
  let res = null;
  let context = null;

  beforeEach(() => {
    req = {
      params: { slug: MYSELF },
      header: mockHeader,
    };
    context = { continue: 'some-result' };
    mockHeader.mockReturnValue(slug);
  });

  test('should return context continue (without myself slug)', () => {
    req.params.slug = 'some-slug';
    const result = authentication(req, res, context);
    expect(result).toEqual('some-result');
  });

  test('should not call request header with x-slug (without myself slug)', () => {
    req.params.slug = 'some-slug';
    authentication(req, res, context);
    expect(mockHeader).toHaveBeenCalledTimes(0);
  });


  test('should return context continue (with myself slug)', () => {
    const result = authentication(req, res, context);
    expect(result).toEqual('some-result');
  });

  test('should call request header with x-slug (with myself slug)', () => {
    authentication(req, res, context);
    expect(mockHeader).toHaveBeenCalledTimes(1);
    expect(mockHeader.mock.calls[0][0]).toEqual(X_SLUG);
  });

  test('should modify request slug param', () => {
    authentication(req, res, context);
    expect(req.params.slug).toEqual('senior-candidate');
  });

  test('should throw bad request error when no slug is present', () => {
    mockHeader.mockReturnValueOnce(null);
    expect(() => {
      authentication(req, res, context);
    }).toThrow('Missing user slug');
  });
});
