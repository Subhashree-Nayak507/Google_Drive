import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  //15 reset the counter
  max: 5, 
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // of rate limit information
  legacyHeaders: false, // Disable the older `X-RateLimit-*` headers
});