import { Request } from 'express';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

interface JwtPayload {
  id: string;
}

interface AuthUser {
  id: string;
  username: string;
}

export interface AuthContext {
  user: AuthUser | null;
}

interface AuthRequest {
  req: Request & {
    headers: {
      authorization?: string;
    };
  };
}

dotenv.config();
const secret: string = process.env.JWT_SECRET || '';
const expiration: string = "2h";

export const authMiddleware = async ({ req }: AuthRequest): Promise<AuthContext> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null };
  }

  console.log('Using secret:', secret);
  
  const token = authHeader.split(' ')[1];

  try {
    const { id } = jwt.verify(token, secret, { maxAge: expiration }) as JwtPayload;
    console.log("Token verified, user ID:", id);

    const user = await User.findById(id).select("username email");
    if (!user) {
      console.log("User not found");
      return { user: null };
    }

    return { 
      user: { 
        id: user._id.toString(), 
        username: user.username 
      }
    };
  } catch (error) {
    console.log("Invalid token:", error instanceof Error ? error.message : 'Unknown error');
    return { user: null };
  }
};
