import { Request } from 'express';
import { authMiddleware } from '../../src/utils/auth';
import jwt from 'jsonwebtoken';
import User from '../../src/models/User';

const TEST_SECRET = 'test_secret_key_for_tests';

jest.mock('../../src/models/User', () => ({
  findById: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('fake.jwt.token'),
  verify: jest.fn()
}));

const createMockRequest = (authHeader?: string): Partial<Request> => ({
  headers: {
    authorization: authHeader
  }
});

describe('Auth Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('successfully validates token and returns user', async () => {
    const mockUser = {
      _id: '123',
      username: 'testuser'
    };

    const token = 'fake.jwt.token';
    (jwt.verify as jest.Mock).mockReturnValue({ id: mockUser._id });

    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: { toString: () => mockUser._id },
        username: mockUser.username
      })
    });

    const mockReq = createMockRequest(`Bearer ${token}`);
    const result = await authMiddleware({ req: mockReq as Request });

    expect(User.findById).toHaveBeenCalledWith(mockUser._id);
    expect(result).toEqual({
      user: {
        id: mockUser._id,
        username: mockUser.username
      }
    });
  });

  test('returns null user when no authorization header provided', async () => {
    const mockReq = createMockRequest();
    const result = await authMiddleware({ req: mockReq as Request });
    expect(result).toEqual({ user: null });
  });

  test('returns null user when authorization header is not Bearer token', async () => {
    const mockReq = createMockRequest('Basic token123');
    const result = await authMiddleware({ req: mockReq as Request });
    expect(result).toEqual({ user: null });
  });

  test('returns null user when token is invalid', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const mockReq = createMockRequest('Bearer invalid_token');
    const result = await authMiddleware({ req: mockReq as Request });
    expect(result).toEqual({ user: null });
  });

  test('returns null user when user not found in database', async () => {
    const token = 'fake.jwt.token';
    (jwt.verify as jest.Mock).mockReturnValue({ id: 'nonexistent_id' });
    
    (User.findById as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    const mockReq = createMockRequest(`Bearer ${token}`);
    const result = await authMiddleware({ req: mockReq as Request });
    expect(result).toEqual({ user: null });
  });
}); 