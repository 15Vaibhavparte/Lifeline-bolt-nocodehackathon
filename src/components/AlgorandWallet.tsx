import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Copy, 
  Eye, 
  EyeOff, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Download,
  Upload,
  Coins,
  Award,
  ExternalLink
} from 'lucide-react';
import { useAlgorand } from '../hooks/useAlgorand';

export function AlgorandWallet() {
  const {
    account,
    connected,
    loading,
    error,
    networkStatus,
    createAccount,
    restoreAccount,
    getAccountInfo,
    disconnect,
  } = useAlgorand();

  const [showMnemonic, setShowMnemonic] = useState(false);
  const [restoreMnemonic, setRestoreMnemonic] = useState('');
  const [showRestore, setShowRestore] = useState(false);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateAccount = async () => {
    try {
      await createAccount();
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  };

  const handleRestoreAccount = async () => {
    try {
      await restoreAccount(restoreMnemonic);
      setShowRestore(false);
      setRestoreMnemonic('');
    } catch (error) {
      console.error('Failed to restore account:', error);
    }
  };

  const handleCopyAddress = async () => {
    if (account?.address) {
      await navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGetAccountInfo = async () => {
    try {
      const info = await getAccountInfo();
      setAccountInfo(info);
    } catch (error) {
      console.error('Failed to get account info:', error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const formatAlgos = (microAlgos: number) => {
    return (microAlgos / 1000000).toFixed(6);
  };

  if (!connected) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-red-900">Algorand Not Connected</h3>
            <p className="text-red-700">Unable to connect to Algorand network. Please check your configuration.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Algorand Wallet</h3>
            <p className="text-sm text-gray-600">
              Network: {networkStatus?.network || 'Unknown'} • 
              Round: {networkStatus?.['last-round'] || 'N/A'}
            </p>
          </div>
        </div>
        
        {account && (
          <button
            onClick={disconnect}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Disconnect
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {!account ? (
        <div className="space-y-4">
          <div className="text-center py-8">
            <Wallet className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Wallet Connected</h4>
            <p className="text-gray-600 mb-6">Create a new wallet or restore an existing one to start using blockchain features.</p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleCreateAccount}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>{loading ? 'Creating...' : 'Create New Wallet'}</span>
              </button>
              
              <button
                onClick={() => setShowRestore(true)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Restore Wallet</span>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showRestore && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 pt-4"
              >
                <h5 className="font-medium text-gray-900 mb-3">Restore from Mnemonic</h5>
                <textarea
                  value={restoreMnemonic}
                  onChange={(e) => setRestoreMnemonic(e.target.value)}
                  placeholder="Enter your 25-word mnemonic phrase..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex space-x-3 mt-3">
                  <button
                    onClick={handleRestoreAccount}
                    disabled={!restoreMnemonic.trim() || loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    {loading ? 'Restoring...' : 'Restore'}
                  </button>
                  <button
                    onClick={() => {
                      setShowRestore(false);
                      setRestoreMnemonic('');
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Account Info */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Wallet Address</span>
              </div>
              <button
                onClick={handleCopyAddress}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="font-mono text-sm break-all">{account.address}</p>
          </div>

          {/* Account Balance */}
          {accountInfo && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Coins className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {formatAlgos(accountInfo.amount)}
                </div>
                <div className="text-sm text-gray-600">ALGO Balance</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Award className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {accountInfo.assets?.length || 0}
                </div>
                <div className="text-sm text-gray-600">NFTs Owned</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Shield className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {accountInfo['apps-total-schema']?.['num-uint'] || 0}
                </div>
                <div className="text-sm text-gray-600">App Interactions</div>
              </div>
            </div>
          )}

          {/* Mnemonic Backup */}
          <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">Backup Phrase</span>
              </div>
              <button
                onClick={() => setShowMnemonic(!showMnemonic)}
                className="text-yellow-700 hover:text-yellow-800"
              >
                {showMnemonic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {showMnemonic ? (
              <div className="bg-white rounded-lg p-3 font-mono text-sm break-all border">
                {account.mnemonic}
              </div>
            ) : (
              <p className="text-yellow-700 text-sm">
                Click the eye icon to reveal your backup phrase. Keep it safe!
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGetAccountInfo}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Coins className="h-4 w-4" />
              <span>{loading ? 'Loading...' : 'Refresh Balance'}</span>
            </button>
            
            <a
              href={`https://testnet.algoexplorer.io/address/${account.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View on Explorer</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}