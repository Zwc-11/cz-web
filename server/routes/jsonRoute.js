export function jsonRoute(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      console.error('[api route error]', err);
      if (res.headersSent) return next(err);
      res.status(500).json({
        ok: false,
        error: 'Portfolio data is temporarily unavailable.',
      });
    }
  };
}
