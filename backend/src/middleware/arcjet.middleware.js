import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtect = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ message: "rateLimit exits" });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot req is denied" });
      } else {
        return res.status(403).json({ message: " confict due to protect" });
      }
    }

    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "maliciousn bot activity detected",
      });
    }
    next();
  } catch (error) {
    return res.status(400).json({message:"arcjet Middleware Error"})
  }
};
