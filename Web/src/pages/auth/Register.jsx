import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/authService";

// Iconen
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
const AlertCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const LoaderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => { setIsVisible(true); }, []);
  const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (form.firstName.trim().length < 1) newErrors.firstName = "First name is required";
    if (form.lastName.trim().length < 1) newErrors.lastName = "Last name is required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Valid email is required";
    if (!form.password || !passwordRegex.test(form.password)) newErrors.password = "Min 8 chars, 1 upper, 1 lower, 1 number, 1 special";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
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
      await authService.register({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      setSuccessMessage("Registration successful! Check your email.");
      setForm({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
    } catch (error) {
      setErrors({ submit: error?.response?.data?.message || "Registration failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      // ACHTERGROND: #f4f1e9
      <div className="min-h-screen bg-[#f4f1e9] text-[#2c3e54] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <style>{`
        @keyframes slideUpFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUpFade 0.6s ease-out forwards; }
      `}</style>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#2c3e54]/5 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#2c3e54]/5 rounded-full blur-[100px]"></div>
        </div>

        <div className={`w-full max-w-lg relative z-10 opacity-0 ${isVisible ? 'animate-slide-up' : ''}`}>
          <div className="bg-white border border-[#2c3e54]/10 rounded-3xl p-8 shadow-[0_10px_40px_rgba(44,62,84,0.05)]">

            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4 group cursor-default">
                <div className="w-8 h-8 bg-[#2c3e54] rounded-lg shadow-lg flex items-center justify-center text-white font-bold">Q</div>
                <span className="text-xl font-bold tracking-wider text-[#2c3e54]">QUESTIFY</span>
              </div>
              <h2 className="text-3xl font-bold text-[#2c3e54] mb-2">Create Account</h2>
              <p className="text-[#2c3e54]/60">Join the quest today.</p>
            </div>

            {successMessage && (
                <div className="mb-6 bg-green-50 border border-green-100 text-green-700 p-4 rounded-xl flex items-start gap-3 text-sm">
                  <div className="mt-0.5"><CheckCircleIcon /></div>
                  <span>{successMessage}</span>
                </div>
            )}
            {errors.submit && (
                <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-start gap-3 text-sm">
                  <div className="mt-0.5"><AlertCircleIcon /></div>
                  <span>{errors.submit}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#2c3e54] ml-1">First Name</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c3e54]/40 group-focus-within:text-[#2c3e54] transition-colors"><UserIcon /></div>
                    <input name="firstName" type="text" value={form.firstName} onChange={handleChange} placeholder="John"
                           className={`w-full bg-[#f4f1e9]/50 border ${errors.firstName ? 'border-red-500' : 'border-[#2c3e54]/20 focus:border-[#2c3e54]'} rounded-xl py-3.5 pl-12 pr-4 text-[#2c3e54] placeholder-[#2c3e54]/30 focus:outline-none focus:ring-1 focus:ring-transparent transition-all`} />
                  </div>
                  {errors.firstName && <p className="text-xs text-red-500 ml-1 mt-1">{errors.firstName}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#2c3e54] ml-1">Last Name</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c3e54]/40 group-focus-within:text-[#2c3e54] transition-colors"><UserIcon /></div>
                    <input name="lastName" type="text" value={form.lastName} onChange={handleChange} placeholder="Doe"
                           className={`w-full bg-[#f4f1e9]/50 border ${errors.lastName ? 'border-red-500' : 'border-[#2c3e54]/20 focus:border-[#2c3e54]'} rounded-xl py-3.5 pl-12 pr-4 text-[#2c3e54] placeholder-[#2c3e54]/30 focus:outline-none focus:ring-1 focus:ring-transparent transition-all`} />
                  </div>
                  {errors.lastName && <p className="text-xs text-red-500 ml-1 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2c3e54] ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c3e54]/40 group-focus-within:text-[#2c3e54] transition-colors"><MailIcon /></div>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="explorer@questify.com"
                         className={`w-full bg-[#f4f1e9]/50 border ${errors.email ? 'border-red-500' : 'border-[#2c3e54]/20 focus:border-[#2c3e54]'} rounded-xl py-3.5 pl-12 pr-4 text-[#2c3e54] placeholder-[#2c3e54]/30 focus:outline-none focus:ring-1 focus:ring-transparent transition-all`} />
                </div>
                {errors.email && <p className="text-xs text-red-500 ml-1 mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2c3e54] ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c3e54]/40 group-focus-within:text-[#2c3e54] transition-colors"><LockIcon /></div>
                  <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 8 chars, 1 Special"
                         className={`w-full bg-[#f4f1e9]/50 border ${errors.password ? 'border-red-500' : 'border-[#2c3e54]/20 focus:border-[#2c3e54]'} rounded-xl py-3.5 pl-12 pr-4 text-[#2c3e54] placeholder-[#2c3e54]/30 focus:outline-none focus:ring-1 focus:ring-transparent transition-all`} />
                </div>
                {errors.password && <p className="text-xs text-red-500 ml-1 mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-[#2c3e54] ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c3e54]/40 group-focus-within:text-[#2c3e54] transition-colors"><LockIcon /></div>
                  <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password"
                         className={`w-full bg-[#f4f1e9]/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-[#2c3e54]/20 focus:border-[#2c3e54]'} rounded-xl py-3.5 pl-12 pr-4 text-[#2c3e54] placeholder-[#2c3e54]/30 focus:outline-none focus:ring-1 focus:ring-transparent transition-all`} />
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 ml-1 mt-1">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" disabled={isLoading}
                      className="w-full py-4 rounded-xl font-bold text-[#f4f1e9] bg-[#2c3e54] shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6">
                {isLoading ? (<><LoaderIcon /> Registering...</>) : (<>Create Account <ArrowRightIcon /></>)}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-[#2c3e54]/60">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-[#2c3e54] font-bold hover:underline transition-all">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Register;