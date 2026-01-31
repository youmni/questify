import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AccountActivation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Activating your account...');
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage("No activation token provided");
      setIsLoading(false);
      setIsSuccess(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/activate?token=${token}`)
      .then(() => {
        setMessage("Account activated successfully!");
        setIsSuccess(true);
        setIsLoading(false);
      })
      .catch(() => {
        setMessage("Activation failed. Invalid or expired token.");
        setIsSuccess(false);
        setIsLoading(false);
      });
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
          isSuccess ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <span className={`text-4xl ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {isSuccess ? '✓' : '✕'}
          </span>
        </div>
        <h1 className={`mt-4 text-2xl font-bold ${
          isSuccess ? 'text-green-700' : 'text-red-700'
        }`}>
          {isSuccess ? 'Account Activated!' : 'Activation Failed'}
        </h1>
        <p className="mt-2 text-gray-600">{message}</p>
        <button
          onClick={() => navigate(isSuccess ? '/auth/login' : '/')}
          className="mt-6 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
        >
          {isSuccess ? 'Go to Login' : 'Go to Home'}
        </button>
      </div>
    </div>
  );
}

export default AccountActivation;