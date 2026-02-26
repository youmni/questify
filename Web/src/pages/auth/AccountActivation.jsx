import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoaderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;

function AccountActivation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const token = searchParams.get("token");
    if (!token) {
      setMessage("Geen activatietoken opgegeven.");
      setIsLoading(false);
      setIsSuccess(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/activate?token=${token}`)
      .then(() => {
        setMessage("Je account is succesvol geactiveerd. Je kunt nu inloggen.");
        setIsSuccess(true);
        setIsLoading(false);
      })
      .catch(() => {
        setMessage("Activatie mislukt. De token is ongeldig of verlopen.");
        setIsSuccess(false);
        setIsLoading(false);
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <style>{`
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUpFade 0.6s ease-out forwards; }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#2c3e54]/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2c3e54]/5 rounded-full blur-[100px]"></div>
      </div>

      <div className={`w-full max-w-md relative z-10 opacity-0 ${isVisible ? 'animate-slide-up' : ''}`}>
        <div className="bg-white border border-[#2c3e54]/10 rounded-3xl p-8 shadow-[0_10px_40px_rgba(44,62,84,0.05)] text-center">

          <div className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-[#2c3e54] rounded-lg flex items-center justify-center text-white font-bold">Q</div>
            <span className="text-xl font-bold tracking-wider text-[#2c3e54]">QUESTIFY</span>
          </div>

          {isLoading ? (
            <>
              <div className="flex justify-center mb-4 text-[#2c3e54]/60">
                <LoaderIcon />
              </div>
              <h2 className="text-2xl font-bold text-[#2c3e54] mb-2">Account activeren</h2>
              <p className="text-[#2c3e54]/60 text-sm">Even geduld, je account wordt geactiveerd...</p>
            </>
          ) : (
            <>
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                isSuccess ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
              }`}>
                <span className={`text-3xl ${isSuccess ? 'text-green-600' : 'text-red-500'}`}>
                  {isSuccess ? '✓' : '✕'}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-[#2c3e54] mb-2">
                {isSuccess ? 'Account geactiveerd!' : 'Activatie mislukt'}
              </h1>
              <p className="text-[#2c3e54]/60 text-sm mb-8">{message}</p>

              <button
                onClick={() => navigate(isSuccess ? '/auth/login' : '/')}
                className="w-full py-4 rounded-xl font-bold text-[#f4f1e9] bg-[#2c3e54] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {isSuccess ? 'Naar inloggen' : 'Naar startpagina'} <ArrowRightIcon />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountActivation;
