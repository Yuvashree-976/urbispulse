
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Menu, 
  X, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Globe,
  User as UserIcon,
  LogOut,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ComplaintForm from './pages/ComplaintForm';
import TrackingPage from './pages/TrackingPage';
import HeatmapPage from './pages/HeatmapPage';
import TransparencyPage from './pages/TransparencyPage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import { MOCK_COMPLAINTS } from './constants';
import { Complaint, User, ComplaintStatus } from './types';

const Navbar = ({ isDarkMode, toggleDarkMode, user, handleLogout }: { isDarkMode: boolean, toggleDarkMode: () => void, user: User | null, handleLogout: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Public Feed', path: '/transparency' },
    { name: 'Heatmap', path: '/heatmap' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass shadow-sm border-b px-4 md:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Activity className="w-8 h-8 text-indigo-600 pulse-soft" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
          UrbisPulse
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link 
            key={link.path} 
            to={link.path} 
            className={`text-sm font-medium transition-all hover:scale-105 ${location.pathname === link.path ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-300'}`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button onClick={toggleDarkMode} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-transform active:rotate-45">
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        {user ? (
          <div className="flex items-center gap-4 pl-4 border-l border-slate-200 dark:border-slate-700">
            <Link to="/dashboard" className="hidden sm:flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition-all">
                {user.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">{user.role}</p>
                <p className="text-xs font-bold leading-none mt-1">{user.name.split(' ')[0]}</p>
              </div>
            </Link>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Link to="/auth" className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-md">
            Enter Portal
          </Link>
        )}
        
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-500">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b md:hidden flex flex-col p-4 gap-4"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-semibold p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
              >
                {link.name}
              </Link>
            ))}
            {!user && <Link to="/auth" className="p-2 bg-indigo-600 text-white text-center rounded-lg font-bold">Sign In</Link>}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const AnimatedRoutes = ({ complaints, addComplaint, updateComplaint, user, setUser }: any) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="flex-1"
      >
        <Routes location={location}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage setUser={setUser} />} />
          <Route path="/dashboard" element={<Dashboard user={user} complaints={complaints} updateComplaint={updateComplaint} />} />
          <Route path="/admin" element={<AdminDashboard complaints={complaints} updateComplaint={updateComplaint} user={user} />} />
          <Route path="/file-complaint" element={<ComplaintForm addComplaint={addComplaint} />} />
          <Route path="/track/:id" element={<TrackingPage complaints={complaints} user={user} updateComplaint={updateComplaint} />} />
          <Route path="/heatmap" element={<HeatmapPage />} />
          <Route path="/transparency" element={<TransparencyPage complaints={complaints} />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);

  const addComplaint = (newComplaint: Complaint) => {
    setComplaints([newComplaint, ...complaints]);
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleLogout = () => {
    setUser(null);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} user={user} handleLogout={handleLogout} />
        
        <AnimatedRoutes 
          complaints={complaints} 
          addComplaint={addComplaint} 
          updateComplaint={updateComplaint}
          user={user} 
          setUser={setUser} 
        />

        <footer className="bg-white dark:bg-slate-900 border-t py-12 px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-6 h-6 text-indigo-600" />
                <span className="text-lg font-bold">UrbisPulse</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Transparent community governance and city-wide accountability.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to="/transparency" className="hover:text-indigo-600 transition-colors">Public Feed</Link></li>
                <li><Link to="/heatmap" className="hover:text-indigo-600 transition-colors">Incident Heatmap</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Portals</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to="/auth" className="hover:text-indigo-600 transition-colors">Citizen Login</Link></li>
                <li><Link to="/auth" className="hover:text-indigo-600 transition-colors">Officer Access</Link></li>
                <li><Link to="/admin" className="hover:text-indigo-600 transition-colors">Admin Console</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Integrity</h4>
              <p className="text-xs text-slate-400">All data on UrbisPulse is publicly verifiable and cryptographically signed.</p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400 uppercase tracking-widest font-black">
            © 2024 UrbisPulse • Empowering Local Sovereignty
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
