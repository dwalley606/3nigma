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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('successfully validates token and returns user', async () => {
    const mockUser = {
      _id: '123',
      username: 'testuser',
      email: 'test@example.com'
    };

    // Create token using actual JWT_SECRET
    const token = jwt.sign({ id: mockUser._id }, process.env.JWT_SECRET!);
    console.log('Created token:', token);

    // Set up mock user with proper MongoDB-like structure
    const mockUserDocument = {
      _id: { toString: () => mockUser._id },
      username: mockUser.username,
      email: mockUser.email,
      select: jest.fn().mockReturnValue({
        _id: { toString: () => mockUser._id },
        username: mockUser.username,
        email: mockUser.email
      })
    };

    // Set up User.findById mock
    (User.findById as jest.Mock).mockImplementation((id) => {
      console.log('Mock findById called with:', id);
      return {
        select: () => Promise.resolve(mockUserDocument)
      };
    });

    const mockReq = createMockRequest(`Bearer ${token}`);
    const result = await authMiddleware({ req: mockReq as Request });

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