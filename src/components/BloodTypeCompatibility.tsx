import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface BloodTypeInfo {
  canReceiveFrom: string[];
  canDonateTo: string[];
  description: string;
  rarity: string;
  donorCount: number;
}

const bloodTypeData: Record<string, BloodTypeInfo> = {
  'A+': {
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    canDonateTo: ['A+', 'AB+'],
    description: 'Contains A antigens on red blood cells and A antibodies in plasma.',
    rarity: 'Common (35.7% of population)',
    donorCount: 328
  },
  'A-': {
    canReceiveFrom: ['A-', 'O-'],
    canDonateTo: ['A+', 'A-', 'AB+', 'AB-'],
    description: 'Contains A antigens on red blood cells but no Rh factor.',
    rarity: 'Uncommon (6.3% of population)',
    donorCount: 121
  },
  'B+': {
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    canDonateTo: ['B+', 'AB+'],
    description: 'Contains B antigens on red blood cells and B antibodies in plasma.',
    rarity: 'Less common (8.5% of population)',
    donorCount: 170
  },
  'B-': {
    canReceiveFrom: ['B-', 'O-'],
    canDonateTo: ['B+', 'B-', 'AB+', 'AB-'],
    description: 'Contains B antigens on red blood cells but no Rh factor.',
    rarity: 'Rare (1.5% of population)',
    donorCount: 322
  },
  'AB+': {
    canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    canDonateTo: ['AB+'],
    description: 'Universal recipient. Contains both A and B antigens on red blood cells.',
    rarity: 'Very rare (3.4% of population)',
    donorCount: 370
  },
  'AB-': {
    canReceiveFrom: ['A-', 'B-', 'AB-', 'O-'],
    canDonateTo: ['AB+', 'AB-'],
    description: 'Rarest blood type. Contains both A and B antigens but no Rh factor.',
    rarity: 'Extremely rare (0.6% of population)',
    donorCount: 501
  },
  'O+': {
    canReceiveFrom: ['O+', 'O-'],
    canDonateTo: ['O+', 'A+', 'B+', 'AB+'],
    description: 'Most common blood type. Contains neither A nor B antigens.',
    rarity: 'Very common (37.4% of population)',
    donorCount: 154
  },
  'O-': {
    canReceiveFrom: ['O-'],
    canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    description: 'Universal donor. Contains neither A nor B antigens and no Rh factor.',
    rarity: 'Uncommon (6.6% of population)',
    donorCount: 421
  }
};

export function BloodTypeCompatibility() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTypeClick = (type: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    
    setHoverPosition({
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top
    });
    setSelectedType(selectedType === type ? null : type);
  };
  
  // Close the info card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedType && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setSelectedType(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedType]);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div ref={containerRef} className="bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-2xl p-8 shadow-strong relative">
      <h3 className="text-2xl font-bold mb-6 text-center text-white">Blood Type Compatibility</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {bloodTypes.map((type) => (
          <motion.div
            key={type}
            onClick={(e) => handleTypeClick(type, e)}
            className={`relative p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
              selectedType === type 
                ? 'bg-gray-800 bg-opacity-80 ring-2 ring-primary-500' 
                : 'bg-gray-800 bg-opacity-70 hover:bg-gray-700'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Droplets className="h-6 w-6 mb-2 text-primary-400" />
            <span className="text-2xl font-bold text-white">{type}</span>
            <span className="text-xs mt-1 text-gray-300">{bloodTypeData[type].donorCount} donors</span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-50 w-80 sm:w-96"
            style={{
              top: `${hoverPosition.y - 220}px`,
              left: `${hoverPosition.x - 150}px`, 
              transformOrigin: 'center bottom'
            }}
          >
            <div className="bg-gray-800 bg-opacity-90 backdrop-blur-xl rounded-xl shadow-xl overflow-hidden border border-gray-700">
              <div className="bg-primary-900 bg-opacity-80 text-white p-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center">
                    <Droplets className="h-5 w-5 mr-2 text-primary-400" />
                    Blood Type {selectedType}
                  </h3>
                  <span className="text-xs bg-black bg-opacity-40 px-2 py-1 rounded-full">
                    {bloodTypeData[selectedType].rarity}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-300">
                  {bloodTypeData[selectedType].description}
                </p>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  {/* Can Receive From */}
                  <div className="bg-blue-900 bg-opacity-30 rounded-lg p-3">
                    <h4 className="font-medium text-blue-200 flex items-center mb-2">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Can Receive From
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {bloodTypeData[selectedType].canReceiveFrom.map((type) => (
                        <div 
                          key={`receive-${type}`}
                          className="bg-blue-800 bg-opacity-50 text-blue-200 rounded-lg p-2 text-center font-medium"
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-blue-300 mt-2">
                      {selectedType === 'AB+' 
                        ? 'Universal recipient - can receive from all blood types' 
                        : `Compatible with ${bloodTypeData[selectedType].canReceiveFrom.length} blood types`}
                    </p>
                  </div>

                  {/* Can Donate To */}
                  <div className="bg-green-900 bg-opacity-30 rounded-lg p-3">
                    <h4 className="font-medium text-green-200 flex items-center mb-2">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Can Donate To
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {bloodTypeData[selectedType].canDonateTo.map((type) => (
                        <div 
                          key={`donate-${type}`}
                          className="bg-green-800 bg-opacity-50 text-green-200 rounded-lg p-2 text-center font-medium"
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-green-300 mt-2">
                      {selectedType === 'O-' 
                        ? 'Universal donor - can donate to all blood types' 
                        : `Can donate to ${bloodTypeData[selectedType].canDonateTo.length} blood types`}
                    </p>
                  </div>

                  {/* Important Info */}
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-300 flex items-center mb-2">
                      <Info className="h-4 w-4 mr-2" />
                      Important Information
                    </h4>
                    <p className="text-xs text-gray-400">
                      Blood type compatibility is crucial for safe transfusions. 
                      {selectedType.includes('-') 
                        ? ' Negative blood types are always in high demand due to their versatility.'
                        : ' Positive blood types are more common but have more restricted donation options.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}