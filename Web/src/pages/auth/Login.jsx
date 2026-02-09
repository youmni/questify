import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";

// Iconen (Nu donkerblauw #2c3e54)
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const AlertCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
const LoaderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => { setIsVisible(true); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.email || form.email.trim() === "") newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email.trim())) newErrors.email = "Email is invalid";
    if (!form.password || form.password === "") newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    try {
      await authService.login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      const me = await authService.getMe();
      setUser(me.data || null);
      navigate("/");
    } catch (error) {
      setErrors({ submit: error?.response?.data?.message || "Login failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      // ACHTERGROND: #f4f1e9
      // TEKST: #2c3e54
      <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54] flex items-center justify-center p-4 relative overflow-hidden font-sans">

        <style>{`
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUpFade 0.6s ease-out forwards; }
      `}</style>

        {/* Decoratie Blobs (Blauw #2c3e54 met lage opacity) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#2c3e54]/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2c3e54]/5 rounded-full blur-[100px]"></div>
        </div>

        <div className={`w-full max-w-md relative z-10 opacity-0 ${isVisible ? 'animate-slide-up' : ''}`}>
          {/* CARD: Wit (#ffffff) voor contrast, met subtiele blauwe schaduw */}
          <div className="bg-white border border-[#2c3e54]/10 rounded-3xl p-8 shadow-[0_10px_40px_rgba(44,62,84,0.05)]">

            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                <div className="w-8 h-8 bg-[#2c3e54] rounded-lg shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center text-white font-bold">Q</div>
                <span className="text-xl font-bold tracking-wider text-[#2c3e54]">QUESTIFY</span>
              </Link>
              <h2 className="text-3xl font-bold text-[#2c3e54] mb-2">Welcome Back</h2>
              <p className="text-[#2c3e54]/60">Sign in to your account</p>
            </div>

            {errors.submit && (
                <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm">
                  <div className="mt-0.5 shrink-0"><AlertCircleIcon /></div>
                  <span>{errors.submit}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-[#2c3e54] ml-1">Email address</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c3e54]/40 group-focus-within:text-[#2c3e54] transition-colors">
                    <MailIcon />
                  </div>
                  {/* INPUT: Achtergrond #f4f1e9 (subtiel donkerder dan wit), Border #2c3e54 */}
                  <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="explorer@questify.com"
                      className={`w-full bg-[#f4f1e9]/50 border ${
                          errors.email ? 'border-red-500' : 'border-[#2c3e54]/20 focus:border-[#2c3e54]'
                      } rounded-xl py-3.5 pl-12 pr-4 text-[#2c3e54] placeholder-[#2c3e54]/30 focus:outline-none focus:ring-1 focus:ring-transparent transition-all`}
                  />
                </div>
                {errors.email && <p className="ml-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label htmlFor="password" className="text-sm font-medium text-[#2c3e54]">Password</label>
                  <Link to="/auth/password-reset" className="text-xs text-[#2c3e54]/70 hover:text-[#2c3e54] font-bold transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c3e54]/40 group-focus-within:text-[#2c3e54] transition-colors">
                    <LockIcon />
                  </div>
                  <input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full bg-[#f4f1e9]/50 border ${
                          errors.password ? 'border-red-500' : 'border-[#2c3e54]/20 focus:border-[#2c3e54]'
                      } rounded-xl py-3.5 pl-12 pr-4 text-[#2c3e54] placeholder-[#2c3e54]/30 focus:outline-none focus:ring-1 focus:ring-transparent transition-all`}
                  />
                </div>
                {errors.password && <p className="ml-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* KNOP: Achtergrond #2c3e54, Tekst wit (of beige #f4f1e9) */}
              <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl font-bold text-[#f4f1e9] bg-[#2c3e54] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (<><LoaderIcon /> Signing in...</>) : (<>Sign in <ArrowRightIcon /></>)}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-[#2c3e54]/60">
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-[#2c3e54] font-bold hover:underline transition-all">
                Register here
              </Link>
            </div>

          </div>
        </div>
      </div>
  );
};

export default Login;