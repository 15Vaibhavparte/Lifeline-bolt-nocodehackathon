import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Award, 
  Calendar, 
  MapPin, 
  User, 
  Droplets,
  ExternalLink,
  CheckCircle,
  Clock,
  Hash
} from 'lucide-react';
import { useAlgorand } from '../hooks/useAlgorand';

interface BlockchainDonationRecordProps {
  donation: {
    id: string;
    donor_id: string;
    blood_type: string;
    donation_date: string;
    location: string;
    units_donated: number;
    blockchain_hash?: string;
    verified_by?: string;
    status: string;
  };
  onRecordToBlockchain?: (donationId: string) => void;
}

export function BlockchainDonationRecord({ donation, onRecordToBlockchain }: BlockchainDonationRecordProps) {
  const { account, recordDonation, createDonationNFT, loading } = useAlgorand();
  const [recording, setRecording] = useState(false);
  const [creatingNFT, setCreatingNFT] = useState(false);

  const handleRecordToBlockchain = async () => {
    if (!account || !onRecordToBlockchain) return;

    try {
      setRecording(true);
      
      const donationData = {
        donorId: donation.donor_id,
        recipientId: 'system', // Could be linked to actual recipient
        bloodType: donation.blood_type,
        units: donation.units_donated,
        timestamp: new Date(donation.donation_date).getTime(),
        hospitalId: donation.location,
        verified: !!donation.verified_by,
      };

      const txId = await recordDonation(donationData);
      onRecordToBlockchain(donation.id);
      
      console.log('✅ Donation recorded on blockchain:', txId);
    } catch (error) {
      console.error('❌ Failed to record donation:', error);
    } finally {
      setRecording(false);
    }
  };

  const handleCreateNFT = async () => {
    if (!account) return;

    try {
      setCreatingNFT(true);
      
      const donationData = {
        donorId: donation.donor_id,
        recipientId: 'system',
        bloodType: donation.blood_type,
        units: donation.units_donated,
        timestamp: new Date(donation.donation_date).getTime(),
        hospitalId: donation.location,
        verified: !!donation.verified_by,
      };

      // In production, upload metadata to IPFS
      const metadataUrl = `https://lifeline.org/nft/${donation.id}`;
      
      const assetId = await createDonationNFT(donationData, metadataUrl);
      console.log('🎖️ Donation NFT created:', assetId);
    } catch (error) {
      console.error('❌ Failed to create NFT:', error);
    } finally {
      setCreatingNFT(false);
    }
  };

  const isOnBlockchain = !!donation.blockchain_hash;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-2 rounded-xl p-6 ${
        isOnBlockchain 
          ? 'border-green-200 bg-green-50' 
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isOnBlockchain 
              ? 'bg-green-100 text-green-600' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {isOnBlockchain ? <Shield className="h-6 w-6" /> : <Droplets className="h-6 w-6" />}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Blood Donation Record
            </h3>
            <p className="text-sm text-gray-600">
              {isOnBlockchain ? 'Verified on Algorand Blockchain' : 'Traditional Record'}
            </p>
          </div>
        </div>
        
        {isOnBlockchain && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Blockchain Verified</span>
          </div>
        )}
      </div>

      {/* Donation Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <Droplets className="h-5 w-5 text-red-600" />
          <div>
            <div className="font-semibold text-gray-900">{donation.blood_type}</div>
            <div className="text-sm text-gray-600">Blood Type</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Award className="h-5 w-5 text-blue-600" />
          <div>
            <div className="font-semibold text-gray-900">{donation.units_donated}</div>
            <div className="text-sm text-gray-600">Units Donated</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-purple-600" />
          <div>
            <div className="font-semibold text-gray-900">
              {new Date(donation.donation_date).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">Date</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-green-600" />
          <div>
            <div className="font-semibold text-gray-900">{donation.location}</div>
            <div className="text-sm text-gray-600">Location</div>
          </div>
        </div>
      </div>

      {/* Blockchain Information */}
      {isOnBlockchain && donation.blockchain_hash && (
        <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Hash className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-900">Blockchain Transaction</span>
          </div>
          <div className="font-mono text-sm text-gray-700 break-all mb-2">
            {donation.blockchain_hash}
          </div>
          <a
            href={`https://testnet.algoexplorer.io/tx/${donation.blockchain_hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View on Algorand Explorer</span>
          </a>
        </div>
      )}

      {/* Actions */}
      {account && (
        <div className="flex flex-col sm:flex-row gap-3">
          {!isOnBlockchain && onRecordToBlockchain && (
            <button
              onClick={handleRecordToBlockchain}
              disabled={recording || loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {recording ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  <span>Recording to Blockchain...</span>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  <span>Record on Blockchain</span>
                </>
              )}
            </button>
          )}
          
          {isOnBlockchain && (
            <button
              onClick={handleCreateNFT}
              disabled={creatingNFT || loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {creatingNFT ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  <span>Creating NFT...</span>
                </>
              ) : (
                <>
                  <Award className="h-4 w-4" />
                  <span>Create Donation NFT</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Verification Status */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              donation.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
            }`}></div>
            <span className="text-gray-600">
              Status: <span className="font-medium capitalize">{donation.status}</span>
            </span>
          </div>
          
          {donation.verified_by && (
            <div className="flex items-center space-x-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Medically Verified</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}