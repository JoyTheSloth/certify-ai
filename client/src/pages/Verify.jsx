import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Award, Calendar, Hash, Building2, User, ArrowLeft, RefreshCw, FileText } from 'lucide-react';

export default function Verify() {
  const { certificateId } = useParams();
  const [loading, setLoading] = useState(true);
  const [verificationData, setVerificationData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const verifyCertificate = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await axios.get(`/api/verify/${certificateId}`);
        setVerificationData(response.data);
      } catch (err) {
        console.error('Error verifying certificate:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (certificateId) {
      verifyCertificate();
    }
  }, [certificateId]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-xl z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {loading ? (
          <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center">
            <RefreshCw className="w-12 h-12 text-blue-400 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Verifying Certificate</h2>
            <p className="text-slate-400 text-sm">Querying secure verification registry...</p>
          </div>
        ) : error || !verificationData || verificationData.status === 'Invalid' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="glass-panel rounded-3xl p-8 border-red-500/30 text-center flex flex-col items-center relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>
            
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>

            <h1 className="text-2xl font-black text-red-400 tracking-wide uppercase mb-2">Invalid Certificate</h1>
            <p className="text-slate-400 text-sm max-w-sm mb-6">
              The certificate identifier <code className="px-1.5 py-0.5 bg-slate-900 rounded text-red-300 font-mono text-xs">{certificateId}</code> is not registered or has been revoked.
            </p>

            <div className="w-full border-t border-slate-800 pt-6 flex justify-center">
              <Link to="/" className="px-6 py-2.5 bg-slate-900 hover:bg-slate-850 rounded-xl text-slate-300 border border-slate-800 hover:border-slate-700 transition-all font-medium text-sm">
                Go to Homepage
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-panel rounded-3xl p-8 border-emerald-500/30 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none"></div>

            {/* Verified Header Badge */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                  <ShieldCheck className="w-7 h-7 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white leading-tight">Verified Credential</h1>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Registry Record Active</span>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full uppercase">
                  Valid Certificate
                </span>
              </div>
            </div>

            {/* Recipient Box */}
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 mb-6">
              <span className="text-[10px] text-blue-400 uppercase tracking-widest block font-bold mb-1">RECIPIENT NAME</span>
              <h2 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-slate-400" />
                {verificationData.recipientName}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/40">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-semibold mb-0.5">Award / Designation</span>
                  <span className="text-sm font-semibold text-slate-200 block">{verificationData.certificateTitle}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-semibold mb-0.5">Event or Course</span>
                  <span className="text-sm font-bold text-blue-400 block">{verificationData.courseName}</span>
                </div>
              </div>
            </div>

            {/* Registry Meta */}
            <div className="space-y-4 px-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  Issuing Organization
                </span>
                <span className="font-semibold text-slate-200">{verificationData.organizationName}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  Date of Issue
                </span>
                <span className="font-semibold text-slate-200">{verificationData.issueDate}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-slate-500" />
                  Certificate Number
                </span>
                <span className="font-mono text-xs text-slate-355">{verificationData.certificateNumber}</span>
              </div>
            </div>

            {/* Description Text */}
            <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-900 text-xs italic text-slate-400 leading-relaxed">
              &quot;{verificationData.description || 'This certificate was officially issued upon the successful completion of the requirements established by the issuing body.'}&quot;
            </div>

            {/* Instructors */}
            <div className="mt-6 flex justify-between items-center text-xs border-t border-slate-800/80 pt-6">
              <div>
                <span className="text-slate-500">Authorized Instructor:</span>
                <span className="font-bold text-slate-300 block">{verificationData.instructorName || 'N/A'}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500">Verification Registry:</span>
                <span className="font-mono text-slate-400 block text-[10px]">verify.mycertificate.com</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
