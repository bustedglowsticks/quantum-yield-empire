const axios = require('axios');

console.log('📊 QUANTUM EMPIRE MONITORING SYSTEM! 📊');

class QuantumEmpireMonitor {
  constructor() {
    this.services = {
      mainEmpire: process.env.MAIN_EMPIRE_URL || 'https://quantum-yield-empire.onrender.com',
      professionalWebsite: process.env.PROFESSIONAL_URL || 'https://quantum-professional-website.onrender.com',
      testnetDashboard: process.env.TESTNET_URL || 'https://quantum-testnet-dashboard.onrender.com',
      mainnetDashboard: process.env.MAINNET_URL || 'https://quantum-mainnet-dashboard.onrender.com'
    };
    this.monitoringData = [];
    this.isRunning = false;
  }

  async checkServiceHealth(serviceName, url) {
    try {
      console.log(`🔍 Checking ${serviceName}...`);
      
      const startTime = Date.now();
      const response = await axios.get(`${url}/health`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Quantum-Empire-Monitor/1.0'
        }
      });
      const responseTime = Date.now() - startTime;

      const status = {
        service: serviceName,
        url: url,
        status: 'healthy',
        responseTime: responseTime,
        timestamp: new Date(),
        data: response.data
      };

      console.log(`✅ ${serviceName}: ${response.status} (${responseTime}ms)`);
      return status;

    } catch (error) {
      const status = {
        service: serviceName,
        url: url,
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date()
      };

      console.log(`❌ ${serviceName}: ${error.message}`);
      return status;
    }
  }

  async getEmpireStatus() {
    try {
      console.log('📈 Fetching empire performance data...');
      
      const response = await axios.get(`${this.services.mainEmpire}/api/empire-status`, {
        timeout: 10000
      });

      if (response.data.success) {
        const empire = response.data.empire;
        console.log('💰 EMPIRE PERFORMANCE:');
        console.log(`   - Total APY: ${(empire.totalEmpireYield * 100).toFixed(1)}%`);
        console.log(`   - Total Profit: $${empire.empireMetrics.totalProfit.toLocaleString()}`);
        console.log(`   - Active Bots: ${empire.empireMetrics.totalTrades || 0}`);
        console.log(`   - Network: ${empire.currentNetwork || 'Unknown'}`);
        console.log(`   - Wallet: ${empire.walletAddress || 'Not connected'}`);
        console.log(`   - Balance: ${empire.balance || 0} XRP`);
        
        return empire;
      } else {
        console.log('⚠️ Empire status unavailable');
        return null;
      }

    } catch (error) {
      console.log(`❌ Failed to get empire status: ${error.message}`);
      return null;
    }
  }

  async getBotPerformance() {
    try {
      console.log('🤖 Fetching bot performance data...');
      
      const response = await axios.get(`${this.services.mainEmpire}/api/bot-performance`, {
        timeout: 10000
      });

      if (response.data.success) {
        const performance = response.data.performance;
        console.log('🎯 BOT PERFORMANCE:');
        console.log(`   - Risk Score: ${(performance.riskScore * 100).toFixed(1)}%`);
        console.log(`   - Diversification: ${(performance.diversificationScore * 100).toFixed(1)}%`);
        console.log(`   - Bot Allocations:`);
        console.log(`     * Beast Mode: ${(performance.botAllocations.mainnetBot * 100).toFixed(1)}%`);
        console.log(`     * Arbitrage: ${(performance.botAllocations.arbitrageBot * 100).toFixed(1)}%`);
        console.log(`     * DeFi: ${(performance.botAllocations.defiBot * 100).toFixed(1)}%`);
        
        return performance;
      } else {
        console.log('⚠️ Bot performance unavailable');
        return null;
      }

    } catch (error) {
      console.log(`❌ Failed to get bot performance: ${error.message}`);
      return null;
    }
  }

  async getWalletInfo() {
    try {
      console.log('💰 Fetching wallet information...');
      
      const response = await axios.get(`${this.services.mainEmpire}/api/wallet-info`, {
        timeout: 10000
      });

      if (response.data.success) {
        const wallet = response.data.wallet;
        console.log('🔑 WALLET INFO:');
        console.log(`   - Address: ${wallet.address}`);
        console.log(`   - Balance: ${wallet.balance} XRP`);
        console.log(`   - Network: ${wallet.network}`);
        console.log(`   - Recent Transactions: ${wallet.recentTransactions.length}`);
        
        return wallet;
      } else {
        console.log('⚠️ Wallet info unavailable');
        return null;
      }

    } catch (error) {
      console.log(`❌ Failed to get wallet info: ${error.message}`);
      return null;
    }
  }

  async runFullMonitoring() {
    console.log('🚀 STARTING FULL EMPIRE MONITORING...');
    console.log('=' * 60);

    const monitoringResult = {
      timestamp: new Date(),
      services: {},
      empire: null,
      botPerformance: null,
      wallet: null,
      overallHealth: 'healthy'
    };

    // Check all services
    for (const [serviceName, url] of Object.entries(this.services)) {
      const serviceStatus = await this.checkServiceHealth(serviceName, url);
      monitoringResult.services[serviceName] = serviceStatus;
      
      if (serviceStatus.status === 'unhealthy') {
        monitoringResult.overallHealth = 'degraded';
      }
    }

    console.log('');

    // Get detailed empire data
    monitoringResult.empire = await this.getEmpireStatus();
    console.log('');
    
    monitoringResult.botPerformance = await this.getBotPerformance();
    console.log('');
    
    monitoringResult.wallet = await this.getWalletInfo();
    console.log('');

    // Store monitoring data
    this.monitoringData.push(monitoringResult);
    
    // Keep only last 100 monitoring records
    if (this.monitoringData.length > 100) {
      this.monitoringData.shift();
    }

    // Print summary
    this.printMonitoringSummary(monitoringResult);

    return monitoringResult;
  }

  printMonitoringSummary(result) {
    console.log('📊 MONITORING SUMMARY:');
    console.log('=' * 40);
    
    // Service health
    const healthyServices = Object.values(result.services).filter(s => s.status === 'healthy').length;
    const totalServices = Object.keys(result.services).length;
    console.log(`🏥 Service Health: ${healthyServices}/${totalServices} healthy`);
    
    // Empire status
    if (result.empire) {
      console.log(`💰 Empire APY: ${(result.empire.totalEmpireYield * 100).toFixed(1)}%`);
      console.log(`🌐 Network: ${result.empire.currentNetwork || 'Unknown'}`);
      console.log(`💎 Balance: ${result.empire.balance || 0} XRP`);
    }
    
    // Overall health
    console.log(`🎯 Overall Health: ${result.overallHealth.toUpperCase()}`);
    console.log(`⏰ Last Check: ${result.timestamp.toLocaleString()}`);
    console.log('=' * 40);
  }

  async startContinuousMonitoring(intervalMinutes = 5) {
    console.log(`🔄 Starting continuous monitoring (every ${intervalMinutes} minutes)...`);
    
    this.isRunning = true;
    
    // Initial monitoring
    await this.runFullMonitoring();
    
    // Set up interval monitoring
    const intervalMs = intervalMinutes * 60 * 1000;
    const monitoringInterval = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(monitoringInterval);
        return;
      }
      
      console.log('\n🔔 Running scheduled monitoring check...');
      await this.runFullMonitoring();
      
    }, intervalMs);

    console.log(`✅ Continuous monitoring started! Press Ctrl+C to stop.`);
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping monitoring...');
      this.isRunning = false;
      clearInterval(monitoringInterval);
      console.log('✅ Monitoring stopped successfully!');
      process.exit(0);
    });
  }

  async checkDeploymentStatus() {
    console.log('🚀 CHECKING DEPLOYMENT STATUS...');
    
    const results = await this.runFullMonitoring();
    
    // Analyze deployment health
    const healthyServices = Object.values(results.services).filter(s => s.status === 'healthy').length;
    const totalServices = Object.keys(results.services).length;
    
    if (healthyServices === totalServices) {
      console.log('🎉 DEPLOYMENT STATUS: FULLY OPERATIONAL!');
      console.log('✅ All services are healthy and responding');
      
      if (results.empire && results.empire.totalEmpireYield > 0) {
        console.log('💰 Empire is generating yield successfully!');
        console.log(`🎯 Current APY: ${(results.empire.totalEmpireYield * 100).toFixed(1)}%`);
      }
      
      return 'success';
    } else {
      console.log('⚠️ DEPLOYMENT STATUS: PARTIAL DEPLOYMENT');
      console.log(`❌ ${totalServices - healthyServices} services are unhealthy`);
      
      // Show which services are down
      Object.entries(results.services).forEach(([name, status]) => {
        if (status.status === 'unhealthy') {
          console.log(`❌ ${name}: ${status.error}`);
        }
      });
      
      return 'partial';
    }
  }

  generateReport() {
    if (this.monitoringData.length === 0) {
      console.log('❌ No monitoring data available');
      return null;
    }

    const latest = this.monitoringData[this.monitoringData.length - 1];
    const report = {
      generatedAt: new Date(),
      monitoringPeriod: {
        start: this.monitoringData[0].timestamp,
        end: latest.timestamp,
        dataPoints: this.monitoringData.length
      },
      serviceHealth: latest.services,
      currentPerformance: {
        empire: latest.empire,
        botPerformance: latest.botPerformance,
        wallet: latest.wallet
      },
      trends: this.calculateTrends()
    };

    console.log('📋 EMPIRE MONITORING REPORT GENERATED');
    console.log(`📅 Period: ${report.monitoringPeriod.start.toLocaleDateString()} - ${report.monitoringPeriod.end.toLocaleDateString()}`);
    console.log(`📊 Data Points: ${report.monitoringPeriod.dataPoints}`);
    
    return report;
  }

  calculateTrends() {
    if (this.monitoringData.length < 2) return null;

    const recent = this.monitoringData.slice(-10); // Last 10 data points
    const yields = recent.map(d => d.empire?.totalEmpireYield || 0).filter(y => y > 0);
    
    if (yields.length < 2) return null;

    const avgYield = yields.reduce((sum, y) => sum + y, 0) / yields.length;
    const trend = yields[yields.length - 1] > yields[0] ? 'increasing' : 'decreasing';
    
    return {
      averageYield: avgYield,
      yieldTrend: trend,
      dataPoints: yields.length
    };
  }
}

// CLI functionality
async function main() {
  const monitor = new QuantumEmpireMonitor();
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === 'check') {
    // Single monitoring check
    await monitor.checkDeploymentStatus();
  } else if (args[0] === 'monitor') {
    // Continuous monitoring
    const interval = parseInt(args[1]) || 5;
    await monitor.startContinuousMonitoring(interval);
  } else if (args[0] === 'status') {
    // Empire status only
    await monitor.getEmpireStatus();
  } else if (args[0] === 'wallet') {
    // Wallet info only
    await monitor.getWalletInfo();
  } else if (args[0] === 'report') {
    // Generate report
    await monitor.runFullMonitoring();
    const report = monitor.generateReport();
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log('Usage:');
    console.log('  node monitor-empire.js check         - Check deployment status');
    console.log('  node monitor-empire.js monitor [min] - Start continuous monitoring');
    console.log('  node monitor-empire.js status        - Get empire status');
    console.log('  node monitor-empire.js wallet        - Get wallet info');
    console.log('  node monitor-empire.js report        - Generate full report');
  }
}

// Export for use as module
module.exports = QuantumEmpireMonitor;

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
} 