
import React from 'react';

interface PricingModalProps {
  setShowPricingModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PricingModal: React.FC<PricingModalProps> = ({ setShowPricingModal }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
      <div className="bg-gray-900 rounded-2xl shadow-lg p-8 max-w-md w-full relative mx-auto">
        <button
          className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-white text-2xl"
          onClick={() => setShowPricingModal(false)}
        >
          &times;
        </button>
        <h3 className="text-2xl font-semibold mb-2 text-center">Pro Plan</h3>
        <p className="text-gray-400 mb-4 text-center">Unlock full platform capabilities and unlimited interviews.</p>
        <p className="text-3xl font-bold mb-6 text-center">$19/mo</p>
        <button className="w-full px-6 py-3 bg-blue-600 rounded-full font-semibold text-lg mb-2 opacity-60 cursor-not-allowed" disabled>Upgrade Now</button>
        <div className="text-gray-400 text-sm text-center mt-2">Cancel anytime. 7-day money-back guarantee.</div>
      </div>
    </div>
  );
};

export default PricingModal;
