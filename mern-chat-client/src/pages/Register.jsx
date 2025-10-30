import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';

export default function Register() {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await register(name, email, password);
    } catch (e) {
      setErr(e.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength();
  const strengthColor = strength <= 1 ? 'red' : strength === 2 ? 'yellow' : strength === 3 ? 'blue' : 'green';
  const strengthLabel = strength <= 1 ? 'Weak' : strength === 2 ? 'Fair' : strength === 3 ? 'Good' : 'Strong';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-slide-in { animation: slide-in 0.6s ease-out; }
      `}</style>

      {/* Animated Blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-20"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-20" style={{animationDelay: '2s'}}></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-in">
          <div className="inline-block p-4 bg-white/10 backdrop-blur-md rounded-2xl mb-4">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Our Community</h1>
          <p className="text-purple-100 text-sm">Create your account and start connecting</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-slide-in" style={{animationDelay: '0.2s'}}>
          {/* Error Message */}
          {err && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3 animate-slide-in">
              <div className="w-5 h-5 bg-red-500 rounded-full flex-shrink-0 mt-0.5"></div>
              <p className="text-red-100 text-sm font-medium">{err}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="group">
              <label className="block text-sm font-semibold text-white/80 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-purple-300 transition-colors group-hover:text-purple-200" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white/20 text-white placeholder-white/50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="group">
              <label className="block text-sm font-semibold text-white/80 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-purple-300 transition-colors group-hover:text-purple-200" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white/20 text-white placeholder-white/50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group">
              <label className="block text-sm font-semibold text-white/80 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-purple-300 transition-colors group-hover:text-purple-200" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:bg-white/20 text-white placeholder-white/50 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-purple-300 hover:text-purple-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-white/60">Password strength:</span>
                    <span className={`text-xs font-semibold ${
                      strengthColor === 'red' ? 'text-red-300' :
                      strengthColor === 'yellow' ? 'text-yellow-300' :
                      strengthColor === 'blue' ? 'text-blue-300' :
                      'text-green-300'
                    }`}>{strengthLabel}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strengthColor === 'red' ? 'bg-red-400 w-1/4' :
                        strengthColor === 'yellow' ? 'bg-yellow-400 w-2/4' :
                        strengthColor === 'blue' ? 'bg-blue-400 w-3/4' :
                        'bg-green-400 w-full'
                      }`}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Password Requirements */}
            <div className="grid grid-cols-2 gap-2 text-xs text-white/70 pt-2">
              <div className={`flex items-center gap-1.5 ${password.length >= 8 ? 'text-green-300' : ''}`}>
                <Check size={14} className={password.length >= 8 ? 'opacity-100' : 'opacity-30'} />
                At least 8 characters
              </div>
              <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(password) ? 'text-green-300' : ''}`}>
                <Check size={14} className={/[A-Z]/.test(password) ? 'opacity-100' : 'opacity-30'} />
                Uppercase letter
              </div>
              <div className={`flex items-center gap-1.5 ${/[0-9]/.test(password) ? 'text-green-300' : ''}`}>
                <Check size={14} className={/[0-9]/.test(password) ? 'opacity-100' : 'opacity-30'} />
                Number
              </div>
              <div className={`flex items-center gap-1.5 ${/[^A-Za-z0-9]/.test(password) ? 'text-green-300' : ''}`}>
                <Check size={14} className={/[^A-Za-z0-9]/.test(password) ? 'opacity-100' : 'opacity-30'} />
                Special character
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 pt-2">
              <input type="checkbox" required className="w-4 h-4 mt-1 rounded accent-purple-400" />
              <label className="text-xs text-white/70">
                I agree to the{' '}
                <a href="#" className="text-purple-200 hover:text-white transition-colors">
                  Terms and Conditions
                </a>
                {' '}and{' '}
                <a href="#" className="text-purple-200 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-purple-400 to-pink-600 text-white font-semibold py-3 rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-white/70 text-sm mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-purple-200 hover:text-white font-semibold transition-colors">
              Sign in
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-xs mt-6">
          We'll never share your email or personal information
        </p>
      </div>
    </div>
  );
}