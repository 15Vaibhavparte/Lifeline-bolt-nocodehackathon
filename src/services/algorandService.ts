import algosdk from 'algosdk';

export interface DonationRecord {
  donorId: string;
  recipientId: string;
  bloodType: string;
  units: number;
  timestamp: number;
  hospitalId: string;
  verified: boolean;
}

export interface DonorVerification {
  donorId: string;
  bloodType: string;
  medicalClearance: boolean;
  lastDonationDate: number;
  totalDonations: number;
  verifiedBy: string;
}

export class AlgorandService {
  private algodClient: algosdk.Algodv2;
  private indexerClient: algosdk.Indexer;
  private apiToken: string;
  private appId: number;

  constructor() {
    this.apiToken = import.meta.env.VITE_ALGORAND_API_TOKEN || '';
    // Use public Algorand testnet endpoints that don't require API tokens
    const nodeUrl = import.meta.env.VITE_ALGORAND_NODE_URL || 'https://testnet-api.algonode.cloud';
    const indexerUrl = import.meta.env.VITE_ALGORAND_INDEXER_URL || 'https://testnet-idx.algonode.cloud';
    this.appId = parseInt(import.meta.env.VITE_ALGORAND_APP_ID || '0');

    // Initialize Algorand clients
    // For public endpoints, we don't need custom headers with API tokens
    if (this.apiToken) {
      const headers = {
        'X-Algo-api-token': this.apiToken,
      };
      this.algodClient = new algosdk.Algodv2('', nodeUrl, headers);
      this.indexerClient = new algosdk.Indexer('', indexerUrl, headers);
    } else {
      // Use public endpoints without authentication
      this.algodClient = new algosdk.Algodv2('', nodeUrl);
      this.indexerClient = new algosdk.Indexer('', indexerUrl);
    }
  }

  // Generate a new Algorand account for users
  generateAccount(): { address: string; mnemonic: string; privateKey: Uint8Array } {
    const account = algosdk.generateAccount();
    const mnemonic = algosdk.secretKeyToMnemonic(account.sk);
    
    return {
      address: account.addr,
      mnemonic: mnemonic,
      privateKey: account.sk,
    };
  }

  // Restore account from mnemonic
  restoreAccount(mnemonic: string): { address: string; privateKey: Uint8Array } {
    const privateKey = algosdk.mnemonicToSecretKey(mnemonic);
    return {
      address: privateKey.addr,
      privateKey: privateKey.sk,
    };
  }

  // Record a blood donation on the blockchain
  async recordDonation(
    donorAccount: { address: string; privateKey: Uint8Array },
    donationData: DonationRecord
  ): Promise<string> {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do();
      
      // Create application call transaction to record donation
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        from: donorAccount.address,
        appIndex: this.appId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('record_donation')),
          new Uint8Array(Buffer.from(JSON.stringify(donationData))),
        ],
        suggestedParams,
      });

      // Sign and submit transaction
      const signedTxn = appCallTxn.signTxn(donorAccount.privateKey);
      const txId = await this.algodClient.sendRawTransaction(signedTxn).do();
      
      // Wait for confirmation
      await this.waitForConfirmation(txId);
      
      console.log('✅ Donation recorded on Algorand:', txId);
      return txId;
    } catch (error) {
      console.error('❌ Failed to record donation on Algorand:', error);
      throw error;
    }
  }

  // Verify donor credentials on blockchain
  async verifyDonor(
    verifierAccount: { address: string; privateKey: Uint8Array },
    verificationData: DonorVerification
  ): Promise<string> {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do();
      
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        from: verifierAccount.address,
        appIndex: this.appId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new Uint8Array(Buffer.from('verify_donor')),
          new Uint8Array(Buffer.from(JSON.stringify(verificationData))),
        ],
        suggestedParams,
      });

      const signedTxn = appCallTxn.signTxn(verifierAccount.privateKey);
      const txId = await this.algodClient.sendRawTransaction(signedTxn).do();
      
      await this.waitForConfirmation(txId);
      
      console.log('✅ Donor verified on Algorand:', txId);
      return txId;
    } catch (error) {
      console.error('❌ Failed to verify donor on Algorand:', error);
      throw error;
    }
  }

  // Get donation history for a donor
  async getDonationHistory(donorAddress: string): Promise<DonationRecord[]> {
    try {
      const response = await this.indexerClient
        .lookupApplications(this.appId)
        .do();

      // In a real implementation, you'd parse the application state
      // and filter transactions by donor address
      console.log('📊 Fetching donation history from Algorand...');
      
      // For now, return mock data - in production, parse actual blockchain data
      return [];
    } catch (error) {
      console.error('❌ Failed to fetch donation history:', error);
      return [];
    }
  }

  // Create a donation certificate NFT
  async createDonationNFT(
    creatorAccount: { address: string; privateKey: Uint8Array },
    donationData: DonationRecord,
    metadataUrl: string
  ): Promise<number> {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do();
      
      // Create NFT asset
      const createAssetTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
        from: creatorAccount.address,
        total: 1, // NFT has total supply of 1
        decimals: 0,
        assetName: `Blood Donation Certificate`,
        unitName: 'LIFELINE',
        assetURL: metadataUrl,
        assetMetadataHash: undefined,
        defaultFrozen: false,
        freeze: undefined,
        manager: creatorAccount.address,
        reserve: creatorAccount.address,
        clawback: undefined,
        suggestedParams,
      });

      const signedTxn = createAssetTxn.signTxn(creatorAccount.privateKey);
      const txId = await this.algodClient.sendRawTransaction(signedTxn).do();
      
      const result = await this.waitForConfirmation(txId);
      const assetId = result['asset-index'];
      
      console.log('🎖️ Donation NFT created:', assetId);
      return assetId;
    } catch (error) {
      console.error('❌ Failed to create donation NFT:', error);
      throw error;
    }
  }

  // Transfer donation NFT to donor
  async transferDonationNFT(
    fromAccount: { address: string; privateKey: Uint8Array },
    toAddress: string,
    assetId: number
  ): Promise<string> {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do();
      
      // First, recipient must opt-in to receive the asset
      const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: toAddress,
        to: toAddress,
        assetIndex: assetId,
        amount: 0,
        suggestedParams,
      });

      // Transfer the NFT
      const transferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: fromAccount.address,
        to: toAddress,
        assetIndex: assetId,
        amount: 1,
        suggestedParams,
      });

      const signedTransferTxn = transferTxn.signTxn(fromAccount.privateKey);
      const txId = await this.algodClient.sendRawTransaction(signedTransferTxn).do();
      
      await this.waitForConfirmation(txId);
      
      console.log('🎁 Donation NFT transferred:', txId);
      return txId;
    } catch (error) {
      console.error('❌ Failed to transfer donation NFT:', error);
      throw error;
    }
  }

  // Get account balance and assets
  async getAccountInfo(address: string): Promise<any> {
    try {
      const accountInfo = await this.algodClient.accountInformation(address).do();
      return accountInfo;
    } catch (error) {
      console.error('❌ Failed to get account info:', error);
      return null;
    }
  }

  // Wait for transaction confirmation
  private async waitForConfirmation(txId: string): Promise<any> {
    const status = await this.algodClient.status().do();
    let lastRound = status['last-round'];
    
    while (true) {
      const pendingInfo = await this.algodClient.pendingTransactionInformation(txId).do();
      
      if (pendingInfo['confirmed-round'] !== null && pendingInfo['confirmed-round'] > 0) {
        return pendingInfo;
      }
      
      lastRound++;
      await this.algodClient.statusAfterBlock(lastRound).do();
    }
  }

  // Check if the service is properly configured
  async checkConnection(): Promise<boolean> {
    try {
      const status = await this.algodClient.status().do();
      console.log('✅ Algorand connection successful:', status);
      return true;
    } catch (error) {
      console.error('❌ Algorand connection failed:', error);
      return false;
    }
  }

  // Get network status
  async getNetworkStatus(): Promise<any> {
    try {
      return await this.algodClient.status().do();
    } catch (error) {
      console.error('❌ Failed to get network status:', error);
      return null;
    }
  }
}

export const algorandService = new AlgorandService();