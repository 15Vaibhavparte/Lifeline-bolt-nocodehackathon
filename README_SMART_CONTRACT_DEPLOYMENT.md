# Algorand Smart Contract Deployment Guide

## 🎯 Quick Setup

### Step 1: Run the Deployment Script
```bash
npm run deploy-contract
```

### Step 2: Follow the Instructions
The script will guide you through:
1. **Account Generation**: Creates a new Algorand account if needed
2. **Funding**: Instructions to get free testnet ALGO
3. **Deployment**: Deploys the smart contract
4. **Configuration**: Automatically updates your `.env` file

## 📋 Detailed Steps

### 1. Generate Deployer Account
```bash
npm run deploy-contract
```

This will output:
```
📝 Generated new Algorand account:
Address: ABC123...XYZ789
Mnemonic: word1 word2 word3 ... word25

⚠️  IMPORTANT: Fund this account with testnet ALGO before deployment!
🔗 Get testnet ALGO from: https://testnet.algoexplorer.io/dispenser

💡 Add this to your .env file:
DEPLOYER_MNEMONIC="word1 word2 word3 ... word25"
```

### 2. Fund Your Account
1. Copy the generated address
2. Go to https://testnet.algoexplorer.io/dispenser
3. Paste the address and request testnet ALGO
4. Wait for the transaction to confirm

### 3. Add Mnemonic to .env
Add the deployer mnemonic to your `.env` file:
```bash
DEPLOYER_MNEMONIC="your 25 word mnemonic phrase here"
```

### 4. Deploy the Contract
Run the deployment script again:
```bash
npm run deploy-contract
```

Expected output:
```
🎉 Smart contract deployed successfully!
📋 Application ID: 123456789
🔗 View on AlgoExplorer: https://testnet.algoexplorer.io/application/123456789

💡 Add this to your .env file:
VITE_ALGORAND_APP_ID=123456789
```

## 🔧 What the Smart Contract Does

The deployed contract supports:
- **record_donation**: Records blood donations on-chain
- **verify_donor**: Verifies donor credentials
- **Global State**: Stores donation counts and verification data
- **Immutable Records**: All donations are permanently recorded

## 🎮 Testing the Integration

After deployment, test the blockchain features:

1. **Go to Profile page** → Blockchain tab
2. **Create Algorand Wallet** 
3. **Record a donation** on blockchain
4. **Create donation NFT**
5. **View on AlgoExplorer**

## 🔍 Verification

Check your deployment:
- **AlgoExplorer**: https://testnet.algoexplorer.io/application/YOUR_APP_ID
- **App State**: View global and local state
- **Transactions**: See all contract interactions

## 🚨 Troubleshooting

### "Insufficient funds" error
- Fund your deployer account with testnet ALGO
- Need at least 0.1 ALGO for deployment

### "Invalid mnemonic" error
- Check that mnemonic is exactly 25 words
- Ensure no extra spaces or characters

### "Compilation failed" error
- The TEAL code is embedded in the script
- Should work automatically with Algorand testnet

## 🎯 Production Deployment

For mainnet deployment:
1. Change network to `mainnet` in `.env`
2. Fund deployer account with real ALGO
3. Run deployment script
4. Update `VITE_ALGORAND_APP_ID` with mainnet app ID

## 📞 Support

If you encounter issues:
1. Check the AlgoExplorer links for transaction status
2. Verify account balances
3. Ensure testnet connectivity
4. Review console logs for detailed error messages

The smart contract is now ready for production use with immutable donation tracking!