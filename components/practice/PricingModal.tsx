
import React from 'react';

interface PricingModalProps {
  setShowPricingModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const PricingModal: React.FC<PricingModalProps> = ({ setShowPricingModal }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full relative mx-4">
        <button
          className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl"
          onClick={() => setShowPricingModal(false)}
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold mb-2 text-center text-gray-900">Pro Plan</h3>
        <p className="text-gray-600 mb-4 text-center">Unlock full platform capabilities and unlimited interviews.</p>
        <p className="text-4xl font-extrabold mb-6 text-center text-gray-900">$19/mo</p>
        <button className="w-full px-6 py-3 bg-emerald-600 rounded-full font-semibold text-lg text-white mb-2 opacity-60 cursor-not-allowed" disabled>Upgrade Now</button>
        <div className="text-gray-500 text-sm text-center mt-2">Cancel anytime. 7-day money-back guarantee.</div>
      </div>
    </div>
  );
};

export default PricingModal;
