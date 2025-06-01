// Temporary stub for Arcjet to prevent build errors
export default {
  protect: async () => ({
    isDenied: () => false,
    reason: {
      isRateLimit: () => false
    }
  })
};