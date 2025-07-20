#!/usr/bin/env node

const axios = require('axios');

console.log('🔍 CHECKING FOR EXISTING RENDER SERVICES! 🔍');

class ExistingServiceChecker {
  constructor() {
    this.potentialServices = [
      // Current Quantum Empire services
      { name: 'quantum-yield-empire', url: 'https://quantum-yield-empire.onrender.com' },
      { name: 'quantum-professional-website', url: 'https://quantum-professional-website.onrender.com' },
      { name: 'quantum-testnet-dashboard', url: 'https://quantum-testnet-dashboard.onrender.com' },
      { name: 'quantum-mainnet-dashboard', url: 'https://quantum-mainnet-dashboard.onrender.com' },
      { name: 'quantum-beast-mode-worker', url: 'https://quantum-beast-mode-worker.onrender.com' },
      
      // Possible old project variations
      { name: 'my-new-project', url: 'https://my-new-project.onrender.com' },
      { name: 'mynewproject', url: 'https://mynewproject.onrender.com' },
      { name: 'xrpl-bot', url: 'https://xrpl-bot.onrender.com' },
      { name: 'beast-mode', url: 'https://beast-mode.onrender.com' },
      { name: 'beast-mode-network', url: 'https://beast-mode-network.onrender.com' },
      { name: 'yield-empire', url: 'https://yield-empire.onrender.com' },
      { name: 'passive-income-bot', url: 'https://passive-income-bot.onrender.com' },
      { name: 'xrp-yield-bot', url: 'https://xrp-yield-bot.onrender.com' },
      
      // GitHub username variations
      { name: 'bustedglowsticks-app', url: 'https://bustedglowsticks-app.onrender.com' },
      { name: 'cascade-projects', url: 'https://cascade-projects.onrender.com' },
      
      // Common deployment names
      { name: 'main-app', url: 'https://main-app.onrender.com' },
      { name: 'production-app', url: 'https://production-app.onrender.com' },
      { name: 'test-deployment', url: 'https://test-deployment.onrender.com' }
    ];
    
    this.foundServices = [];
    this.conflictingServices = [];
  }

  async checkService(service) {
    try {
      console.log(`🔍 Checking ${service.name}...`);
      
      const response = await axios.get(service.url, {
        timeout: 8000,
        headers: {
          'User-Agent': 'Service-Conflict-Checker/1.0'
        }
      });
      
      if (response.status === 200) {
        console.log(`✅ FOUND: ${service.name} is ACTIVE`);
        
        this.foundServices.push({
          ...service,
          status: 'active',
          responseTime: response.duration || 'unknown',
          title: this.extractTitle(response.data)
        });
        
        // Check if it's a conflicting service
        if (this.isConflictingService(service, response.data)) {
          this.conflictingServices.push(service);
          console.log(`⚠️ CONFLICT: ${service.name} may conflict with new deployment`);
        }
        
        return true;
      }
      
    } catch (error) {
      if (error.response && error.response.status) {
        console.log(`⚠️ ${service.name}: HTTP ${error.response.status}`);
        
        this.foundServices.push({
          ...service,
          status: 'error',
          error: `HTTP ${error.response.status}`
        });
      } else if (error.code === 'ENOTFOUND') {
        console.log(`❌ ${service.name}: Not found`);
      } else {
        console.log(`❌ ${service.name}: ${error.message}`);
      }
      
      return false;
    }
  }

  extractTitle(htmlData) {
    try {
      const titleMatch = htmlData.match(/<title[^>]*>([^<]+)<\/title>/i);
      return titleMatch ? titleMatch[1].trim() : 'Unknown Title';
    } catch {
      return 'Unknown Title';
    }
  }

  isConflictingService(service, responseData) {
    // Check if the service contains quantum empire, xrpl, or similar content
    const conflictKeywords = [
      'quantum', 'empire', 'yield', 'xrpl', 'beast', 'mode', 
      'passive', 'income', 'arbitrage', 'defi', 'trading'
    ];
    
    const content = responseData.toLowerCase();
    const foundKeywords = conflictKeywords.filter(keyword => 
      content.includes(keyword) || service.name.toLowerCase().includes(keyword)
    );
    
    return foundKeywords.length >= 2; // If 2+ keywords match, likely a conflict
  }

  async checkAllServices() {
    console.log('🚀 Scanning for existing Render services...');
    console.log(`📊 Checking ${this.potentialServices.length} potential service URLs...\n`);
    
    // Check services in parallel (but with delay to avoid rate limiting)
    const results = [];
    for (let i = 0; i < this.potentialServices.length; i++) {
      const service = this.potentialServices[i];
      
      try {
        const result = await this.checkService(service);
        results.push(result);
        
        // Small delay to avoid overwhelming Render
        if (i < this.potentialServices.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.log(`❌ Error checking ${service.name}: ${error.message}`);
      }
    }
    
    return results;
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 EXISTING SERVICES REPORT');
    console.log('='.repeat(60));
    
    if (this.foundServices.length === 0) {
      console.log('✅ NO EXISTING SERVICES FOUND!');
      console.log('🎉 You can proceed with deployment without conflicts.');
      return;
    }
    
    console.log(`🔍 Found ${this.foundServices.length} existing services:\n`);
    
    this.foundServices.forEach(service => {
      console.log(`📋 ${service.name}:`);
      console.log(`   URL: ${service.url}`);
      console.log(`   Status: ${service.status}`);
      if (service.title) {
        console.log(`   Title: ${service.title}`);
      }
      if (service.error) {
        console.log(`   Error: ${service.error}`);
      }
      console.log('');
    });
    
    if (this.conflictingServices.length > 0) {
      console.log('⚠️ POTENTIAL CONFLICTS DETECTED:');
      console.log('================================\n');
      
      this.conflictingServices.forEach(service => {
        console.log(`❌ ${service.name} (${service.url})`);
      });
      
      console.log('\n🔧 RECOMMENDED ACTIONS:');
      console.log('1. 🗑️ Delete conflicting services from Render dashboard');
      console.log('2. 🔄 Or rename them to avoid conflicts');
      console.log('3. 📋 Update your new deployment service names if needed');
      console.log('4. 🚀 Then proceed with new deployment');
      
    } else {
      console.log('✅ NO CONFLICTS DETECTED!');
      console.log('🎉 Existing services won\'t interfere with new deployment.');
    }
    
    console.log('\n💡 NEXT STEPS:');
    console.log('1. 🌐 Visit https://dashboard.render.com to manage existing services');
    console.log('2. 🗑️ Delete any services you no longer need');
    console.log('3. 🚀 Proceed with Quantum Empire deployment');
  }

  async generateCleanupScript() {
    if (this.conflictingServices.length === 0) return;
    
    console.log('\n🧹 CLEANUP RECOMMENDATIONS:');
    console.log('============================');
    
    console.log('\n// Manual cleanup steps for Render dashboard:');
    this.conflictingServices.forEach((service, index) => {
      console.log(`${index + 1}. Delete service: ${service.name}`);
      console.log(`   URL: ${service.url}`);
      console.log(`   Go to: https://dashboard.render.com`);
      console.log(`   Find: ${service.name}`);
      console.log(`   Click: Settings → Delete Service`);
      console.log('');
    });
  }
}

// CLI functionality
async function main() {
  const checker = new ExistingServiceChecker();
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('🔍 Existing Services Checker');
    console.log('');
    console.log('Usage:');
    console.log('  node check-existing-services.js              - Check all services');
    console.log('  node check-existing-services.js --quick      - Quick check (fewer URLs)');
    console.log('  node check-existing-services.js --cleanup    - Generate cleanup script');
    return;
  }
  
  if (args.includes('--quick')) {
    // Only check the main quantum empire services
    checker.potentialServices = checker.potentialServices.slice(0, 5);
    console.log('🚀 Running quick check (5 services only)...\n');
  }
  
  try {
    await checker.checkAllServices();
    checker.generateReport();
    
    if (args.includes('--cleanup')) {
      await checker.generateCleanupScript();
    }
    
  } catch (error) {
    console.error('❌ Service check failed:', error.message);
  }
}

// Export for use as module
module.exports = ExistingServiceChecker;

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
} 