const QuantumEmpireProduction = require('./quantum-empire-production.js');

console.log('🔥 TESTNET QUANTUM YIELD EMPIRE DASHBOARD! 🔥');

class TestnetDashboard extends QuantumEmpireProduction {
  constructor() {
    super();
    this.currentNetwork = 'testnet';
  }

  async launchEmpire(network = 'testnet') {
    console.log('🧪 TESTNET DASHBOARD: Launching for development testing...');
    return super.launchEmpire(network);
  }

  async startWebDashboard() {
    console.log('🌐 TESTNET DASHBOARD: Starting testnet-specific dashboard...');
    
    this.expressApp = require('express')();
    const PORT = process.env.PORT || 3002;
    
    // Middleware
    this.expressApp.use(require('express').json());
    this.expressApp.use(require('express').static(require('path').join(__dirname, 'professional-website')));
    this.expressApp.use(require('express').static(__dirname));
    
    // Health check endpoint
    this.expressApp.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy',
        service: 'Quantum Yield Empire - Testnet Dashboard',
        timestamp: new Date(),
        empire: this.empireStatus,
        network: this.currentNetwork,
        wallet: this.wallet ? this.wallet.address : null
      });
    });
    
    // Setup API endpoints
    this.setupAPIEndpoints();
    
    // Main dashboard route with testnet branding
    this.expressApp.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🔥 TESTNET BEAST MODE DASHBOARD 🔥</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
                    color: white;
                    margin: 0;
                    padding: 20px;
                    min-height: 100vh;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    text-align: center;
                }
                .header {
                    margin-bottom: 40px;
                }
                .title {
                    font-size: 3em;
                    margin-bottom: 20px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }
                .testnet-badge {
                    background: rgba(255,0,0,0.8);
                    padding: 10px 20px;
                    border-radius: 25px;
                    font-size: 1.2em;
                    font-weight: bold;
                    margin: 20px 0;
                    display: inline-block;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                }
                .stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin: 40px 0;
                }
                .stat-card {
                    background: rgba(255,255,255,0.1);
                    border-radius: 15px;
                    padding: 30px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.2);
                }
                .stat-value {
                    font-size: 2.5em;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .stat-label {
                    font-size: 1.1em;
                    opacity: 0.8;
                }
                .warning {
                    background: rgba(255,193,7,0.2);
                    border: 2px solid #FFC107;
                    border-radius: 10px;
                    padding: 20px;
                    margin: 30px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 class="title">🔥 TESTNET BEAST MODE</h1>
                    <div class="testnet-badge">🧪 DEVELOPMENT ENVIRONMENT 🧪</div>
                    <p style="font-size: 1.2em;">Testing Your Quantum Yield Empire</p>
                </div>

                <div class="warning">
                    <h3>⚠️ TESTNET ENVIRONMENT ⚠️</h3>
                    <p>This is a development environment using test XRP tokens. No real money is involved.</p>
                    <p>Use this dashboard to test strategies before deploying to mainnet.</p>
                </div>

                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-value">${(this.empireStatus.totalYield * 100).toFixed(1)}%</div>
                        <div class="stat-label">Test APY</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.empireStatus.botsActive}</div>
                        <div class="stat-label">Test Bots</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">TESTNET</div>
                        <div class="stat-label">Network</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.networkConnected ? 'CONNECTED' : 'OFFLINE'}</div>
                        <div class="stat-label">Test Network</div>
                    </div>
                </div>

                <div style="margin: 40px 0; background: rgba(0,0,0,0.2); border-radius: 15px; padding: 30px;">
                    <h2>🧪 Development Features</h2>
                    <div style="text-align: left;">
                        <p>✅ Test wallet automatically funded with test XRP</p>
                        <p>✅ All strategies running in simulation mode</p>
                        <p>✅ Safe environment for experimentation</p>
                        <p>✅ Real-time performance monitoring</p>
                        <p>✅ API endpoints for testing integrations</p>
                    </div>
                </div>

                <div style="margin-top: 60px; opacity: 0.7; font-size: 0.9em;">
                    <p>🔥 Testnet Beast Mode Active | 🧪 Development Environment</p>
                    <p>Wallet: ${this.wallet ? this.wallet.address : 'Initializing...'}</p>
                    <p>Last Updated: ${new Date().toLocaleString()}</p>
                </div>
            </div>

            <script>
                console.log('🔥 Testnet Beast Mode Dashboard Loaded!');
                console.log('🧪 Development environment ready for testing!');
                
                // Auto-refresh every 30 seconds
                setInterval(async () => {
                    try {
                        const response = await fetch('/health');
                        const data = await response.json();
                        console.log('Testnet Status:', data);
                    } catch (error) {
                        console.error('Failed to fetch testnet status:', error);
                    }
                }, 30000);
            </script>
        </body>
        </html>
      `);
    });

    // Start server
    this.server = this.expressApp.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ TESTNET DASHBOARD: Running on port ${PORT}`);
      console.log(`🧪 Testnet URL: ${process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`}`);
    });
  }
}

// Main execution
async function main() {
  console.log('🧪 STARTING TESTNET BEAST MODE DASHBOARD! 🧪');
  
  const testnetDashboard = new TestnetDashboard();
  
  try {
    const result = await testnetDashboard.launchEmpire('testnet');
    
    if (result.success) {
      console.log('🎉 TESTNET DASHBOARD LAUNCHED SUCCESSFULLY! 🎉');
      console.log('🧪 Development environment ready for testing!');
    } else {
      console.error('❌ TESTNET DASHBOARD LAUNCH FAILED:', result.error);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ TESTNET DASHBOARD: Critical error:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = TestnetDashboard;

// Run if this file is executed directly
if (require.main === module) {
  main();
} 