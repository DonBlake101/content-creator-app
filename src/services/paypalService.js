// Mock PayPal API service
const mockPaypalApi = {
  connectAccount: async (email, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store PayPal info in localStorage (in real app, this would be in your backend)
    localStorage.setItem('paypal_connected', 'true');
    localStorage.setItem('paypal_email', email);
    
    return {
      success: true,
      message: 'PayPal account connected successfully'
    };
  },

  isAccountConnected: () => {
    return localStorage.getItem('paypal_connected') === 'true';
  },

  getPaypalEmail: () => {
    return localStorage.getItem('paypal_email');
  },

  disconnectAccount: async () => {
    localStorage.removeItem('paypal_connected');
    localStorage.removeItem('paypal_email');
    return {
      success: true,
      message: 'PayPal account disconnected'
    };
  }
};

export default mockPaypalApi; 