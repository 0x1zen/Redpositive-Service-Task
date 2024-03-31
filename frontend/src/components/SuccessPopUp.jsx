import React from 'react';

const SuccessPopup = ({ message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-lg font-bold mb-4">Success!</h2>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default SuccessPopup;
