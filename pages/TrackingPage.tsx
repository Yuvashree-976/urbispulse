
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Share2, 
  AlertCircle,
  CheckCircle2,
  Clock,
  User as UserIcon,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Complaint, User, ComplaintStatus } from '../types';

const timelineContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const timelineItem = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

const TrackingPage: React.FC<{ complaints: Complaint[], user: User | null, updateComplaint: (id: string, u: Partial<Complaint>) => void }> = ({ complaints, user, updateComplaint }) => {
  const { id } = useParams();
  const complaint = complaints.find(c => c.id === id);

  if (!complaint) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-black mb-4">Record Not Found</h2>
        <Link to="/dashboard" className="text-indigo-600 font-bold hover:underline">Return to Dashboard</Link>
      </div>
    );
  }

  const isPrivileged = user && (user.role === 'Admin' || user.role === 'Ward Member');

  const steps = [
    { label: 'Submitted', date: complaint.date, status: 'completed', icon: <CheckCircle2 /> },
    { label: 'Under Review', date: 'Processing phase', status: ['Under Review', 'Assigned', 'In Progress', 'Resolved'].includes(complaint.status) ? 'completed' : 'pending', icon: <CheckCircle2 /> },
    { label: 'Assigned', date: 'Routing to dept', status: ['Assigned', 'In Progress', 'Resolved'].includes(complaint.status) ? 'completed' : complaint.status === 'Under Review' ? 'active' : 'pending', icon: <ShieldCheck /> },
    { label: 'In Progress', date: 'Field intervention', status: ['In Progress', 'Resolved'].includes(complaint.status) ? 'completed' : complaint.status === 'Assigned' ? 'active' : 'pending', icon: <Zap /> },
    { label: 'Resolved', date: 'Final verification', status: complaint.status === 'Resolved' ? 'completed' : complaint.status === 'In Progress' ? 'active' : 'pending', icon: <CheckCircle2 /> },
  ];

  const advanceStatus = () => {
    const statusMap: Record<ComplaintStatus, ComplaintStatus> = {
      'Submitted': 'Under Review',
      'Under Review': 'Assigned',
      'Assigned': 'In Progress',
      'In Progress': 'Resolved',
      'Resolved': 'Resolved'
    };
    updateComplaint(complaint.id, { status: statusMap[complaint.status] });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
      >
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all text-sm font-bold group">
          <motion.div 
            whileHover={{ scale: 1.1, x: -5 }}
            className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border dark:border-slate-700 flex items-center justify-center shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.div>
          Back to Hub
        </Link>
        
        {isPrivileged && (
          <div className="flex items-center gap-3">
             <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
               Privileged Control Active
             </div>
             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={advanceStatus}
               disabled={complaint.status === 'Resolved'}
               className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
             >
               Advance Resolution <ChevronRight size={14} />
             </motion.button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Summary */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[3rem] p-10 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8">
               <motion.span 
                 animate={{ scale: complaint.severity === 'High' ? [1, 1.05, 1] : 1 }}
                 transition={{ repeat: Infinity, duration: 2 }}
                 className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${complaint.severity === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-500 border'}`}
               >
                 {complaint.severity} Priority
               </motion.span>
            </div>

            <div className="mb-8">
              <span className="text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase mb-3 block">Operational ID • {complaint.id}</span>
              <h1 className="text-4xl font-black tracking-tighter mb-4">{complaint.title}</h1>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl">
                  <MapPin size={16} className="text-indigo-400" /> {complaint.location}
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl">
                  <Calendar size={16} className="text-indigo-400" /> {complaint.date}
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border-2 border-dashed mb-10">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {complaint.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.02, rotate: i === 1 ? -1 : 1 }}
                  className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-[2rem] overflow-hidden relative group cursor-pointer shadow-md"
                >
                  <img src={`https://picsum.photos/seed/${complaint.id + i}/800/500`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Evidence" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="p-10 bg-indigo-600 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"
            ></motion.div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-6">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md"
                >
                  <Clock className="w-8 h-8" />
                </motion.div>
                <div>
                  <p className="text-[10px] text-indigo-100 font-black uppercase tracking-widest mb-1">Status Estimate</p>
                  <p className="text-3xl font-black">14h 20m Remaining</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: '#ffffff' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/90 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl"
              >
                Get Notifications
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Right: Lifecycle Timeline */}
        <div className="space-y-8">
          <motion.div 
            variants={timelineContainer}
            initial="hidden"
            animate="show"
            className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[3rem] p-10 shadow-sm"
          >
            <div className="flex items-center justify-between mb-10">
               <h3 className="font-bold text-xl tracking-tight">Incident Lifecycle</h3>
               <button className="p-2 text-slate-300 hover:text-slate-900 dark:hover:text-white"><MoreVertical size={20} /></button>
            </div>
            <div className="space-y-10 relative">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: '100%' }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute top-0 bottom-0 left-[23px] w-0.5 bg-slate-100 dark:bg-slate-800"
              ></motion.div>
              {steps.map((step, idx) => (
                <motion.div variants={timelineItem} key={idx} className="flex gap-8 relative">
                  <motion.div 
                    animate={{ 
                      scale: step.status === 'active' ? [1, 1.1, 1] : 1,
                      backgroundColor: step.status === 'completed' ? '#4f46e5' : 'rgba(255,255,255,1)',
                      borderColor: step.status === 'active' ? '#4f46e5' : step.status === 'completed' ? '#4f46e5' : '#f1f5f9'
                    }}
                    transition={step.status === 'active' ? { repeat: Infinity, duration: 2 } : {}}
                    className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 border-2 ${step.status === 'completed' ? 'text-white shadow-lg shadow-indigo-100' : step.status === 'active' ? 'text-indigo-600 shadow-xl shadow-indigo-50' : 'text-slate-300 dark:bg-slate-800 dark:border-slate-700'}`}
                  >
                    {React.cloneElement(step.icon as React.ReactElement, { className: 'w-6 h-6' })}
                  </motion.div>
                  <div className="pt-2">
                    <h4 className={`text-base font-bold tracking-tight ${step.status === 'pending' ? 'text-slate-300 dark:text-slate-600' : 'text-slate-900 dark:text-white'}`}>{step.label}</h4>
                    <p className="text-xs text-slate-400 font-medium mt-1">{step.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <AnimatePresence>
            {isPrivileged && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-slate-900 p-10 rounded-[3rem] text-white border border-white/5"
              >
                <h4 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <UserIcon size={20} className="text-indigo-400" /> Nexus Logs
                </h4>
                <div className="space-y-4">
                  {[
                    { label: 'Authorized Personnel', value: 'Officer 702', color: 'text-indigo-400' },
                    { label: 'Last Verification', value: '12m Ago', color: 'text-indigo-400' },
                    { label: 'Integrity Hash', value: '0x8f2...9a', color: 'text-slate-500 font-mono' }
                  ].map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="text-[10px] font-medium text-slate-400 flex justify-between uppercase"
                    >
                      <span>{log.label}</span>
                      <span className={log.color}>{log.value}</span>
                    </motion.div>
                  ))}
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 py-4 border-2 border-slate-800 hover:border-indigo-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Open Internal Ledger
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center"
          >
            <AlertCircle className="w-8 h-8 text-slate-200 mx-auto mb-4" />
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Report integrity is managed by cryptographically signed community pulses. All status changes are immutable and publicly logged in the City Pulse Ledger.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
