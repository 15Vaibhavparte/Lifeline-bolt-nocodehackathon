import algosdk from 'algosdk';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env file
function loadEnvFile() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const envPath = join(__dirname, '..', '.env');
    
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');
        
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const [key, ...valueParts] = trimmedLine.split('=');
                if (key && valueParts.length > 0) {
                    let value = valueParts.join('=');
                    // Remove quotes if present
                    if ((value.startsWith('"') && value.endsWith('"')) || 
                        (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    process.env[key.trim()] = value;
                }
            }
        }
        console.log('✅ Loaded environment variables from .env file');
    } else {
        console.log('⚠️  No .env file found');
    }
}

// Enhanced wait for confirmation with better error handling
async function waitForConfirmationWithRetry(algodClient, txId, maxRounds = 10) {
    console.log(`⏳ Waiting for confirmation (up to ${maxRounds} rounds)...`);
    console.log(`🔗 Transaction ID: ${txId}`);
    
    // Validate transaction ID format
    if (!txId || typeof txId !== 'string' || txId.length !== 52) {
        throw new Error(`Invalid transaction ID format: ${txId}`);
    }
    
    let currentRound = (await algodClient.status().do())['last-round'];
    const startRound = currentRound;
    
    while (currentRound < startRound + maxRounds) {
        try {
            console.log(`⏳ Checking round ${currentRound}...`);
            
            const pendingInfo = await algodClient.pendingTransactionInformation(txId).do();
            
            if (pendingInfo['confirmed-round'] !== null && pendingInfo['confirmed-round'] > 0) {
                console.log(`✅ Transaction confirmed in round ${pendingInfo['confirmed-round']}`);
                return pendingInfo;
            }
            
            if (pendingInfo['pool-error'] != null && pendingInfo['pool-error'].length > 0) {
                throw new Error(`Transaction failed: ${pendingInfo['pool-error']}`);
            }
            
            // Wait for next round
            await algodClient.statusAfterBlock(currentRound).do();
            currentRound++;
            
        } catch (error) {
            if (error.message.includes('Transaction not found') || 
                error.message.includes('no valid transaction ID')) {
                console.log(`⏳ Transaction not found in round ${currentRound}, waiting...`);
                await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
                currentRound++;
                continue;
            }
            
            // Re-throw other errors
            throw error;
        }
    }
    
    throw new Error(`Transaction not confirmed after ${maxRounds} rounds. Check AlgoExplorer: https://testnet.algoexplorer.io/tx/${txId}`);
}

// Smart contract in TEAL (Algorand's smart contract language)
const approvalProgram = `
#pragma version 8

// This is a simple donation tracking smart contract
// It allows recording donations and verifying donors

txn ApplicationID
int 0
==
bnz main

// Handle application calls
txn OnCompletion
int NoOp
==
bnz handle_noop

// Default: approve creation
int 1
return

handle_noop:
    // Get the first application argument
    txna ApplicationArgs 0
    
    // Check if it's "record_donation"
    byte "record_donation"
    ==
    bnz record_donation
    
    // Check if it's "verify_donor"
    byte "verify_donor"
    ==
    bnz verify_donor
    
    // Default case
    int 1
    return

record_donation:
    // Record a donation (simplified)
    // In a real implementation, you'd store the donation data
    // For now, just approve the transaction
    int 1
    return

verify_donor:
    // Verify a donor (simplified)
    // In a real implementation, you'd check donor credentials
    // For now, just approve the transaction
    int 1
    return

main:
    // Application creation
    int 1
    return
`;

const clearProgram = `
#pragma version 8
// Clear state program - always approve
int 1
return
`;

async function deployContract() {
    try {
        console.log('🚀 Starting Algorand smart contract deployment...');
        
        // Load environment variables first
        loadEnvFile();
        
        // Initialize Algorand client with better configuration
        const algodClient = new algosdk.Algodv2('', 'https://testnet-api.algonode.cloud');
        
        // Test connection first
        console.log('🔗 Testing Algorand network connection...');
        try {
            const status = await algodClient.status().do();
            console.log(`✅ Connected to Algorand testnet (round ${status['last-round']})`);
        } catch (error) {
            console.log('❌ Failed to connect to Algorand network');
            console.log('💡 Please check your internet connection and try again');
            console.log('Error:', error.message);
            return;
        }
        
        // Check if we have a deployer account
        const deployerMnemonic = process.env.DEPLOYER_MNEMONIC;
        console.log('🔍 Checking for DEPLOYER_MNEMONIC...');
        
        if (!deployerMnemonic) {
            console.log('⚠️  No DEPLOYER_MNEMONIC found in environment variables.');
            console.log('📝 Generating a new account...');
            
            // Generate a new account for deployment
            const account = algosdk.generateAccount();
            const mnemonic = algosdk.secretKeyToMnemonic(account.sk);
            
            console.log('');
            console.log('🎯 STEP 1: Generated new Algorand account');
            console.log('Address:', account.addr);
            console.log('');
            console.log('🎯 STEP 2: Fund this account with testnet ALGO');
            console.log('🔗 Visit: https://testnet.algonode.cloud/dispenser');
            console.log('📋 Paste this address:', account.addr);
            console.log('💰 Request 10 testnet ALGO');
            console.log('');
            console.log('🎯 STEP 3: Add this mnemonic to your .env file');
            console.log('📝 Add this exact line to .env:');
            console.log(`DEPLOYER_MNEMONIC="${mnemonic}"`);
            console.log('');
            console.log('🎯 STEP 4: Run the command again');
            console.log('⚡ npm run deploy-contract');
            console.log('');
            console.log('⚠️  IMPORTANT: Save the mnemonic safely - you\'ll need it!');
            return;
        }
        
        console.log('✅ Found DEPLOYER_MNEMONIC in environment');
        
        // Restore account from mnemonic
        let deployerAccount;
        try {
            deployerAccount = algosdk.mnemonicToSecretKey(deployerMnemonic);
            console.log('👤 Using deployer account:', deployerAccount.addr);
        } catch (error) {
            console.log('❌ Invalid mnemonic format. Please check your .env file.');
            console.log('💡 Make sure the mnemonic is exactly 25 words separated by spaces');
            console.log('📝 Format: DEPLOYER_MNEMONIC="word1 word2 word3 ... word25"');
            return;
        }
        
        // Check account balance
        console.log('💰 Checking account balance...');
        try {
            const accountInfo = await algodClient.accountInformation(deployerAccount.addr).do();
            const balance = accountInfo.amount / 1000000; // Convert microAlgos to Algos
            console.log('💰 Account balance:', balance, 'ALGO');
            
            if (balance < 0.1) {
                console.log('❌ Insufficient balance! Need at least 0.1 ALGO for deployment.');
                console.log('🔗 Get testnet ALGO from: https://testnet.algonode.cloud/dispenser');
                console.log('📋 Your address:', deployerAccount.addr);
                return;
            }
        } catch (error) {
            console.log('❌ Failed to check account balance:', error.message);
            console.log('💡 This might mean the account doesn\'t exist or has no ALGO');
            console.log('🔗 Fund your account: https://testnet.algonode.cloud/dispenser');
            console.log('📋 Your address:', deployerAccount.addr);
            return;
        }
        
        // Compile the smart contract programs
        console.log('🔨 Compiling smart contract...');
        
        let approvalCompiled, clearCompiled;
        try {
            approvalCompiled = await algodClient.compile(Buffer.from(approvalProgram)).do();
            clearCompiled = await algodClient.compile(Buffer.from(clearProgram)).do();
            console.log('✅ Smart contract compiled successfully');
        } catch (error) {
            console.log('❌ Failed to compile smart contract:', error.message);
            return;
        }
        
        // Get suggested transaction parameters with better fee settings
        console.log('📋 Getting transaction parameters...');
        const suggestedParams = await algodClient.getTransactionParams().do();
        
        // Increase fee for faster confirmation
        suggestedParams.fee = Math.max(suggestedParams.fee, 3000); // Minimum 3000 microAlgos
        suggestedParams.flatFee = true;
        
        console.log(`💰 Using transaction fee: ${suggestedParams.fee} microAlgos`);
        console.log(`📊 First valid round: ${suggestedParams.firstRound}`);
        console.log(`📊 Last valid round: ${suggestedParams.lastRound}`);
        
        // Create the application creation transaction
        console.log('📝 Creating application transaction...');
        const createAppTxn = algosdk.makeApplicationCreateTxnFromObject({
            from: deployerAccount.addr,
            approvalProgram: new Uint8Array(Buffer.from(approvalCompiled.result, 'base64')),
            clearProgram: new Uint8Array(Buffer.from(clearCompiled.result, 'base64')),
            numLocalInts: 0,
            numLocalByteSlices: 0,
            numGlobalInts: 10, // Store donation counts, etc.
            numGlobalByteSlices: 10, // Store donation data
            suggestedParams,
            onComplete: algosdk.OnApplicationComplete.NoOpOC,
        });
        
        // Sign the transaction
        console.log('✍️  Signing transaction...');
        const signedTxn = createAppTxn.signTxn(deployerAccount.sk);
        
        // Submit the transaction with better error handling
        console.log('📤 Submitting deployment transaction...');
        let txId;
        try {
            const submitResult = await algodClient.sendRawTransaction(signedTxn).do();
            txId = submitResult.txId || submitResult;
            
            // Validate the returned transaction ID
            if (!txId || typeof txId !== 'string') {
                throw new Error(`Invalid transaction ID returned: ${JSON.stringify(submitResult)}`);
            }
            
            console.log('✅ Transaction submitted successfully');
            console.log('🔗 Transaction ID:', txId);
            console.log('🔍 Track on AlgoExplorer:', `https://testnet.algoexplorer.io/tx/${txId}`);
            
        } catch (error) {
            console.log('❌ Failed to submit transaction:', error.message);
            
            if (error.message.includes('insufficient funds')) {
                console.log('💡 Your account needs more ALGO for transaction fees');
                console.log('🔗 Get more from: https://testnet.algonode.cloud/dispenser');
            } else if (error.message.includes('below min')) {
                console.log('💡 Transaction fee too low, trying with higher fee...');
            }
            
            return;
        }
        
        // Wait for confirmation with extended timeout
        console.log('⏳ Waiting for confirmation (this may take a few minutes)...');
        const result = await waitForConfirmationWithRetry(algodClient, txId, 20); // Wait up to 20 rounds
        
        // Get the application ID
        const appId = result['application-index'];
        console.log('');
        console.log('🎉 Smart contract deployed successfully!');
        console.log('📋 Application ID:', appId);
        console.log('🔗 View on AlgoExplorer:', `https://testnet.algoexplorer.io/application/${appId}`);
        console.log('');
        
        // Update .env file automatically
        try {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            const envPath = join(__dirname, '..', '.env');
            
            let envContent = '';
            if (fs.existsSync(envPath)) {
                envContent = fs.readFileSync(envPath, 'utf8');
            }
            
            // Update or add the APP_ID
            if (envContent.includes('VITE_ALGORAND_APP_ID=')) {
                envContent = envContent.replace(/VITE_ALGORAND_APP_ID=.*/, `VITE_ALGORAND_APP_ID=${appId}`);
            } else {
                envContent += `\nVITE_ALGORAND_APP_ID=${appId}\n`;
            }
            
            fs.writeFileSync(envPath, envContent);
            console.log('✅ Updated .env file with APP_ID');
            console.log('💡 Your .env now contains:');
            console.log(`   VITE_ALGORAND_APP_ID=${appId}`);
            console.log('');
            console.log('🎯 Next Steps:');
            console.log('1. Restart your development server');
            console.log('2. Go to Profile → Blockchain tab');
            console.log('3. Create an Algorand wallet');
            console.log('4. Test blockchain donation recording');
            
        } catch (error) {
            console.log('⚠️  Could not update .env file automatically:', error.message);
            console.log('💡 Please manually add this to your .env file:');
            console.log(`VITE_ALGORAND_APP_ID=${appId}`);
        }
        
    } catch (error) {
        console.error('❌ Deployment failed:', error);
        
        if (error.message.includes('insufficient funds')) {
            console.log('💡 Solution: Fund your account with testnet ALGO');
            console.log('🔗 Testnet faucet: https://testnet.algonode.cloud/dispenser');
        } else if (error.message.includes('network') || error.message.includes('connection')) {
            console.log('💡 Solution: Check your internet connection');
            console.log('🔗 Trying to connect to: https://testnet-api.algonode.cloud');
        } else if (error.message.includes('not confirmed') || error.message.includes('timeout')) {
            console.log('💡 This is likely due to network congestion on Algorand testnet');
            console.log('🔄 You can try the following:');
            console.log('   1. Wait a few minutes and try again');
            console.log('   2. Check if the transaction went through on AlgoExplorer');
            console.log('   3. The testnet can be slow during peak usage');
        } else if (error.message.includes('Invalid transaction ID')) {
            console.log('💡 Transaction submission failed - check account balance and network');
            console.log('🔗 Verify your account: https://testnet.algoexplorer.io/address/' + 
                (process.env.DEPLOYER_MNEMONIC ? 
                    algosdk.mnemonicToSecretKey(process.env.DEPLOYER_MNEMONIC).addr : 'YOUR_ADDRESS'));
        }
        
        console.log('');
        console.log('🔍 Debug Information:');
        console.log('Error type:', error.constructor.name);
        console.log('Error message:', error.message);
    }
}

// Run the deployment
deployContract();