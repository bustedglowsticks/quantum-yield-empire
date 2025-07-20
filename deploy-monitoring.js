#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');

console.log('🚀 QUANTUM EMPIRE DEPLOYMENT MONITOR! 🚀');

class DeploymentMonitor {
  constructor() {
    this.deploymentConfig = {
      services: {
        mainEmpire: {
          name: 'quantum-yield-empire',
          expectedUrl: 'https://quantum-yield-empire.onrender.com',
          healthEndpoint: '/health',
          priority: 1
        },
        professionalWebsite: {
          name: 'quantum-professional-website',
          expectedUrl: 'https://quantum-professional-website.onrender.com',
          healthEndpoint: '/health',
          priority: 2
        },
        testnetDashboard: {
          name: 'quantum-testnet-dashboard',
          expectedUrl: 'https://quantum-testnet-dashboard.onrender.com',
          healthEndpoint: '/health',
          priority: 3
        },
        mainnetDashboard: {
          name: 'quantum-mainnet-dashboard',
          expectedUrl: 'https://quantum-mainnet-dashboard.onrender.com',
          healthEndpoint: '/health',
          priority: 3
        },
        worker: {
          name: 'quantum-beast-mode-worker',
          expectedUrl: 'https://quantum-beast-mode-worker.onrender.com',
          healthEndpoint: '/health',
          priority: 4
        }
      },
      deployment: {
        status: 'pending',
        startTime: new Date(),
        services: {},
        logs: []
      }
    };
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message
    };
    
    this.deploymentConfig.deployment.logs.push(logEntry);
    
    const icon = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      deploy: '🚀'
    }[level] || 'ℹ️';
    
    console.log(`${icon} [${timestamp}] ${message}`);
  }

  async waitForService(serviceName, config, maxWaitTime = 600000) {
    this.log(`🔍 Waiting for ${serviceName} to become available...`, 'deploy');
    
    const startTime = Date.now();
    const checkInterval = 10000; // Check every 10 seconds
    let attempts = 0;
    
    while (Date.now() - startTime < maxWaitTime) {
      attempts++;
      
      try {
        this.log(`📡 Attempt ${attempts}: Checking ${config.expectedUrl}${config.healthEndpoint}`, 'info');
        
        const response = await axios.get(`${config.expectedUrl}${config.healthEndpoint}`, {
          timeout: 15000,
          headers: {
            'User-Agent': 'Quantum-Empire-Deployment-Monitor/1.0'
          }
        });
        
        if (response.status === 200) {
          const responseTime = Date.now() - startTime;
          this.log(`✅ ${serviceName} is LIVE! (${responseTime}ms)`, 'success');
          
          this.deploymentConfig.deployment.services[serviceName] = {
            status: 'live',
            url: config.expectedUrl,
            responseTime: responseTime,
            attempts: attempts,
            healthData: response.data
          };
          
          return true;
        }
        
      } catch (error) {
        this.log(`❌ ${serviceName} not ready: ${error.message}`, 'warning');
        
        // Check if it's a timeout vs connection error
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
          this.log(`🔄 ${serviceName} deployment still in progress...`, 'deploy');
        }
      }
      
      // Wait before next attempt
      this.log(`⏳ Waiting ${checkInterval/1000}s before next check...`, 'info');
      await new Promise(resolve => setTimeout(resolve, checkInterval));
    }
    
    this.log(`❌ ${serviceName} failed to become available within ${maxWaitTime/1000}s`, 'error');
    
    this.deploymentConfig.deployment.services[serviceName] = {
      status: 'failed',
      url: config.expectedUrl,
      attempts: attempts,
      error: 'Deployment timeout'
    };
    
    return false;
  }

  async monitorDeployment() {
    this.log('🚀 Starting Quantum Empire deployment monitoring...', 'deploy');
    this.log('🎯 Monitoring 5 services for successful deployment', 'info');
    
    this.deploymentConfig.deployment.status = 'monitoring';
    
    const services = Object.entries(this.deploymentConfig.services)
      .sort(([,a], [,b]) => a.priority - b.priority);
    
    let successfulDeployments = 0;
    let totalServices = services.length;
    
    // Monitor services in priority order
    for (const [serviceName, config] of services) {
      this.log(`🎯 Monitoring ${serviceName} (Priority ${config.priority})...`, 'deploy');
      
      const isLive = await this.waitForService(serviceName, config);
      
      if (isLive) {
        successfulDeployments++;
        this.log(`🎉 ${serviceName} deployed successfully! (${successfulDeployments}/${totalServices})`, 'success');
        
        // Test additional endpoints for main empire
        if (serviceName === 'mainEmpire') {
          await this.testMainEmpireEndpoints(config.expectedUrl);
        }
      } else {
        this.log(`💥 ${serviceName} deployment failed!`, 'error');
      }
      
      console.log(''); // Add spacing between services
    }
    
    // Final deployment summary
    this.generateDeploymentSummary(successfulDeployments, totalServices);
    
    return successfulDeployments === totalServices;
  }

  async testMainEmpireEndpoints(baseUrl) {
    this.log('🧪 Testing main empire API endpoints...', 'deploy');
    
    const endpoints = [
      '/api/empire-status',
      '/api/bot-performance',
      '/api/wallet-info'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${baseUrl}${endpoint}`, {
          timeout: 10000
        });
        
        if (response.status === 200) {
          this.log(`✅ API endpoint ${endpoint} working`, 'success');
        }
      } catch (error) {
        this.log(`⚠️ API endpoint ${endpoint} not ready: ${error.message}`, 'warning');
      }
    }
  }

  generateDeploymentSummary(successful, total) {
    const endTime = new Date();
    const duration = endTime - this.deploymentConfig.deployment.startTime;
    
    console.log('\n' + '='.repeat(60));
    this.log('📊 DEPLOYMENT SUMMARY', 'deploy');
    console.log('='.repeat(60));
    
    this.log(`🎯 Services Deployed: ${successful}/${total}`, 'info');
    this.log(`⏱️ Total Time: ${Math.round(duration/1000)}s`, 'info');
    
    if (successful === total) {
      this.log('🎉 DEPLOYMENT SUCCESSFUL! Your Quantum Empire is LIVE!', 'success');
      this.log('💰 Your passive income machine is now operational!', 'success');
      
      console.log('\n🌐 SERVICE URLS:');
      Object.entries(this.deploymentConfig.deployment.services).forEach(([name, config]) => {
        if (config.status === 'live') {
          console.log(`   ✅ ${name}: ${config.url}`);
        }
      });
      
      console.log('\n📊 NEXT STEPS:');
      console.log('   1. 🔍 Check each service URL above');
      console.log('   2. 📈 Monitor empire performance');  
      console.log('   3. 💰 Watch your passive income grow!');
      console.log('   4. 🤖 Consider enabling AI features later');
      
    } else {
      this.log('⚠️ PARTIAL DEPLOYMENT - Some services failed', 'warning');
      
      console.log('\n❌ FAILED SERVICES:');
      Object.entries(this.deploymentConfig.deployment.services).forEach(([name, config]) => {
        if (config.status === 'failed') {
          console.log(`   ❌ ${name}: ${config.error}`);
        }
      });
      
      console.log('\n🔧 TROUBLESHOOTING:');
      console.log('   1. Check Render dashboard for build logs');
      console.log('   2. Verify environment variables are set');
      console.log('   3. Check repository permissions');
      console.log('   4. Retry deployment if needed');
    }
    
    // Save deployment report
    this.saveDeploymentReport();
  }

  saveDeploymentReport() {
    const report = {
      deployment: this.deploymentConfig.deployment,
      services: this.deploymentConfig.services,
      generatedAt: new Date()
    };
    
    const filename = `deployment-report-${Date.now()}.json`;
    
    try {
      fs.writeFileSync(filename, JSON.stringify(report, null, 2));
      this.log(`📋 Deployment report saved: ${filename}`, 'success');
    } catch (error) {
      this.log(`❌ Failed to save deployment report: ${error.message}`, 'error');
    }
  }

  async startContinuousMonitoring() {
    this.log('🔄 Starting continuous post-deployment monitoring...', 'deploy');
    
    // First run full monitoring
    const QuantumEmpireMonitor = require('./monitor-empire.js');
    const monitor = new QuantumEmpireMonitor();
    
    try {
      await monitor.runFullMonitoring();
      this.log('✅ Initial monitoring check completed', 'success');
      
      // Start continuous monitoring every 5 minutes
      this.log('🔄 Starting continuous monitoring (5-minute intervals)...', 'deploy');
      await monitor.startContinuousMonitoring(5);
      
    } catch (error) {
      this.log(`❌ Monitoring setup failed: ${error.message}`, 'error');
    }
  }

  async deploymentWizard() {
    console.log('\n🧙‍♂️ QUANTUM EMPIRE DEPLOYMENT WIZARD');
    console.log('=====================================\n');
    
    console.log('📋 DEPLOYMENT CHECKLIST:');
    console.log('   ✅ GitHub repository created: quantum-yield-empire');
    console.log('   ✅ render.yaml configured for 5 services');
    console.log('   ✅ Production code pushed to master branch');
    console.log('   ✅ Environment variables guide ready');
    console.log('   ✅ Monitoring system prepared\n');
    
    console.log('🎯 DEPLOYMENT STEPS:');
    console.log('   1. 🌐 Go to https://render.com');
    console.log('   2. 🔗 Connect your GitHub account');
    console.log('   3. 📋 Create new Blueprint');
    console.log('   4. 📁 Select quantum-yield-empire repository');
    console.log('   5. ⚙️ Configure environment variables (see RENDER_ENV_VARS.md)');
    console.log('   6. 🚀 Deploy all services');
    console.log('   7. 📊 Run this monitoring script\n');
    
    console.log('💡 MONITORING COMMANDS:');
    console.log('   📡 Monitor deployment: node deploy-monitoring.js monitor');
    console.log('   🔍 Check status: node monitor-empire.js check');
    console.log('   📊 Full monitoring: node monitor-empire.js monitor 5\n');
    
    console.log('🎉 Ready to deploy your Quantum Empire!');
    console.log('💰 Your passive income machine awaits...\n');
  }
}

// CLI functionality
async function main() {
  const monitor = new DeploymentMonitor();
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === 'wizard') {
    // Show deployment wizard
    await monitor.deploymentWizard();
  } else if (args[0] === 'monitor') {
    // Monitor active deployment
    const success = await monitor.monitorDeployment();
    
    if (success && args[1] === 'continuous') {
      // Start continuous monitoring after successful deployment
      await monitor.startContinuousMonitoring();
    }
  } else if (args[0] === 'test') {
    // Test single service
    const serviceName = args[1] || 'mainEmpire';
    const config = monitor.deploymentConfig.services[serviceName];
    
    if (config) {
      await monitor.waitForService(serviceName, config, 60000);
    } else {
      console.log(`❌ Unknown service: ${serviceName}`);
      console.log('Available services:', Object.keys(monitor.deploymentConfig.services).join(', '));
    }
  } else {
    console.log('🚀 Quantum Empire Deployment Monitor');
    console.log('');
    console.log('Usage:');
    console.log('  node deploy-monitoring.js wizard              - Show deployment guide');
    console.log('  node deploy-monitoring.js monitor             - Monitor deployment');
    console.log('  node deploy-monitoring.js monitor continuous  - Monitor + start continuous');
    console.log('  node deploy-monitoring.js test [service]      - Test specific service');
  }
}

// Export for use as module
module.exports = DeploymentMonitor;

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
} 