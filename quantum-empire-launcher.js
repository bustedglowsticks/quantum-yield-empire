const QuantumMultiBotOrchestrator = require('./src/multi-bot-orchestrator');
const express = require('express');
const path = require('path');

console.log('🚀 QUANTUM YIELD EMPIRE LAUNCHER - ULTIMATE PASSIVE INCOME MACHINE! 🚀');

class QuantumEmpireLauncher {
  constructor() {
    this.orchestrator = null;
    this.expressApp = null;
    this.server = null;
    this.isRunning = false;
    this.empireStatus = {
      launched: false,
      totalYield: 0,
      totalProfit: 0,
      botsActive: 0,
      aiSystems: 0
    };
  }

  async launchEmpire(network = 'mainnet') {
    console.log('🚀 QUANTUM EMPIRE: Launching Ultimate Passive Income Machine...');
    
    try {
      // Initialize the multi-bot orchestrator
      console.log('🎯 QUANTUM EMPIRE: Initializing Multi-Bot Orchestrator...');
      this.orchestrator = new QuantumMultiBotOrchestrator();
      await this.orchestrator.initialize(network);
      
      // Start the empire
      console.log('🎯 QUANTUM EMPIRE: Starting Empire Command Center...');
      const empireResult = await this.orchestrator.startEmpire();
      
      if (empireResult.success) {
        // Start the web dashboard
        await this.startWebDashboard();
        
        this.isRunning = true;
        this.empireStatus.launched = true;
        
        console.log('🎉 QUANTUM YIELD EMPIRE: FULLY OPERATIONAL! 🎉');
        console.log('🔥 Beast Mode Mainnet Bot: ACTIVE');
        console.log('🔄 Quantum Arbitrage Bot: ACTIVE');
        console.log('🏦 Quantum DeFi Strategies: ACTIVE');
        console.log('🧠 AI Empire Commander: ACTIVE');
        console.log('🌐 Web Dashboard: ACTIVE');
        
        // Start status monitoring
        this.startStatusMonitoring();
        
        return {
          success: true,
          message: 'Quantum Yield Empire launched successfully!',
          dashboard: 'http://localhost:3000',
          status: this.empireStatus
        };
      } else {
        throw new Error(empireResult.error);
      }
      
    } catch (error) {
      console.error('❌ QUANTUM EMPIRE: Launch failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async startWebDashboard() {
    console.log('🌐 QUANTUM EMPIRE: Starting Web Dashboard...');
    
    this.expressApp = express();
    const PORT = process.env.PORT || 3000;
    
    // Serve static files
    this.expressApp.use(express.static(path.join(__dirname, 'professional-website')));
    this.expressApp.use(express.json());
    
    // API endpoints
    this.setupAPIEndpoints();
    
    // Start server
    this.server = this.expressApp.listen(PORT, () => {
      console.log(`✅ QUANTUM EMPIRE: Web Dashboard running on port ${PORT}`);
      console.log(`🌐 Dashboard URL: http://localhost:${PORT}`);
    });
  }

  setupAPIEndpoints() {
    // Empire status endpoint
    this.expressApp.get('/api/empire-status', (req, res) => {
      if (this.orchestrator) {
        const status = this.orchestrator.getEmpireStatus();
        res.json({
          success: true,
          empire: status,
          timestamp: new Date()
        });
      } else {
        res.json({
          success: false,
          message: 'Empire not initialized'
        });
      }
    });

    // Bot performance endpoint
    this.expressApp.get('/api/bot-performance', async (req, res) => {
      if (this.orchestrator) {
        try {
          const performance = await this.orchestrator.calculateEmpirePerformance();
          res.json({
            success: true,
            performance: performance
          });
        } catch (error) {
          res.json({
            success: false,
            error: error.message
          });
        }
      } else {
        res.json({
          success: false,
          message: 'Empire not initialized'
        });
      }
    });

    // Control endpoints
    this.expressApp.post('/api/empire/stop', async (req, res) => {
      try {
        await this.stopEmpire();
        res.json({
          success: true,
          message: 'Empire stopped successfully'
        });
      } catch (error) {
        res.json({
          success: false,
          error: error.message
        });
      }
    });

    this.expressApp.post('/api/empire/start', async (req, res) => {
      try {
        const result = await this.launchEmpire(req.body.network || 'mainnet');
        res.json(result);
      } catch (error) {
        res.json({
          success: false,
          error: error.message
        });
      }
    });

    // Main dashboard route
    this.expressApp.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'professional-website', 'index.html'));
    });
  }

  startStatusMonitoring() {
    console.log('📊 QUANTUM EMPIRE: Starting status monitoring...');
    
    setInterval(async () => {
      if (!this.isRunning || !this.orchestrator) return;
      
      try {
        const status = this.orchestrator.getEmpireStatus();
        const performance = await this.orchestrator.calculateEmpirePerformance();
        
        // Update empire status
        this.empireStatus = {
          launched: this.isRunning,
          totalYield: performance.totalYield,
          totalProfit: performance.totalProfit,
          botsActive: 3, // All 3 bots
          aiSystems: status.aiOrchestratorLoaded ? 4 : 3, // 4 AI systems if orchestrator loaded
          riskScore: performance.riskScore,
          diversificationScore: performance.diversificationScore,
          lastUpdate: new Date()
        };
        
        // Log empire performance
        this.logEmpirePerformance(performance);
        
      } catch (error) {
        console.error('❌ QUANTUM EMPIRE: Status monitoring failed:', error.message);
      }
    }, 15000); // Update every 15 seconds
  }

  logEmpirePerformance(performance) {
    console.log('🎯 QUANTUM EMPIRE PERFORMANCE:');
    console.log(`   - Total APY: ${(performance.totalYield * 100).toFixed(1)}%`);
    console.log(`   - Total Profit: $${performance.totalProfit.toLocaleString()}`);
    console.log(`   - Total Trades: ${performance.totalTrades}`);
    console.log(`   - Risk Score: ${(performance.riskScore * 100).toFixed(1)}%`);
    console.log(`   - Diversification: ${(performance.diversificationScore * 100).toFixed(1)}%`);
    console.log(`   - Bot Allocations:`);
    console.log(`     * Beast Mode: ${(performance.botAllocations.mainnetBot * 100).toFixed(1)}%`);
    console.log(`     * Arbitrage: ${(performance.botAllocations.arbitrageBot * 100).toFixed(1)}%`);
    console.log(`     * DeFi: ${(performance.botAllocations.defiBot * 100).toFixed(1)}%`);
  }

  async stopEmpire() {
    console.log('🛑 QUANTUM EMPIRE: Stopping Ultimate Passive Income Machine...');
    
    this.isRunning = false;
    
    // Stop the orchestrator
    if (this.orchestrator) {
      await this.orchestrator.stop();
    }
    
    // Stop the web server
    if (this.server) {
      this.server.close();
    }
    
    this.empireStatus.launched = false;
    
    console.log('✅ QUANTUM EMPIRE: Stopped successfully!');
  }

  getEmpireStatus() {
    return {
      isRunning: this.isRunning,
      empireStatus: this.empireStatus,
      orchestratorStatus: this.orchestrator ? this.orchestrator.getEmpireStatus() : null
    };
  }
}

// Main execution function
async function main() {
  console.log('🚀 QUANTUM YIELD EMPIRE - ULTIMATE PASSIVE INCOME MACHINE! 🚀');
  console.log('🔥 Beast Mode Mainnet Bot');
  console.log('🔄 Quantum Arbitrage Bot');
  console.log('🏦 Quantum DeFi Strategies');
  console.log('🧠 AI Empire Commander');
  console.log('🌐 Professional Web Dashboard');
  console.log('📊 Real-time Performance Monitoring');
  console.log('');
  
  const launcher = new QuantumEmpireLauncher();
  
  try {
    // Launch the empire
    const result = await launcher.launchEmpire('mainnet');
    
    if (result.success) {
      console.log('🎉 QUANTUM YIELD EMPIRE LAUNCHED SUCCESSFULLY! 🎉');
      console.log(`🌐 Dashboard: ${result.dashboard}`);
      console.log('💰 Your passive income machine is now generating wealth!');
      console.log('');
      console.log('Press Ctrl+C to stop the empire');
      
      // Keep the process running
      process.on('SIGINT', async () => {
        console.log('\n🛑 Stopping Quantum Yield Empire...');
        await launcher.stopEmpire();
        process.exit(0);
      });
      
    } else {
      console.error('❌ QUANTUM EMPIRE LAUNCH FAILED:', result.error);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ QUANTUM EMPIRE: Critical error:', error.message);
    process.exit(1);
  }
}

// Export for use as module
module.exports = QuantumEmpireLauncher;

// Run if this file is executed directly
if (require.main === module) {
  main();
} 