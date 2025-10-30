import 'express'
declare global {
  namespace Express {
    // Extend the request and response objects with your own custom properties
    export interface Request {
      userId?: string;
    }
  }
}