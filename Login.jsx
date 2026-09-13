import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Scale, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth() || {};
  const [email, setEmail] = useState('admin@nyayatula.gov.in');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('Admin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res?.success) {
        toast.success(`Welcome back, ${res.user?.name || 'Officer'}!`);
      } else {
        setError(res?.message || 'Invalid email or password');
        toast.error(res?.message || 'Authentication failed');
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
      toast.error('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPass, demoRole) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setRole(demoRole);
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50 font-sans">
      {/* Left side - Government branding (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex-col justify-between text-white p-12 relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        {/* Top Emblem / Organization */}
        <div className="z-10 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full border-2 border-saffron-400 flex items-center justify-center font-bold text-saffron-300 text-lg">
            ⚖️
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-300 font-semibold">Government of India</p>
            <p className="text-xs text-saffron-400 font-medium">Department of Consumer Affairs (DoCA)</p>
          </div>
        </div>

        {/* Center Title */}
        <div className="z-10 flex flex-col items-center text-center space-y-6 my-auto">
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl">
            <Scale size={72} className="text-saffron-400" strokeWidth={1.5} />
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl font-extrabold tracking-tight">NyayaTula</h1>
            <h2 className="text-3xl font-medium text-saffron-300 font-serif">न्यायतुला</h2>
          </div>

          <div className="h-1 w-28 bg-gradient-to-r from-saffron-500 via-white to-success-500 rounded-full my-2"></div>

          <p className="text-lg font-light tracking-wide text-slate-200 max-w-md">
            Automated compliance checking of packaged commodities under <strong className="font-semibold text-white">Legal Metrology Rules, 2011</strong>
          </p>

          <div className="grid grid-cols-3 gap-3 text-center pt-4 w-full max-w-md">
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
              <span className="block text-xl font-bold text-white">15+</span>
              <span className="text-[0.7rem] text-slate-300 uppercase">Legal Rules</span>
            </div>
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
              <span className="block text-xl font-bold text-success-300">OCR AI</span>
              <span className="text-[0.7rem] text-slate-300 uppercase">Automated Scan</span>
            </div>
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/10">
              <span className="block text-xl font-bold text-saffron-300">PDF</span>
              <span className="text-[0.7rem] text-slate-300 uppercase">Digital Notice</span>
            </div>
          </div>
        </div>

        {/* Bottom Notice */}
        <div className="z-10 pt-6 border-t border-white/20 text-xs text-slate-300 text-center">
          <p>Ministry of Consumer Affairs, Food & Public Distribution • Krishi Bhawan, New Delhi</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100">
          <div className="text-center space-y-2">
            <div className="lg:hidden flex justify-center mb-4">
              <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100">
                <Scale size={42} className="text-primary-600" />
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Enforcement Portal</h2>
            <p className="text-slate-500 text-sm">Sign in to Legal Metrology Inspector & Admin console</p>
          </div>

          {error && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 p-3 rounded-lg text-sm flex items-start">
              <ShieldCheck size={18} className="mr-2 flex-shrink-0 mt-0.5 text-danger-500" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Official Email ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
                  placeholder="name@nyayatula.gov.in"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Secure Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Designated Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ShieldCheck className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm bg-white"
                >
                  <option value="Admin">Chief Enforcement Officer (Admin)</option>
                  <option value="Inspector">Legal Metrology Inspector</option>
                  <option value="Viewer">State Authority / Viewer</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Verifying Credentials...
                </>
              ) : (
                'Sign In to NyayaTula Console'
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">Quick Login Credentials</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@nyayatula.gov.in', 'admin123', 'Admin')}
                className="p-2 text-left rounded border border-slate-200 hover:border-primary-500 hover:bg-primary-50/50 transition-colors text-xs"
              >
                <div className="font-semibold text-primary-700">Admin Account</div>
                <div className="text-slate-500 truncate">admin@nyayatula.gov.in</div>
                <div className="text-[0.65rem] text-slate-400 font-mono mt-0.5">admin123</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('inspector@nyayatula.gov.in', 'inspector123', 'Inspector')}
                className="p-2 text-left rounded border border-slate-200 hover:border-primary-500 hover:bg-primary-50/50 transition-colors text-xs"
              >
                <div className="font-semibold text-primary-700">Inspector Account</div>
                <div className="text-slate-500 truncate">inspector@nyayatula.gov.in</div>
                <div className="text-[0.65rem] text-slate-400 font-mono mt-0.5">inspector123</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
