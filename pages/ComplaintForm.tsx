
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  MapPin, 
  AlertCircle,
  FileText,
  ImageIcon,
  Send,
  UserCheck,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../constants';
import { Complaint } from '../types';

const steps = [
  { id: 1, name: 'Category', icon: <AlertCircle className="w-4 h-4" /> },
  { id: 2, name: 'Details', icon: <FileText className="w-4 h-4" /> },
  { id: 3, name: 'Evidence', icon: <ImageIcon className="w-4 h-4" /> },
  { id: 4, name: 'Location', icon: <MapPin className="w-4 h-4" /> },
  { id: 5, name: 'Review', icon: <UserCheck className="w-4 h-4" /> },
];

const stepVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
    filter: 'blur(10px)',
  }),
  animate: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
    filter: 'blur(10px)',
    transition: { duration: 0.2 }
  })
};

const ComplaintForm: React.FC<{ addComplaint: (c: Complaint) => void }> = ({ addComplaint }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    location: '',
    isAnonymous: false
  });

  const nextStep = () => {
    setDirection(1);
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };
  const prevStep = () => {
    setDirection(-1);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    
    const newComplaint: Complaint = {
      id: `CT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: formData.title || 'Street Issue',
      category: CATEGORIES.find(c => c.id === formData.category)?.name || 'General',
      description: formData.description,
      status: 'Submitted',
      date: new Date().toISOString().split('T')[0],
      location: formData.location || 'Detected Ward',
      upvotes: 1,
      isAnonymous: formData.isAnonymous,
      severity: 'Medium'
    };
    
    addComplaint(newComplaint);
    setIsSubmitting(false);
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <motion.button
                whileHover={{ scale: 1.05, translateY: -5 }}
                whileTap={{ scale: 0.95 }}
                key={cat.id}
                onClick={() => { setFormData({...formData, category: cat.id}); nextStep(); }}
                className={`p-6 rounded-2xl border-2 transition-all text-center flex flex-col items-center gap-3 relative overflow-hidden ${formData.category === cat.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${cat.color} shadow-lg shadow-black/10`}>
                  {cat.icon}
                </div>
                <span className="font-semibold text-sm">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Complaint Title</label>
              <input 
                type="text" 
                placeholder="Brief summary (e.g. Broken pothole)"
                className="w-full px-4 py-3 rounded-xl border dark:border-slate-700 dark:bg-slate-800 focus:ring-2 ring-indigo-500/20 outline-none transition-all"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Detailed Description</label>
              <textarea 
                rows={5}
                placeholder="What exactly is the issue?"
                className="w-full px-4 py-3 rounded-xl border dark:border-slate-700 dark:bg-slate-800 focus:ring-2 ring-indigo-500/20 outline-none transition-all resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
            <motion.label 
              whileHover={{ backgroundColor: 'rgba(79, 70, 229, 0.05)' }}
              className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border cursor-pointer transition-colors"
            >
              <input 
                type="checkbox" 
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                className="w-5 h-5 accent-indigo-600"
              />
              <span className="text-sm font-medium">Keep my identity private</span>
            </motion.label>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl p-12 text-center hover:border-indigo-400 transition-colors group cursor-pointer"
            >
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4 group-hover:text-indigo-400 transition-colors" />
              </motion.div>
              <p className="text-lg font-semibold mb-1">Upload Photo Evidence</p>
              <p className="text-sm text-slate-500 mb-6">Visual proof helps speed up resolution.</p>
              <span className="px-6 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold">Browse Files</span>
            </motion.div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="relative h-64 rounded-3xl bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/locationmap/800/400')] bg-cover opacity-60"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <motion.div 
                   animate={{ 
                    y: [0, -15, 0],
                    scale: [1, 1.1, 1],
                    filter: ["drop-shadow(0 0 0px rgba(79, 70, 229, 0))", "drop-shadow(0 10px 10px rgba(79, 70, 229, 0.3))", "drop-shadow(0 0 0px rgba(79, 70, 229, 0))"]
                   }}
                   transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                 >
                   <MapPin className="w-12 h-12 text-indigo-600 fill-indigo-100" />
                 </motion.div>
              </div>
            </div>
            <input 
              type="text" 
              placeholder="Enter specific address or landmark"
              className="w-full px-4 py-3 rounded-xl border dark:border-slate-700 dark:bg-slate-800 outline-none"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{formData.title || "Untitled Report"}</h3>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">PREVIEW</span>
              </div>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                {formData.description || "No description provided."}
              </p>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <MapPin className="w-4 h-4" /> {formData.location || "Automatic Location Tracking Enabled"}
              </div>
            </div>
            
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl flex gap-3"
            >
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                AI classifies this as <strong>Infrastructure</strong>. Suggested priority: <strong>Medium</strong>.
              </p>
            </motion.div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12"
      >
        <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Register New Grievance</h2>
        <p className="text-slate-500">Transparent reporting for a better community.</p>
      </motion.div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-12 relative px-2">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0"></div>
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 15 }}
        ></motion.div>
        
        {steps.map((step) => (
          <div key={step.id} className="relative z-10">
            <motion.div 
              animate={{ 
                scale: currentStep === step.id ? 1.25 : 1,
                backgroundColor: currentStep >= step.id ? '#4f46e5' : 'rgba(255,255,255,1)',
                color: currentStep >= step.id ? '#fff' : '#94a3b8'
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep >= step.id ? 'border-indigo-600 shadow-lg shadow-indigo-200' : 'dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}
            >
              {currentStep > step.id ? <Check className="w-5 h-5" /> : step.icon}
            </motion.div>
            <motion.span 
              animate={{ opacity: currentStep === step.id ? 1 : 0.5, y: currentStep === step.id ? 0 : 5 }}
              className="absolute top-12 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap text-slate-400"
            >
              {step.name}
            </motion.span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[2.5rem] shadow-xl p-8 md:p-12 relative overflow-hidden min-h-[400px]">
        {isSubmitting && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="absolute inset-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4"
           >
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
              <p className="font-bold text-lg text-slate-700 dark:text-slate-200">AI Analyzing & Routing...</p>
           </motion.div>
        )}
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div 
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 pt-8 border-t dark:border-slate-800 flex justify-between">
          <motion.button 
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 text-slate-500 font-bold hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-0 flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </motion.button>
          
          {currentStep === steps.length ? (
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(79, 70, 229, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFinalSubmit}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all"
            >
              Confirm & Publish <Send className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              className="px-8 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all group"
            >
              Continue <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
