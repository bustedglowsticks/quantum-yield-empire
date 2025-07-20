# 🔐 Render Environment Variables Setup

## 🎯 Required Environment Variables

### **For Main Empire Service (quantum-yield-empire):**

```bash
# Network Configuration
NETWORK=mainnet
NODE_ENV=production

# Optional: Wallet Configuration
# Leave blank to auto-generate wallet, or provide your own seed
WALLET_SEED=

# Performance Optimization
NODE_OPTIONS=--max-old-space-size=1024

# API Configuration
PORT=3000
```

### **For Professional Website Service:**

```bash
NODE_ENV=production
PORT=3001
```

### **For Dashboard Services:**

```bash
# Testnet Dashboard
NETWORK=testnet
NODE_ENV=production
PORT=3002

# Mainnet Dashboard  
NETWORK=mainnet
NODE_ENV=production
PORT=3003
```

### **For Worker Service:**

```bash
NETWORK=mainnet
NODE_ENV=production
WORKER_MODE=true
```

## 🔧 How to Set Environment Variables in Render:

### **Method 1: During Blueprint Deployment**
1. When deploying the blueprint, Render will show environment variables
2. Add the variables listed above for each service
3. **IMPORTANT**: Leave `WALLET_SEED` blank for auto-generation

### **Method 2: After Deployment**
1. Go to your Render Dashboard
2. Click on each service
3. Go to "Environment" tab
4. Add/edit variables as needed
5. Click "Save Changes" (service will redeploy)

## 🔐 Security Recommendations:

### **Wallet Seed (CRITICAL):**
- **For testing**: Leave `WALLET_SEED` blank (auto-generates wallet)
- **For production with existing wallet**: 
  ```bash
  WALLET_SEED=your_actual_wallet_seed_here
  ```
- **⚠️ NEVER share or commit wallet seeds to git!**

### **Network Selection:**
- **mainnet**: Real XRP network (production)
- **testnet**: Test network (for development)

## 🎯 Service URLs After Deployment:

Your services will be available at:

```bash
# Main Empire Dashboard
https://quantum-yield-empire.onrender.com

# Professional Website  
https://quantum-professional-website.onrender.com

# Testnet Dashboard
https://quantum-testnet-dashboard.onrender.com

# Mainnet Dashboard
https://quantum-mainnet-dashboard.onrender.com

# Worker Service (background processing)
https://quantum-beast-mode-worker.onrender.com
```

## 🚀 Quick Setup Commands:

### **Copy these environment variables for each service:**

**Main Empire:**
```
NETWORK=mainnet
NODE_ENV=production
WALLET_SEED=
NODE_OPTIONS=--max-old-space-size=1024
PORT=3000
```

**Professional Website:**
```
NODE_ENV=production
PORT=3001
```

**Testnet Dashboard:**
```
NETWORK=testnet
NODE_ENV=production
PORT=3002
```

**Mainnet Dashboard:**
```
NETWORK=mainnet
NODE_ENV=production
PORT=3003
```

**Worker Service:**
```
NETWORK=mainnet
NODE_ENV=production
WORKER_MODE=true
```

## 🔄 Updating Environment Variables:

1. **During deployment**: Can cause temporary downtime
2. **Best practice**: Set all variables before first deployment
3. **For wallet changes**: Stop service → Update → Restart

## 🚨 Troubleshooting:

### **Service Won't Start:**
- Check all required environment variables are set
- Ensure `NODE_ENV=production` is set
- Verify `PORT` matches render.yaml configuration

### **Wallet Issues:**
- If using existing wallet, verify `WALLET_SEED` is correct
- For new wallet, leave `WALLET_SEED` blank
- Check network matches wallet (mainnet/testnet)

### **Performance Issues:**
- Increase `NODE_OPTIONS=--max-old-space-size=2048` for more memory
- Monitor service logs for memory warnings

---

**Ready to deploy? These environment variables will ensure your Quantum Yield Empire runs smoothly on Render!** 🚀 