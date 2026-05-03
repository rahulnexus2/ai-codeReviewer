import rateLimit from "express-rate-limit";

const reviewLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 50, 
  message: {
    error: "Too many requests. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default reviewLimiter