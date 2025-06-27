import { useState, useEffect, useCallback } from 'react';
import { algorandService, DonationRecord, DonorVerification } from '../services/algorandService';

interface AlgorandAccount {
  address: string;
  mnemonic: string;
  privateKey: Uint8Array;
}

export function useAlgorand() {
  const [account, setAccount] = useState<AlgorandAccount | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState<any>(null);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
    loadStoredAccount();
  }, []);

  const checkConnection = async () => {
    try {
      const isConnected = await algorandService.checkConnection();
      setConnected(isConnected);
      
      if (isConnected) {
        const status = await algorandService.getNetworkStatus();
        setNetworkStatus(status);
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setConnected(false);
    }
  };

  const loadStoredAccount = () => {
    try {
      const storedMnemonic = localStorage.getItem('algorand_mnemonic');
      if (storedMnemonic) {
        const restoredAccount = algorandService.restoreAccount(storedMnemonic);
        setAccount({
          address: restoredAccount.address,
          mnemonic: storedMnemonic,
          privateKey: restoredAccount.privateKey,
        });
      }
    } catch (error) {
      console.error('Failed to load stored account:', error);
      localStorage.removeItem('algorand_mnemonic');
    }
  };

  const createAccount = useCallback(() => {
    try {
      setLoading(true);
      const newAccount = algorandService.generateAccount();
      
      setAccount(newAccount);
      
      // Store mnemonic securely (in production, use more secure storage)
      localStorage.setItem('algorand_mnemonic', newAccount.mnemonic);
      
      setError(null);
      return newAccount;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const restoreAccount = useCallback((mnemonic: string) => {
    try {
      setLoading(true);
      const restoredAccount = algorandService.restoreAccount(mnemonic);
      
      const accountData = {
        address: restoredAccount.address,
        mnemonic,
        privateKey: restoredAccount.privateKey,
      };
      
      setAccount(accountData);
      localStorage.setItem('algorand_mnemonic', mnemonic);
      
      setError(null);
      return accountData;
    } catch (error: any) {
      setError('Invalid mnemonic phrase');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const recordDonation = useCallback(async (donationData: DonationRecord) => {
    if (!account) {
      throw new Error('No Algorand account connected');
    }

    try {
      setLoading(true);
      const txId = await algorandService.recordDonation(account, donationData);
      setError(null);
      return txId;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [account]);

  const verifyDonor = useCallback(async (verificationData: DonorVerification) => {
    if (!account) {
      throw new Error('No Algorand account connected');
    }

    try {
      setLoading(true);
      const txId = await algorandService.verifyDonor(account, verificationData);
      setError(null);
      return txId;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [account]);

  const createDonationNFT = useCallback(async (donationData: DonationRecord, metadataUrl: string) => {
    if (!account) {
      throw new Error('No Algorand account connected');
    }

    try {
      setLoading(true);
      const assetId = await algorandService.createDonationNFT(account, donationData, metadataUrl);
      setError(null);
      return assetId;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [account]);

  const getDonationHistory = useCallback(async () => {
    if (!account) {
      return [];
    }

    try {
      return await algorandService.getDonationHistory(account.address);
    } catch (error: any) {
      setError(error.message);
      return [];
    }
  }, [account]);

  const getAccountInfo = useCallback(async () => {
    if (!account) {
      return null;
    }

    try {
      return await algorandService.getAccountInfo(account.address);
    } catch (error: any) {
      setError(error.message);
      return null;
    }
  }, [account]);

  const disconnect = useCallback(() => {
    setAccount(null);
    localStorage.removeItem('algorand_mnemonic');
    setError(null);
  }, []);

  return {
    account,
    connected,
    loading,
    error,
    networkStatus,
    createAccount,
    restoreAccount,
    recordDonation,
    verifyDonor,
    createDonationNFT,
    getDonationHistory,
    getAccountInfo,
    disconnect,
    checkConnection,
  };
}