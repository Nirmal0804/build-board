import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 BuildBoard API server running on http://localhost:${PORT}`);
  console.log(`   Health check at http://localhost:${PORT}/api/health`);
});
