const express = require('express');
const path = require('path');

console.log('🌐 QUANTUM PROFESSIONAL WEBSITE SERVER STARTING...');

class ProfessionalWebsiteServer {
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 3001;
  }

  initialize() {
    // Serve static files from professional-website directory
    this.app.use(express.static(path.join(__dirname)));
    this.app.use(express.static(path.join(__dirname, '..')));
    this.app.use(express.json());

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        service: 'Quantum Professional Website',
        timestamp: new Date() 
      });
    });

    // API proxy to main empire (if needed)
    this.app.get('/api/*', (req, res) => {
      res.json({
        message: 'API endpoints available on main empire service',
        mainEmpireUrl: 'https://quantum-yield-empire.onrender.com',
        redirect: `https://quantum-yield-empire.onrender.com${req.path}`
      });
    });

    // Main route - serve index.html
    this.app.get('/', (req, res) => {
      const indexPath = path.join(__dirname, 'index.html');
      console.log(`📄 Serving index.html from: ${indexPath}`);
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('❌ Error serving index.html:', err);
          res.status(404).send(`
            <h1>🚀 Quantum Yield Empire Professional Website</h1>
            <p>Welcome to the Quantum Yield Empire!</p>
            <p><strong>Main Empire Dashboard:</strong> <a href="https://quantum-yield-empire.onrender.com">Launch Empire</a></p>
            <p><strong>Testnet Dashboard:</strong> <a href="https://quantum-testnet-dashboard.onrender.com">Testnet</a></p>
            <p><strong>Mainnet Dashboard:</strong> <a href="https://quantum-mainnet-dashboard.onrender.com">Mainnet</a></p>
            <style>body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }</style>
          `);
        }
      });
    });

    // Catch-all route
    this.app.get('*', (req, res) => {
      res.redirect('/');
    });

    // Start server
    this.app.listen(this.PORT, '0.0.0.0', () => {
      console.log(`✅ QUANTUM PROFESSIONAL WEBSITE: Running on port ${this.PORT}`);
      console.log(`🌐 Website URL: ${process.env.RENDER_EXTERNAL_URL || `http://localhost:${this.PORT}`}`);
    });
  }
}

// Start the server
const server = new ProfessionalWebsiteServer();
server.initialize();

module.exports = ProfessionalWebsiteServer; 