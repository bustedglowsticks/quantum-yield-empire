const { Client, Wallet } = require('xrpl');

console.log('🌐 QUANTUM NETWORK CONNECTOR - XRPL INTEGRATION! 🌐');

class NetworkConnector {
  constructor() {
    this.client = null;
    this.wallet = null;
    this.isConnected = false;
    this.currentNetwork = null;
    this.connectionAttempts = 0;
    this.maxRetries = 5;
  }

  async connect(networkName = 'testnet', walletSeed = null) {
    console.log(`🌐 NETWORK CONNECTOR: Connecting to ${networkName}...`);
    
    try {
      // Determine server URL based on network
      const serverUrl = this.getServerUrl(networkName);
      
      // Create XRPL client
      this.client = new Client(serverUrl);
      
      // Connect to the network
      await this.client.connect();
      this.isConnected = true;
      this.currentNetwork = networkName;
      
      console.log(`✅ NETWORK CONNECTOR: Connected to ${networkName}!`);
      
      // Initialize wallet
      await this.initializeWallet(walletSeed);
      
      return {
        success: true,
        network: networkName,
        wallet: this.wallet.address,
        serverUrl: serverUrl
      };
      
    } catch (error) {
      console.error(`❌ NETWORK CONNECTOR: Connection to ${networkName} failed:`, error.message);
      
      this.connectionAttempts++;
      if (this.connectionAttempts < this.maxRetries) {
        console.log(`🔄 NETWORK CONNECTOR: Retrying connection (${this.connectionAttempts}/${this.maxRetries})...`);
        await this.delay(2000); // Wait 2 seconds before retry
        return this.connect(networkName, walletSeed);
      }
      
      throw error;
    }
  }

  getServerUrl(networkName) {
    const servers = {
      'mainnet': 'wss://xrplcluster.com',
      'testnet': 'wss://s.altnet.rippletest.net:51233',
      'devnet': 'wss://s.devnet.rippletest.net:51233'
    };
    
    return servers[networkName] || servers['testnet'];
  }

  async initializeWallet(walletSeed = null) {
    try {
      if (walletSeed) {
        console.log('🔑 NETWORK CONNECTOR: Using provided wallet seed...');
        this.wallet = Wallet.fromSeed(walletSeed);
      } else {
        console.log('🔑 NETWORK CONNECTOR: Generating new wallet...');
        this.wallet = Wallet.generate();
        
        // For testnet, fund the wallet
        if (this.currentNetwork === 'testnet') {
          await this.fundTestnetWallet();
        }
      }
      
      console.log(`✅ NETWORK CONNECTOR: Wallet initialized: ${this.wallet.address}`);
      
    } catch (error) {
      console.error('❌ NETWORK CONNECTOR: Wallet initialization failed:', error.message);
      throw error;
    }
  }

  async fundTestnetWallet() {
    try {
      console.log('💰 NETWORK CONNECTOR: Funding testnet wallet...');
      
      // Use XRPL testnet faucet
      const fundResult = await this.client.fundWallet(this.wallet);
      
      if (fundResult) {
        console.log('✅ NETWORK CONNECTOR: Testnet wallet funded successfully!');
        console.log(`💰 Balance: ${await this.getBalance()} XRP`);
      }
      
    } catch (error) {
      console.warn('⚠️ NETWORK CONNECTOR: Testnet funding failed (wallet may already be funded):', error.message);
      // Continue anyway - wallet might already have funds
    }
  }

  async getBalance() {
    if (!this.isConnected || !this.wallet) {
      return 0;
    }
    
    try {
      const response = await this.client.request({
        command: 'account_info',
        account: this.wallet.address,
        ledger_index: 'validated'
      });
      
      // Convert from drops to XRP
      const balance = Number(response.result.account_data.Balance) / 1000000;
      return balance;
      
    } catch (error) {
      console.error('❌ NETWORK CONNECTOR: Failed to get balance:', error.message);
      return 0;
    }
  }

  async submitTransaction(transaction) {
    if (!this.isConnected || !this.wallet) {
      throw new Error('Not connected to network or wallet not initialized');
    }
    
    try {
      console.log('📤 NETWORK CONNECTOR: Submitting transaction...');
      
      // Prepare and sign transaction
      const prepared = await this.client.autofill(transaction);
      const signed = this.wallet.sign(prepared);
      
      // Submit transaction
      const result = await this.client.submitAndWait(signed.tx_blob);
      
      console.log('✅ NETWORK CONNECTOR: Transaction submitted successfully!');
      console.log(`🔗 Transaction hash: ${result.result.hash}`);
      
      return result;
      
    } catch (error) {
      console.error('❌ NETWORK CONNECTOR: Transaction failed:', error.message);
      throw error;
    }
  }

  async getAccountTransactions(limit = 10) {
    if (!this.isConnected || !this.wallet) {
      return [];
    }
    
    try {
      const response = await this.client.request({
        command: 'account_tx',
        account: this.wallet.address,
        limit: limit,
        ledger_index: 'validated'
      });
      
      return response.result.transactions || [];
      
    } catch (error) {
      console.error('❌ NETWORK CONNECTOR: Failed to get transactions:', error.message);
      return [];
    }
  }

  async getServerInfo() {
    if (!this.isConnected) {
      return null;
    }
    
    try {
      const response = await this.client.request({
        command: 'server_info'
      });
      
      return response.result.info;
      
    } catch (error) {
      console.error('❌ NETWORK CONNECTOR: Failed to get server info:', error.message);
      return null;
    }
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      currentNetwork: this.currentNetwork,
      walletAddress: this.wallet ? this.wallet.address : null,
      connectionAttempts: this.connectionAttempts,
      client: this.client ? 'initialized' : 'not initialized'
    };
  }

  async disconnect() {
    console.log('🛑 NETWORK CONNECTOR: Disconnecting...');
    
    if (this.client && this.isConnected) {
      await this.client.disconnect();
    }
    
    this.isConnected = false;
    this.currentNetwork = null;
    this.connectionAttempts = 0;
    
    console.log('✅ NETWORK CONNECTOR: Disconnected successfully!');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = NetworkConnector; 