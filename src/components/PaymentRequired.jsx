import React from 'react';
import { Navigate } from 'react-router-dom';
import mockPaypalApi from '../services/paypalService';

const PaymentRequired = ({ children }) => {
  const isPaypalConnected = mockPaypalApi.isAccountConnected();

  if (!isPaypalConnected) {
    return <Navigate to="/card-details" replace state={{ message: 'Please connect your PayPal account to continue' }} />;
  }

  return children;
};

export default PaymentRequired; 