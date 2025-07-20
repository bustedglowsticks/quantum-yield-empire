const QuantumEmpireProduction = require('./quantum-empire-production.js');

console.log('📊 MAINNET QUANTUM YIELD EMPIRE DASHBOARD! 📊');

class MainnetDashboard extends QuantumEmpireProduction {
  constructor() {
    super();
    this.currentNetwork = 'mainnet';
  }

  async launchEmpire(network = 'mainnet') {
    console.log('📊 MAINNET DASHBOARD: Launching performance monitoring dashboard...');
    return super.launchEmpire(network);
  }

  async startWebDashboard() {
    console.log('🌐 MAINNET DASHBOARD: Starting mainnet performance dashboard...');
    
    this.expressApp = require('express')();
    const PORT = process.env.PORT || 3003;
    
    // Middleware
    this.expressApp.use(require('express').json());
    this.expressApp.use(require('express').static(require('path').join(__dirname, 'professional-website')));
    this.expressApp.use(require('express').static(__dirname));
    
    // Health check endpoint
    this.expressApp.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy',
        service: 'Quantum Yield Empire - Mainnet Dashboard',
        timestamp: new Date(),
        empire: this.empireStatus,
        network: this.currentNetwork,
        wallet: this.wallet ? this.wallet.address : null
      });
    });
    
    // Setup API endpoints
    this.setupAPIEndpoints();
    
    // Main dashboard route with mainnet performance focus
    this.expressApp.get('/', (req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>📊 Quantum Yield Empire - Mainnet Dashboard</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                    color: white;
                    margin: 0;
                    padding: 20px;
                    min-height: 100vh;
                }
                .container {
                    max-width: 1400px;
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
                .mainnet-badge {
                    background: linear-gradient(45deg, #00d2ff, #3a7bd5);
                    padding: 10px 20px;
                    border-radius: 25px;
                    font-size: 1.2em;
                    font-weight: bold;
                    margin: 20px 0;
                    display: inline-block;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                }
                .performance-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin: 40px 0;
                }
                .performance-card {
                    background: rgba(255,255,255,0.1);
                    border-radius: 15px;
                    padding: 30px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.2);
                    text-align: left;
                }
                .metric-value {
                    font-size: 2.5em;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #00ff88;
                }
                .metric-label {
                    font-size: 1.1em;
                    opacity: 0.8;
                    margin-bottom: 15px;
                }
                .metric-change {
                    font-size: 0.9em;
                    padding: 5px 10px;
                    border-radius: 15px;
                    background: rgba(0,255,136,0.2);
                }
                .real-time-indicator {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: #00ff88;
                    margin-right: 8px;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.1); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .chart-container {
                    background: rgba(0,0,0,0.3);
                    border-radius: 15px;
                    padding: 30px;
                    margin: 30px 0;
                }
                .api-endpoints {
                    background: rgba(0,0,0,0.2);
                    border-radius: 15px;
                    padding: 30px;
                    margin: 30px 0;
                    text-align: left;
                }
                .endpoint {
                    background: rgba(255,255,255,0.1);
                    padding: 15px;
                    border-radius: 8px;
                    margin: 10px 0;
                    font-family: monospace;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 class="title">📊 Quantum Yield Empire</h1>
                    <div class="mainnet-badge">🌐 MAINNET PERFORMANCE DASHBOARD 🌐</div>
                    <p style="font-size: 1.2em;"><span class="real-time-indicator"></span>Real-time Performance Monitoring</p>
                </div>

                <div class="performance-grid">
                    <div class="performance-card">
                        <div class="metric-value">${(this.empireStatus.totalYield * 100).toFixed(2)}%</div>
                        <div class="metric-label">Current APY</div>
                        <div class="metric-change">+${((this.empireStatus.totalYield - 0.30) * 100).toFixed(1)}% vs target</div>
                    </div>
                    
                    <div class="performance-card">
                        <div class="metric-value">$${this.empireStatus.totalProfit.toLocaleString()}</div>
                        <div class="metric-label">Total Profit</div>
                        <div class="metric-change">Real-time earnings</div>
                    </div>
                    
                    <div class="performance-card">
                        <div class="metric-value">${this.empireStatus.botsActive}</div>
                        <div class="metric-label">Active Strategies</div>
                        <div class="metric-change">Multi-bot operation</div>
                    </div>
                    
                    <div class="performance-card">
                        <div class="metric-value">${(this.empireStatus.riskScore * 100).toFixed(1)}%</div>
                        <div class="metric-label">Risk Score</div>
                        <div class="metric-change">Low risk profile</div>
                    </div>
                    
                    <div class="performance-card">
                        <div class="metric-value">${this.networkConnected ? 'LIVE' : 'OFFLINE'}</div>
                        <div class="metric-label">Network Status</div>
                        <div class="metric-change">XRPL Mainnet</div>
                    </div>
                    
                    <div class="performance-card">
                        <div class="metric-value">${(this.empireStatus.diversificationScore * 100).toFixed(1)}%</div>
                        <div class="metric-label">Diversification</div>
                        <div class="metric-change">Portfolio balance</div>
                    </div>
                </div>

                <div class="chart-container">
                    <h2>📈 Bot Allocation Strategy</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px;">
                        <div style="text-align: center;">
                            <div style="font-size: 2em; color: #ff6b6b;">🔥</div>
                            <div style="font-size: 1.5em; font-weight: bold;">${(this.empireStatus.botAllocations.beastMode * 100).toFixed(0)}%</div>
                            <div>Beast Mode Bot</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2em; color: #4ecdc4;">🔄</div>
                            <div style="font-size: 1.5em; font-weight: bold;">${(this.empireStatus.botAllocations.arbitrage * 100).toFixed(0)}%</div>
                            <div>Arbitrage Engine</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 2em; color: #45b7d1;">🏦</div>
                            <div style="font-size: 1.5em; font-weight: bold;">${(this.empireStatus.botAllocations.defiStrategies * 100).toFixed(0)}%</div>
                            <div>DeFi Strategies</div>
                        </div>
                    </div>
                </div>

                <div class="api-endpoints">
                    <h2>🔌 Performance API Endpoints</h2>
                    <div class="endpoint">
                        <strong>Empire Status:</strong> <a href="/api/empire-status" style="color: #00ff88;">/api/empire-status</a>
                    </div>
                    <div class="endpoint">
                        <strong>Bot Performance:</strong> <a href="/api/bot-performance" style="color: #00ff88;">/api/bot-performance</a>
                    </div>
                    <div class="endpoint">
                        <strong>Wallet Information:</strong> <a href="/api/wallet-info" style="color: #00ff88;">/api/wallet-info</a>
                    </div>
                    <div class="endpoint">
                        <strong>Health Check:</strong> <a href="/health" style="color: #00ff88;">/health</a>
                    </div>
                </div>

                <div style="margin-top: 60px; opacity: 0.7; font-size: 0.9em;">
                    <p><span class="real-time-indicator"></span>Live Mainnet Performance | 📊 Real-time Analytics</p>
                    <p>Wallet: ${this.wallet ? this.wallet.address : 'Initializing...'}</p>
                    <p>Last Updated: ${new Date().toLocaleString()}</p>
                </div>
            </div>

            <script>
                console.log('📊 Mainnet Performance Dashboard Loaded!');
                console.log('💰 Tracking real mainnet performance!');
                
                // Auto-refresh performance data every 15 seconds
                setInterval(async () => {
                    try {
                        const response = await fetch('/api/empire-status');
                        const data = await response.json();
                        console.log('Mainnet Performance:', data);
                        
                        // Update real-time metrics if available
                        if (data.success && data.empire) {
                            console.log('Empire APY:', (data.empire.totalEmpireYield * 100).toFixed(2) + '%');
                            console.log('Total Profit:', '$' + data.empire.empireMetrics.totalProfit.toLocaleString());
                        }
                    } catch (error) {
                        console.error('Failed to fetch mainnet performance:', error);
                    }
                }, 15000);
                
                // Advanced performance tracking
                setInterval(async () => {
                    try {
                        const botResponse = await fetch('/api/bot-performance');
                        const botData = await botResponse.json();
                        
                        if (botData.success) {
                            console.log('Bot Performance Update:', {
                                yield: (botData.performance.totalYield * 100).toFixed(2) + '%',
                                risk: (botData.performance.riskScore * 100).toFixed(1) + '%',
                                diversification: (botData.performance.diversificationScore * 100).toFixed(1) + '%'
                            });
                        }
                    } catch (error) {
                        console.error('Failed to fetch bot performance:', error);
                    }
                }, 30000);
            </script>
        </body>
        </html>
      `);
    });

    // Start server
    this.server = this.expressApp.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ MAINNET DASHBOARD: Running on port ${PORT}`);
      console.log(`📊 Performance URL: ${process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`}`);
    });
  }
}

// Main execution
async function main() {
  console.log('📊 STARTING MAINNET PERFORMANCE DASHBOARD! 📊');
  
  const mainnetDashboard = new MainnetDashboard();
  
  try {
    const result = await mainnetDashboard.launchEmpire('mainnet');
    
    if (result.success) {
      console.log('🎉 MAINNET DASHBOARD LAUNCHED SUCCESSFULLY! 🎉');
      console.log('📊 Performance monitoring active on mainnet!');
    } else {
      console.error('❌ MAINNET DASHBOARD LAUNCH FAILED:', result.error);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ MAINNET DASHBOARD: Critical error:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = MainnetDashboard;

// Run if this file is executed directly
if (require.main === module) {
  main();
} 