import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import authService from "../../services/authService";

const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const AlertCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
const LoaderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;

const ForgotPasswordConfirm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;

  useEffect(() => {
    setIsVisible(true);
    if (!token) {
      setErrors({ token: "Geen resettoken opgegeven" });
      setIsLoading(false);
      return;
    }
    const checkToken = async () => {
      try {
        await authService.validateResetToken(token);
        setTokenValid(true);
      } catch {
        setErrors({ token: "Ongeldige of verlopen token" });
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.newPassword || !passwordRegex.test(form.newPassword)) {
      newErrors.newPassword = "Min. 8 tekens, 1 hoofdletter, 1 kleine letter, 1 cijfer, 1 speciaal teken";
    }
    if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = "Wachtwoorden komen niet overeen";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      await authService.confirmPasswordReset({ token, newPassword: form.newPassword });
      navigate("/auth/login");
    } catch {
      setErrors({ submit: "Wachtwoord opnieuw instellen mislukt" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageWrapper = (children) => (
    <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <style>{`
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUpFade 0.6s ease-out forwards; }
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2c3e54]/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#2c3e54]/5 rounded-full blur-[100px]"></div>
      </div>
      <div className={`w-full max-w-md relative z-10 opacity-0 ${isVisible ? 'animate-slide-up' : ''}`}>
        {children}
      </div>
    </div>
  );

  if (isLoading) {
    return pageWrapper(
      <div className="bg-white border border-[#2c3e54]/10 rounded-3xl p-8 shadow-[0_10px_40px_rgba(44,62,84,0.05)] text-center">
        <div className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#2c3e54] rounded-lg flex items-center justify-center text-white font-bold">Q</div>
          <span className="text-xl font-bold tracking-wider text-[#2c3e54]">QUESTIFY</span>
        </div>
        <div className="flex justify-center mb-4">
          <LoaderIcon />
        </div>
        <p className="text-[#2c3e54]/60 text-sm">Token controleren...</p>
      </div>
    );
  }

  if (errors.token) {
    return pageWrapper(
      <div className="bg-white border border-[#2c3e54]/10 rounded-3xl p-8 shadow-[0_10px_40px_rgba(44,62,84,0.05)] text-center">
        <div className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#2c3e54] rounded-lg flex items-center justify-center text-white font-bold">Q</div>
          <span className="text-xl font-bold tracking-wider text-[#2c3e54]">QUESTIFY</span>
        </div>
        <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-red-50 border border-red-100 mb-4">
          <span className="text-3xl text-red-500">✕</span>
        </div>
        <h1 className="text-2xl font-bold text-[#2c3e54] mb-2">Ongeldige token</h1>
        <p className="text-[#2c3e54]/60 text-sm mb-6">{errors.token}</p>
        <button
          onClick={() => navigate("/auth/password-reset")}
          className="w-full py-3.5 rounded-xl font-bold text-[#f4f1e9] bg-[#2c3e54] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Nieuwe link aanvragen <ArrowRightIcon />
        </button>
        <div className="mt-6 text-center text-sm text-[#2c3e54]/60">
          <Link to="/auth/login" className="font-bold text-[#2c3e54] hover:underline">Terug naar inloggen</Link>
        </div>
      </div>
    );
  }

  return pageWrapper(
    <div className="bg-white border border-[#2c3e54]/10 rounded-3xl p-8 shadow-[0_10px_40px_rgba(44,62,84,0.05)]">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[#2c3e54] rounded-lg flex items-center justify-center text-white font-bold">Q</div>
          <span className="text-xl font-bold tracking-wider text-[#2c3e54]">QUESTIFY</span>
        </div>
        <h2 className="text-3xl font-bold text-[#2c3e54] mb-2">Nieuw wachtwoord</h2>
        <p className="text-[#2c3e54]/60 text-sm">Voer hieronder je nieuwe wachtwoord in</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {errors.submit && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm">
            <div className="mt-0.5 shrink-0"><AlertCircleIcon /></div>
            <span>{errors.submit}</span>
          </div>
        )}

        <div className="space-y-1">
          <label htmlFor="newPassword" className="text-sm font-medium text-[#2c3e54] ml-1">
            Nieuw wachtwoord
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c3e54]/40 group-focus-within:text-[#2c3e54] transition-colors">
              <LockIcon />
            </div>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full bg-[#f4f1e9]/50 border ${
                errors.newPassword ? 'border-red-500' : 'border-[#2c3e54]/20 focus:border-[#2c3e54]'
              } rounded-xl py-3.5 pl-12 pr-4 text-[#2c3e54] placeholder-[#2c3e54]/30 focus:outline-none focus:ring-1 focus:ring-transparent transition-all`}
            />
          </div>
          {errors.newPassword && <p className="ml-1 text-xs text-red-500">{errors.newPassword}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-[#2c3e54] ml-1">
            Wachtwoord bevestigen
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c3e54]/40 group-focus-within:text-[#2c3e54] transition-colors">
              <LockIcon />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full bg-[#f4f1e9]/50 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-[#2c3e54]/20 focus:border-[#2c3e54]'
              } rounded-xl py-3.5 pl-12 pr-4 text-[#2c3e54] placeholder-[#2c3e54]/30 focus:outline-none focus:ring-1 focus:ring-transparent transition-all`}
            />
          </div>
          {errors.confirmPassword && <p className="ml-1 text-xs text-red-500">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl font-bold text-[#f4f1e9] bg-[#2c3e54] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting ? (<><LoaderIcon /> Bezig met opslaan...</>) : (<>Wachtwoord opslaan <ArrowRightIcon /></>)}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-[#2c3e54]/60">
        <Link to="/auth/login" className="font-bold text-[#2c3e54] hover:underline">Terug naar inloggen</Link>
      </div>
    </div>
  );
};

export default ForgotPasswordConfirm;
