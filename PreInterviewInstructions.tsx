import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { 
  Shirt, 
  Home, 
  Video, 
  Monitor, 
  AlertTriangle,
  Mic,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

const PreInterviewInstructions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobId, applicationId, roundIndex } = location.state || {};

  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStartSystemCheck = () => {
    navigate("/candidate/system-check", { state: { jobId, applicationId, roundIndex } });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 font-sans">
      <motion.div 
        className="max-w-3xl mx-auto space-y-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Prepare for Your Interview
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Please follow these instructions carefully to ensure a smooth and fair interview experience.
          </p>
        </motion.div>

        {/* Guidelines Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Appearance */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Shirt className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-slate-800">Appearance Guidelines</h2>
            </div>
            <ul className="space-y-3 test-sm text-slate-600">
              <li className="flex gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span>Wear a plain, light-colored shirt (preferably white)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span>Ensure your face is clearly visible with proper lighting</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span>Sit upright and maintain a professional posture</span>
              </li>
            </ul>
          </div>

          {/* Environment Component */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Home className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-slate-800">Environment Setup</h2>
            </div>
            <ul className="space-y-3 test-sm text-slate-600">
              <li className="flex gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>Sit in a quiet, well-lit room</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>Ensure no other person is present around you</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 mt-1">•</span>
                <span>Avoid any background noise or distractions</span>
              </li>
            </ul>
          </div>

          {/* Camera & Behavior Components */}
          <div className="bg-white border border-rose-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-bl-[100%] z-0" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                  <Video className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-slate-800">Camera & Behavior Rules</h2>
              </div>
              <ul className="space-y-3 test-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Your face must remain visible at all times</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Do not look away from the screen frequently</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Strictly avoid using mobile phones, notes, or any external help</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Strictly avoid using mobile phones, notes, or any external help</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-rose-500 mt-1">•</span>
                  <span className="font-bold">Automated Disqualification:</span> <span>Switching tabs, exiting fullscreen, or losing focus more than 5 times will result in immediate termination.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* System Requirements Component */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Monitor className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-slate-800">System Requirements</h2>
            </div>
            <ul className="space-y-3 test-sm text-slate-600">
              <li className="flex gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>Use a stable internet connection</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>Ensure camera and microphone permissions are enabled</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span>Close all unnecessary applications before starting</span>
              </li>
            </ul>
          </div>

        </motion.div>

        {/* Read Aloud Confirmation */}
        <motion.div variants={itemVariants} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Mic className="w-5 h-5 text-blue-400" />
              <h2 className="font-bold text-lg">Read Aloud Confirmation</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4 italic">
              Please read the statement below clearly before proceeding:
            </p>
            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
              <p className="text-lg md:text-xl font-medium leading-relaxed text-slate-200">
                "I confirm that I am ready for the interview. I will not use any unfair means, and I will follow all the guidelines honestly."
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Area */}
        <motion.div variants={itemVariants} className="space-y-6 flex flex-col items-center">
          
          <div className="flex items-start space-x-3 p-4 bg-white border border-slate-200 rounded-xl w-full max-w-lg cursor-pointer hover:border-blue-300 transition-colors" onClick={() => setAgreed(!agreed)}>
            <Checkbox 
              id="agree" 
              checked={agreed} 
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-1 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
            />
            <label 
              htmlFor="agree" 
              className="text-sm font-medium leading-none cursor-pointer flex-1"
            >
              <span className="block mb-1 text-slate-800">I agree and I am ready to proceed</span>
              <span className="block text-xs text-slate-500 font-normal">I have read the confirmation text aloud and agree to follow all the rules.</span>
            </label>
          </div>

          <div className="w-full max-w-lg">
            <Button 
              className={`w-full h-14 text-lg font-bold rounded-xl transition-all shadow-lg ${
                agreed 
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25" 
                : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
              }`}
              onClick={handleStartSystemCheck}
              disabled={!agreed}
            >
              Start System Check <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-rose-500 text-sm font-semibold max-w-lg mx-auto text-center">
            <AlertTriangle className="w-4 h-4" />
            Any violation of the above rules may result in immediate disqualification.
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
};

export default PreInterviewInstructions;
