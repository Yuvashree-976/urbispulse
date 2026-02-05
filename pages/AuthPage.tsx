
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Mail, 
  ArrowRight, 
  Smartphone, 
  KeyRound, 
  Loader2, 
  User as UserIcon, 
  Users, 
  Lock,
  ChevronLeft
} from 'lucide-react';
import { UserRole } from '../types';

const AuthPage: React.FC<{ setUser: (u: any) => void }> = ({ setUser }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'otp'>('signin');
  const [step, setStep] = useState(1); // 1: Role Choice, 2: Credentials
  const [role, setRole] = useState<UserRole>('Citizen');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ward: '',
    dept: '',
    password: ''
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelection = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMode('otp');
  };

  const finalizeLogin = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || 'Alex Johnson',
        email: formData.email || 'alex@example.com',
        role: role,
        ward: role === 'Ward Member' ? (formData.ward || 'Ward 12') : undefined,
        department: role === 'Admin' ? (formData.dept || 'Public Works') : undefined,
        trustScore: 780,
        points: 1250,
        badges: ['Early Adopter']
      };
      setUser(mockUser);
      setIsVerifying(false);
      navigate('/dashboard');
    }, 1500);
  };

  const containerVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-purple-500/10 blur-[100px] rounded-full"
        />
      </div>

      <motion.div 
        layout
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="w-full max-w-lg bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[3rem] shadow-2xl p-10 relative z-10 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {mode === 'otp' ? (
            <motion.div key="otp" variants={containerVariants} initial="initial" animate="animate" exit="exit" className="text-center">
               <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 rounded-3xl flex items-center justify-center text-indigo-600 mb-6 mx-auto">
                 <Lock className="w-8 h-8" />
               </div>
               <h2 className="text-3xl font-extrabold mb-2">Final Verification</h2>
               <p className="text-slate-500 text-sm mb-8">Enter the 6-digit code sent to your device.</p>
               
               <div className="flex gap-2 justify-center mb-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <input key={i} type="text" maxLength={1} className="w-10 h-12 bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 rounded-xl text-center font-bold text-xl outline-none" />
                ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={finalizeLogin}
                disabled={isVerifying}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 disabled:opacity-50"
              >
                {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Identity'}
              </motion.button>
            </motion.div>
          ) : step === 1 ? (
            <motion.div key="step1" variants={containerVariants} initial="initial" animate="animate" exit="exit">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/40 rounded-3xl flex items-center justify-center text-indigo-600 mb-6 mx-auto">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Select Your Role</h2>
                <p className="text-slate-500 text-sm">How would you like to participate in the portal?</p>
              </div>

              <div className="space-y-4">
                {[
                  { r: 'Citizen', icon: <UserIcon />, desc: 'Report issues and track resolutions in your ward.' },
                  { r: 'Ward Member', icon: <Users />, desc: 'Oversee and validate complaints within your assigned ward.' },
                  { r: 'Admin', icon: <Smartphone />, desc: 'System-wide monitoring and departmental management.' }
                ].map((item) => (
                  <motion.button
                    key={item.r}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelection(item.r as UserRole)}
                    className="w-full p-6 text-left border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-500 rounded-3xl flex items-center gap-6 transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.r}</h4>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="mt-8 text-center">
                 <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="text-sm font-bold text-indigo-600">
                   Already have an account? Sign In
                 </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="step2" variants={containerVariants} initial="initial" animate="animate" exit="exit">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors mb-6 text-sm font-bold">
                <ChevronLeft className="w-4 h-4" /> Back to Role Selection
              </button>

              <h2 className="text-2xl font-extrabold mb-6">
                {mode === 'signin' ? 'Sign In as ' : 'Register as '}{role}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Alex Johnson"
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 ring-indigo-500/20"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                )}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@example.com"
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 ring-indigo-500/20"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                {role === 'Ward Member' && mode === 'signup' && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Ward Assignment</label>
                    <select 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none"
                      value={formData.ward}
                      onChange={(e) => setFormData({...formData, ward: e.target.value})}
                    >
                      <option value="">Select Ward</option>
                      <option value="Ward 1">Ward 01 - North District</option>
                      <option value="Ward 4">Ward 04 - Central Plaza</option>
                      <option value="Ward 12">Ward 12 - Downtown</option>
                    </select>
                  </div>
                )}

                {role === 'Admin' && mode === 'signup' && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Department</label>
                    <select 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none"
                      value={formData.dept}
                      onChange={(e) => setFormData({...formData, dept: e.target.value})}
                    >
                      <option value="">Select Department</option>
                      <option value="Public Works">Public Works</option>
                      <option value="Health">Public Health</option>
                      <option value="Sanitation">Sanitation</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 ml-1">Password</label>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none focus:ring-2 ring-indigo-500/20"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 mt-4 shadow-xl shadow-indigo-100"
                >
                  {mode === 'signin' ? 'Sign In' : 'Complete Registration'} <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPage;
