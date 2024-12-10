import { Request } from 'express';
import { authMiddleware } from '../../src/utils/auth';
import jwt from 'jsonwebtoken';
import User from '../../src/models/User';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

jest.mock('../../src/models/User', () => ({
  findById: jest.fn()
}));

const createMockRequest = (authHeader?: string): Partial<Request> => ({
  headers: {
    authorization: authHeader
  }
});

describe('Auth Middleware', () => {
  const TEST_SECRET = 'test_secret_key_for_tests';

  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure we're using the test secret
    process.env.JWT_SECRET = TEST_SECRET;
  });

  test('successfully validates token and returns user', async () => {
    // Set up mock user
    const mockUser = {
      _id: '123',
      username: 'testuser'
    };

    // Create token with the same secret used in middleware
    const token = jwt.sign({ id: mockUser._id }, process.env.JWT_SECRET!);

    // Set up mock to return user
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
    const mockReq = createMockRequest('Bearer invalid_token');
    const result = await authMiddleware({ req: mockReq as Request });
    expect(result).toEqual({ user: null });
  });

  test('returns null user when user not found in database', async () => {
    const token = jwt.sign({ id: 'nonexistent_id' }, process.env.JWT_SECRET!);
    (User.findById as jest.Mock).mockResolvedValueOnce(null);

    const mockReq = createMockRequest(`Bearer ${token}`);
    const result = await authMiddleware({ req: mockReq as Request });
    expect(result).toEqual({ user: null });
  });
}); 