"use client";
import { useAlert } from "../hooks/useAlert";

const Alert = () => {
  const { alertMessage, isAlertVisible, hideAlert } = useAlert();

  if (!isAlertVisible) return null;

  return (
    <div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded shadow-lg"
      role="alert"
    >
      <p>{alertMessage}</p>
      <button
        className="ml-4 text-white font-bold"
        onClick={hideAlert}
      >
        ×
      </button>
    </div>
  );
};

export default Alert;
