import { useState } from 'react';

export const useAlert = () => {
  const [alertMessage, setAlertMessage] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setIsAlertVisible(true);
  };

  const hideAlert = () => {
    setIsAlertVisible(false);
  };

  return {
    alertMessage,
    isAlertVisible,
    showAlert,
    hideAlert
  };
};