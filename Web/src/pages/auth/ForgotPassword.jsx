import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/authService";

// --- SVG Iconen ---
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const AlertCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const LoaderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // State voor de animatie
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { setIsVisible(true); }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = "Email is invalid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      await authService.requestPasswordReset(email.trim().toLowerCase());
      setSuccessMessage("If the email is registered, you'll receive a reset link shortly.");
      setEmail("");
    } catch (error) {
      setErrors({
        submit: error?.response?.data?.message || "Request failed"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      // ACHTERGROND: #f4f1e9 | TEKST: #2c3e54
      <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54] flex items-center justify-center p-4 relative overflow-hidden font-sans">

        {/* Animatie Styles */}
        <style>{`
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUpFade 0.6s ease-out forwards; }
      `}</style>

        {/* Achtergrond Decoratie */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#2c3e54]/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2c3e54]/5 rounded-full blur-[100px]"></div>
        </div>

        <div className={`w-full max-w-md relative z-10 opacity-0 ${isVisible ? 'animate-slide-up' : ''}`}>
          {/* CARD: Wit met subtiele blauwe schaduw */}
          <div className="bg-white border border-[#2c3e54]/10 rounded-3xl p-8 shadow-[0_10px_40px_rgba(44,62,84,0.05)]">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4 group cursor-default">
                <div className="w-8 h-8 bg-[#2c3e54] rounded-lg shadow-lg flex items-center justify-center text-white font-bold">Q</div>
                <span className="text-xl font-bold tracking-wider text-[#2c3e54]">QUESTIFY</span>
              </div>
              <h2 className="text-3xl font-bold text-[#2c3e54] mb-2">
                Reset Password
              </h2>
              <p className="text-[#2c3e54]/60 text-sm">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Success Message */}
              {successMessage && (
                  <div className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-xl flex items-start gap-3 text-sm">
                    <div className="mt-0.5"><CheckCircleIcon /></div>
                    <span>{successMessage}</span>
                  </div>
              )}

              {/* Error Message */}
              {errors.submit && (
                  <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm">
                    <div className="mt-0.5"><AlertCircleIcon /></div>
                    <span>{errors.submit}</span>
                  </div>
              )}

              {/* Email Field */}
              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-[#2c3e54] ml-1">
                  Email address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c3e54]/40 group-focus-within:text-[#2c3e54] transition-colors">
                    <MailIcon />
                  </div>
                  <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      className={`block w-full bg-[#f4f1e9]/50 border ${
                          errors.email ? 'border-red-500' : 'border-[#2c3e54]/20 focus:border-[#2c3e54]'
                      } rounded-xl py-3.5 pl-12 pr-4 text-[#2c3e54] placeholder-[#2c3e54]/30 focus:outline-none focus:ring-1 focus:ring-transparent transition-all`}
                      placeholder="explorer@questify.com"
                  />
                </div>
                {errors.email && (
                    <p className="mt-1 text-xs text-red-500 ml-1">{errors.email}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl font-bold text-[#f4f1e9] bg-[#2c3e54] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                    <> <LoaderIcon /> Sending... </>
                ) : (
                    <> Send Reset Link <ArrowRightIcon /> </>
                )}
              </button>

              {/* Footer Link */}
              <div className="text-center text-sm text-[#2c3e54]/60">
                Remember your password?{' '}
                <Link to="/auth/login" className="font-bold text-[#2c3e54] hover:underline transition-all">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default ForgotPassword;