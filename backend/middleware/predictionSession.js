/**
 * In-memory storage for tracking prediction sessions
 * In production, this should be replaced with Redis or database storage
 */
const predictionSessions = new Map();

// Clean up old sessions every 30 minutes
const CLEANUP_INTERVAL = 30 * 60 * 1000; // 30 minutes
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour

setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of predictionSessions.entries()) {
    if (now - data.timestamp > SESSION_TIMEOUT) {
      predictionSessions.delete(sessionId);
    }
  }
}, CLEANUP_INTERVAL);

/**
 * Generate a unique session identifier
 * Uses IP address and user agent as basis for anonymous users
 * Uses user ID for authenticated users
 */
function generateSessionId(req) {
  if (req.user) {
    return `user_${req.user.id}`;
  }

  const ip = req.ip || req.connection.remoteAddress || "unknown";
  const userAgent = req.get("User-Agent") || "unknown";
  return `anon_${Buffer.from(ip + userAgent).toString("base64")}`;
}

/**
 * Track a successful prediction
 */
function trackPrediction(req) {
  const sessionId = generateSessionId(req);
  predictionSessions.set(sessionId, {
    timestamp: Date.now(),
    hasPrediction: true,
    disposalConfirmed: false,
  });
  return sessionId;
}

/**
 * Check if a session has made a prediction and can confirm disposal
 */
function canConfirmDisposal(req) {
  const sessionId = generateSessionId(req);
  const sessionData = predictionSessions.get(sessionId);

  if (!sessionData) {
    return false;
  }

  // Check if session has made a prediction and hasn't already confirmed disposal
  return sessionData.hasPrediction && !sessionData.disposalConfirmed;
}

/**
 * Mark disposal as confirmed for a session
 */
function confirmDisposal(req) {
  const sessionId = generateSessionId(req);
  const sessionData = predictionSessions.get(sessionId);

  if (sessionData) {
    sessionData.disposalConfirmed = true;
    predictionSessions.set(sessionId, sessionData);
    return true;
  }

  return false;
}

/**
 * Get session statistics (for debugging/monitoring)
 */
function getSessionStats() {
  const total = predictionSessions.size;
  let withPredictions = 0;
  let confirmed = 0;

  for (const data of predictionSessions.values()) {
    if (data.hasPrediction) withPredictions++;
    if (data.disposalConfirmed) confirmed++;
  }

  return { total, withPredictions, confirmed };
}

module.exports = {
  trackPrediction,
  canConfirmDisposal,
  confirmDisposal,
  getSessionStats,
};
