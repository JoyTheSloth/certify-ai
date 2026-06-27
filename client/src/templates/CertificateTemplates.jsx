import React from 'react';
import { 
  GuillocheWatermark, 
  OrnateCorner, 
  TechMesh, 
  GoldenVeins 
} from './VectorPatterns';

// Default Logo and Signature SVG place-holders to ensure they look beautiful even if not uploaded
const DefaultLogo = () => (
  <svg className="w-12 h-12 text-slate-400 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11.5c0-.733.161-1.43.45-2.06m8.022 7.24a13.923 13.923 0 01-3.44 2.04m0 0V18m0 0a3 3 0 01-3-3V11.5M9 11.5a3 3 0 013-3V6.22c0-1.026.544-1.972 1.425-2.5l2.428-1.457a1 1 0 011.037.039l2.428 1.457c.88.528 1.425 1.474 1.425 2.5V8.5a3 3 0 01-3 3M8.823 4.237A9.13 9.13 0 0012 4c.797 0 1.558.102 2.283.293M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

const DefaultSignature = ({ color = "#1e293b", text = "Instructor" }) => (
  <span className="font-great text-3xl opacity-80" style={{ color }}>
    {text}
  </span>
);

// Standard Ribbon Gold Seal SVG
const GoldSeal = ({ text = "OFFICIAL" }) => (
  <div className="relative w-20 h-20 flex items-center justify-center select-none">
    {/* Ribbon 1 */}
    <div className="absolute top-1/2 left-6 w-4 h-16 bg-red-600 origin-top rotate-12 transform shadow-md" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%)'}}></div>
    {/* Ribbon 2 */}
    <div className="absolute top-1/2 left-10 w-4 h-16 bg-red-700 origin-top -rotate-12 transform shadow-md" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%)'}}></div>
    {/* Gold Sunburst Seal */}
    <div className="absolute w-16 h-16 bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg border border-amber-300">
      <div className="w-13 h-13 rounded-full border border-dashed border-amber-100 flex items-center justify-center text-center">
        <span className="text-[7px] font-bold text-amber-950 font-cinzel leading-none select-none">
          {text}<br/>SEAL
        </span>
      </div>
      {/* Decorative stars */}
      <div className="absolute inset-0 w-full h-full animate-pulse opacity-40 rounded-full border-2 border-yellow-200 scale-95"></div>
    </div>
  </div>
);

// Red Wax Seal SVG
const RedSeal = ({ text = "ACADEMIC" }) => (
  <div className="relative w-20 h-20 flex items-center justify-center select-none">
    {/* Red Ribbon */}
    <div className="absolute top-1/2 left-8 w-4 h-14 bg-yellow-600 origin-top rotate-6 transform shadow" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%)'}}></div>
    <div className="absolute top-1/2 left-10 w-4 h-14 bg-yellow-700 origin-top -rotate-6 transform shadow" style={{clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%)'}}></div>
    {/* Wax Seal */}
    <div className="absolute w-16 h-16 bg-gradient-to-br from-red-500 via-red-700 to-red-900 rounded-full flex items-center justify-center shadow-md border-2 border-red-500/50">
      <div className="w-12 h-12 rounded-full border border-red-400/40 flex items-center justify-center text-center">
        <span className="text-[6px] font-bold text-red-100 font-serif leading-none tracking-widest">
          {text}<br/>DEPT
        </span>
      </div>
    </div>
  </div>
);

// 1. Classic Gold Template
export const ClassicGold = ({ data }) => {
  return (
    <div className="cert-base bg-amber-50/20 flex flex-col justify-between p-12 text-slate-800 font-serif relative overflow-hidden" style={{ backgroundColor: '#FAF9F5', backgroundImage: 'radial-gradient(#E8E2D2 1.2px, transparent 0)', backgroundSize: '20px 20px' }}>
      {/* Background Guilloche Watermark */}
      <GuillocheWatermark color="#D97706" className="opacity-[0.035]" />

      {/* Ornate Gold Corners */}
      <OrnateCorner className="absolute top-6 left-6 text-amber-600/25" />
      <OrnateCorner className="absolute top-6 right-6 text-amber-600/25 rotate-90" />
      <OrnateCorner className="absolute bottom-6 left-6 text-amber-600/25 -rotate-90" />
      <OrnateCorner className="absolute bottom-6 right-6 text-amber-600/25 rotate-180" />

      {/* Ornate Gold Border */}
      <div className="absolute inset-4 border-[6px] border-amber-600/20 pointer-events-none rounded"></div>
      <div className="absolute inset-6 border-2 border-amber-600/40 pointer-events-none rounded"></div>
      <div className="absolute inset-8 border border-amber-600/10 pointer-events-none rounded"></div>
      
      {/* Top Header */}
      <div className="flex justify-between items-start z-10">
        <div className="w-24 h-24 flex items-center justify-center">
          {data.logoImage ? (
            <img src={data.logoImage} alt="Logo" className="max-w-full max-h-full object-contain" />
          ) : (
            <DefaultLogo />
          )}
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-bold font-sans">Certificate No.</span>
          <span className="text-sm font-mono font-medium text-slate-600">{data.certificateNumber || 'N/A'}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center flex-grow flex flex-col justify-center my-6 z-10 px-8">
        <h1 className="text-3xl lg:text-4xl text-amber-700 font-bold tracking-wide uppercase font-cinzel mb-2">
          {data.certificateTitle || 'Certificate of Appreciation'}
        </h1>
        <p className="text-xs italic tracking-widest text-slate-500 uppercase font-sans mb-4">This Is Proudly Presented To</p>
        
        <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 border-b border-amber-400/40 pb-2 inline-block mx-auto min-w-[300px] max-w-[600px] font-serif tracking-wider font-bold">
          {data.recipientName || '[Recipient Name]'}
        </h2>
        
        <p className="text-sm text-slate-600 mt-4 leading-relaxed max-w-[620px] mx-auto italic">
          {data.description || 'For outstanding dedication, performance, and contribution during the events and workshops associated with the curriculum.'}
        </p>

        <div className="mt-4 font-sans text-sm font-semibold text-amber-800">
          {data.courseName || '[Course or Event Name]'}
        </div>
      </div>

      {/* Footer Details */}
      <div className="flex justify-between items-end z-10 border-t border-amber-600/10 pt-4">
        {/* Date */}
        <div className="w-1/3 text-left">
          <p className="text-xs uppercase font-sans tracking-wider text-slate-400">Date of Issue</p>
          <p className="text-sm font-medium font-sans text-slate-700 mt-1">{data.issueDate || 'N/A'}</p>
          <p className="text-xs italic text-amber-800 mt-1 font-sans font-bold">{data.organizationName || '[Organization]'}</p>
        </div>

        {/* Official Seal */}
        <div className="w-1/3 flex justify-center">
          <GoldSeal text="EXCELLENCE" />
        </div>

        {/* Signature & QR */}
        <div className="w-1/3 flex flex-col items-end">
          <div className="flex items-center gap-4">
            {/* QR Code */}
            {data.verificationUrl && (
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=60&data=${encodeURIComponent(data.verificationUrl)}`}
                alt="Verification QR"
                className="w-12 h-12 border border-slate-200 p-0.5 bg-white rounded shadow-sm"
              />
            )}
            
            {/* Signature Area */}
            <div className="text-center min-w-[120px]">
              <div className="h-10 flex items-center justify-center">
                {data.signatureImage ? (
                  <img src={data.signatureImage} alt="Signature" className="max-w-[120px] max-h-full object-contain" />
                ) : (
                  <DefaultSignature color="#b45309" text={data.instructorName} />
                )}
              </div>
              <div className="w-full border-t border-amber-600/30 mt-1"></div>
              <span className="text-[10px] uppercase font-sans tracking-widest text-slate-400 block mt-1">Authorized Signature</span>
              <span className="text-[10px] font-sans font-semibold text-slate-600">{data.instructorName || '[Instructor Name]'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Modern Blue Template
export const ModernBlue = ({ data }) => {
  return (
    <div className="cert-base bg-white flex text-slate-800 font-sans relative overflow-hidden">
      {/* Geometric Decorative Left Panel (Light blue gradient) */}
      <div className="w-1/4 bg-gradient-to-b from-indigo-50 to-sky-100 p-6 flex flex-col justify-between items-center text-slate-800 border-r border-slate-200/80 relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl"></div>
        
        {/* Logo at Top Left */}
        <div className="w-16 h-16 bg-white/80 rounded-xl flex items-center justify-center p-2 border border-indigo-100 mt-4 shadow-sm">
          {data.logoImage ? (
            <img src={data.logoImage} alt="Logo" className="max-w-full max-h-full object-contain filter brightness-100" />
          ) : (
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
            </svg>
          )}
        </div>
 
        {/* QR & Verification in Center Left */}
        <div className="flex flex-col items-center text-center px-2">
          {data.verificationUrl && (
            <div className="bg-white p-1 rounded-lg shadow-sm border border-indigo-100 mb-2">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=65&data=${encodeURIComponent(data.verificationUrl)}`}
                alt="Verification QR"
                className="w-14 h-14"
              />
            </div>
          )}
          <span className="text-[8px] uppercase tracking-wider text-slate-500">Scan to Verify</span>
          <span className="text-[8px] font-mono text-indigo-700 mt-1 select-all break-all max-w-[100px] overflow-hidden truncate">
            {data.certificateNumber || 'N/A'}
          </span>
        </div>
 
        {/* Footer Organization Left */}
        <div className="text-center mb-4">
          <span className="text-[9px] uppercase tracking-widest text-indigo-600 block font-bold">ISSUING BODY</span>
          <span className="text-xs font-semibold text-slate-700 mt-1 block">{data.organizationName || '[Organization]'}</span>
        </div>
      </div>

      {/* Main Right Content Panel */}
      <div className="w-3/4 p-12 flex flex-col justify-between relative bg-slate-50">
        {/* Tech grid dot mesh background */}
        <TechMesh className="opacity-[0.04] text-indigo-900" />
        
        {/* Accent Top Blue Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 to-sky-500"></div>
        {/* Subtle background graphics */}
        <div className="absolute top-10 right-10 w-48 h-48 border border-slate-200/50 rounded-full pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-64 h-64 border border-slate-100 rounded-full pointer-events-none"></div>

        {/* Header Title */}
        <div className="flex justify-between items-start mt-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 font-montserrat">
              {data.certificateTitle || 'Certificate of Completion'}
            </h1>
            <div className="h-1 w-20 bg-indigo-500 mt-2"></div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Date of Achievement</span>
            <span className="text-sm font-semibold text-slate-700 mt-1 block">{data.issueDate || 'N/A'}</span>
          </div>
        </div>

        {/* Recipient Details */}
        <div className="my-auto py-4">
          <span className="text-xs uppercase tracking-widest text-indigo-600 font-bold block mb-1">PROUDLY PRESENTED TO</span>
          <h2 className="text-3xl font-bold text-slate-800 font-sans tracking-wide">
            {data.recipientName || '[Recipient Name]'}
          </h2>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-[500px]">
            {data.description || 'Has successfully fulfilled all learning requirements, completed assignments, and demonstrated competence in the course.'}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold uppercase tracking-wider">
              {data.courseName || '[Course Name]'}
            </span>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end border-t border-slate-200 pt-4">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block">Certificate Identifier</span>
            <span className="text-xs font-mono text-slate-600">{data.certificateNumber || 'ID-UNKNOWN'}</span>
          </div>

          <div className="text-center min-w-[130px]">
            <div className="h-8 flex items-center justify-center">
              {data.signatureImage ? (
                <img src={data.signatureImage} alt="Signature" className="max-w-[120px] max-h-full object-contain" />
              ) : (
                <DefaultSignature color="#4f46e5" text={data.instructorName} />
              )}
            </div>
            <div className="w-full border-t border-slate-300 mt-1"></div>
            <span className="text-[9px] uppercase text-slate-400 tracking-wider block mt-1">Instructor / Signee</span>
            <span className="text-[10px] font-bold text-slate-700">{data.instructorName || '[Instructor Name]'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Minimal White Template
export const MinimalWhite = ({ data }) => {
  return (
    <div className="cert-base bg-white flex flex-col justify-between p-12 text-slate-900 font-sans relative">
      {/* Ultra Minimal 1px border with pad */}
      <div className="absolute inset-8 border border-slate-200 pointer-events-none"></div>

      {/* Header */}
      <div className="flex justify-between items-start z-10 mt-4 px-4">
        <div className="flex items-center gap-2">
          {data.logoImage ? (
            <img src={data.logoImage} alt="Logo" className="w-10 h-10 object-contain" />
          ) : (
            <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center"><span className="text-[10px] text-white font-bold">C</span></div>
          )}
          <span className="text-xs tracking-widest font-semibold uppercase text-slate-500">{data.organizationName || '[Organization]'}</span>
        </div>
        <div className="text-right">
          <span className="text-[9px] uppercase tracking-widest text-slate-400 block font-semibold">NO: {data.certificateNumber || 'N/A'}</span>
        </div>
      </div>

      {/* Body */}
      <div className="text-left flex-grow flex flex-col justify-center my-6 z-10 px-12">
        <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block mb-2">CERTIFICATION OF</span>
        <h1 className="text-4xl font-light tracking-tight text-slate-900 uppercase font-sans mb-4">
          {data.certificateTitle || 'EXEMPLARY ACHIEVEMENT'}
        </h1>
        
        <div className="h-[2px] w-12 bg-slate-900 my-4"></div>
        
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mt-4">THIS CERTIFIES THAT</p>
        <h2 className="text-3xl font-semibold text-slate-900 font-sans tracking-wide mt-1">
          {data.recipientName || '[Recipient Name]'}
        </h2>
        
        <p className="text-sm text-slate-500 font-light mt-4 leading-relaxed max-w-[550px]">
          {data.description || 'For completing requirements for proficiency and technical capability. This certificate is awarded as validation of professional standards.'}
        </p>

        <p className="text-xs uppercase tracking-wider text-slate-800 font-bold mt-4">
          {data.courseName || '[Course Name]'}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end z-10 border-t border-slate-100 pt-6 px-4">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 block">DATED</span>
          <span className="text-xs font-semibold text-slate-700 font-mono">{data.issueDate || 'N/A'}</span>
        </div>

        {/* Minimal Signature */}
        <div className="text-left min-w-[130px]">
          <div className="h-8 flex items-end">
            {data.signatureImage ? (
              <img src={data.signatureImage} alt="Signature" className="max-w-[110px] max-h-full object-contain" />
            ) : (
              <span className="font-serif italic text-lg text-slate-800">{data.instructorName || 'Authorized Signature'}</span>
            )}
          </div>
          <div className="w-full border-t border-slate-900 mt-1"></div>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 block mt-1">{data.instructorName || 'Director'}</span>
        </div>

        {/* QR Code */}
        {data.verificationUrl && (
          <div>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=50&data=${encodeURIComponent(data.verificationUrl)}`}
              alt="Verification QR"
              className="w-10 h-10 filter grayscale contrast-125"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// 4. Elegant Black Template (Ivory & Gold Theme)
export const ElegantBlack = ({ data }) => {
  return (
    <div className="cert-base bg-stone-50 flex flex-col justify-between p-12 text-stone-850 font-serif relative overflow-hidden" style={{ backgroundColor: '#FCFAF2' }}>
      {/* Golden Marble Veins Pattern */}
      <GoldenVeins className="opacity-[0.08]" />
 
      {/* Guilloche center watermark */}
      <GuillocheWatermark color="#D97706" className="opacity-[0.02]" />
 
      {/* Decorative Gold Corner Borders */}
      <div className="absolute inset-4 border border-amber-600/15 pointer-events-none rounded"></div>
      <div className="absolute inset-6 border-[2px] border-amber-600/35 pointer-events-none rounded"></div>
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/2 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/2 rounded-full blur-3xl pointer-events-none"></div>
 
      {/* Header */}
      <div className="flex justify-between items-start z-10">
        <div className="w-16 h-16 flex items-center justify-center p-1 bg-white border border-amber-600/20 rounded-lg shadow-sm">
          {data.logoImage ? (
            <img src={data.logoImage} alt="Logo" className="max-w-full max-h-full object-contain filter brightness-100" />
          ) : (
            <DefaultLogo />
          )}
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-[9px] uppercase tracking-widest text-amber-800 font-bold font-sans">Verification ID</span>
          <span className="text-xs font-mono font-medium text-stone-600 mt-0.5">{data.certificateNumber || 'N/A'}</span>
        </div>
      </div>
 
      {/* Main Content */}
      <div className="text-center flex-grow flex flex-col justify-center my-4 z-10 px-8">
        <h1 className="text-3xl lg:text-4xl text-gradient bg-gradient-to-r from-amber-700 via-amber-900 to-amber-800 font-bold tracking-widest uppercase font-cinzel mb-1 drop-shadow-sm">
          {data.certificateTitle || 'Certificate of Excellence'}
        </h1>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto mb-4"></div>
        
        <p className="text-[10px] tracking-widest text-amber-800/80 uppercase font-sans mb-3">IS HEREBY CONFERRED UPON</p>
        
        <h2 className="text-3xl lg:text-4xl font-extrabold text-stone-900 font-serif tracking-wider font-bold mb-4">
          {data.recipientName || '[Recipient Name]'}
        </h2>
        
        <p className="text-xs text-stone-600 leading-relaxed max-w-[600px] mx-auto italic font-sans font-light">
          {data.description || 'For demonstrating exceptional mastery, professional competence, and outstanding dedication throughout the certification process.'}
        </p>
 
        <div className="mt-4 font-sans text-sm font-semibold text-amber-850 tracking-wider">
          {data.courseName || '[Course or Event Name]'}
        </div>
      </div>
 
      {/* Footer */}
      <div className="flex justify-between items-end z-10 border-t border-amber-500/20 pt-4">
        {/* Date */}
        <div className="w-1/3 text-left font-sans">
          <p className="text-[9px] uppercase tracking-wider text-stone-400">Date Issued</p>
          <p className="text-xs font-medium text-stone-700 mt-1">{data.issueDate || 'N/A'}</p>
          <p className="text-xs font-semibold text-amber-850 mt-0.5">{data.organizationName || '[Organization]'}</p>
        </div>
 
        {/* Seal */}
        <div className="w-1/3 flex justify-center">
          <GoldSeal text="EXCELLENCE" />
        </div>
 
        {/* Signature & QR */}
        <div className="w-1/3 flex flex-col items-end">
          <div className="flex items-center gap-4">
            {/* QR Code */}
            {data.verificationUrl && (
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=60&data=${encodeURIComponent(data.verificationUrl)}`}
                alt="Verification QR"
                className="w-12 h-12 border border-amber-600/20 p-0.5 bg-white rounded shadow-sm"
              />
            )}
            
            {/* Signature Area */}
            <div className="text-center min-w-[120px] font-sans">
              <div className="h-10 flex items-center justify-center">
                {data.signatureImage ? (
                  <img src={data.signatureImage} alt="Signature" className="max-w-[120px] max-h-full object-contain filter brightness-90" />
                ) : (
                  <DefaultSignature color="#78350f" text={data.instructorName} />
                )}
              </div>
              <div className="w-full border-t border-amber-500/40 mt-1"></div>
              <span className="text-[9px] uppercase tracking-widest text-slate-500 block mt-1">ISSUED BY</span>
              <span className="text-[10px] font-bold text-stone-700">{data.instructorName || '[Instructor Name]'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Corporate Template
export const Corporate = ({ data }) => {
  return (
    <div className="cert-base bg-slate-50 flex flex-col justify-between p-12 text-slate-800 font-sans relative overflow-hidden">
      {/* Background dot-line tech grid mesh */}
      <TechMesh className="opacity-[0.02] text-slate-800" />

      {/* Corporate Styling: Double Blue Bars on top and bottom */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-sky-900"></div>
      <div className="absolute top-4 left-0 right-0 h-1 bg-sky-500"></div>
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-sky-900"></div>
      
      {/* Decorative vertical lines */}
      <div className="absolute left-6 top-8 bottom-8 w-[1px] bg-slate-200"></div>
      <div className="absolute right-6 top-8 bottom-8 w-[1px] bg-slate-200"></div>

      {/* Header */}
      <div className="flex justify-between items-center z-10 mt-4 px-4">
        <div className="flex items-center gap-3">
          {data.logoImage ? (
            <img src={data.logoImage} alt="Logo" className="w-12 h-12 object-contain" />
          ) : (
            <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-white font-bold text-lg">C</div>
          )}
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 tracking-wide">{data.organizationName || 'CORPORATE ACADEMY'}</h3>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest">Global Professional Education</p>
          </div>
        </div>
        
        <div className="text-right">
          <span className="px-2.5 py-1 bg-sky-50 border border-sky-100 text-sky-900 text-xs font-mono rounded">
            {data.certificateNumber || 'CERT-NO-N/A'}
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="text-center flex-grow flex flex-col justify-center my-4 z-10 px-8">
        <span className="text-xs font-bold tracking-widest text-sky-600 uppercase block mb-1">PROUDLY PRESENTING THIS CERTIFICATE OF</span>
        <h1 className="text-3xl lg:text-4xl text-slate-900 font-black tracking-tight uppercase mb-4">
          {data.certificateTitle || 'Professional Completion'}
        </h1>
        
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">WHICH RECOGNIZES THE ACCOMPLISHMENT OF</p>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-wide font-montserrat border-b-2 border-slate-200 pb-1 max-w-[500px] mx-auto">
          {data.recipientName || '[Recipient Name]'}
        </h2>
        
        <p className="text-sm text-slate-600 mt-4 max-w-[580px] mx-auto">
          {data.description || 'For completing the corporate certification curriculum, practical labs, and showing the required capabilities expected by the board of directory review.'}
        </p>

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-xs uppercase text-slate-400 font-bold">COURSE:</span>
          <span className="text-xs font-bold text-sky-950 bg-sky-100/50 px-2.5 py-0.5 rounded">{data.courseName || '[Course Name]'}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end z-10 px-4 pt-4 border-t border-slate-100">
        <div>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 block">DATE OF ISSUE</span>
          <span className="text-xs font-bold text-slate-700 mt-0.5 block">{data.issueDate || 'N/A'}</span>
        </div>

        {/* Verification QR */}
        {data.verificationUrl && (
          <div className="flex items-center gap-2 bg-slate-100/60 p-1.5 rounded-lg border border-slate-200/50">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=45&data=${encodeURIComponent(data.verificationUrl)}`}
              alt="Verification QR"
              className="w-10 h-10"
            />
            <div className="text-left">
              <span className="text-[8px] font-bold text-slate-500 block leading-none">VERIFIED</span>
              <span className="text-[7px] text-slate-400 block mt-0.5 font-mono">Scan QR Code</span>
            </div>
          </div>
        )}

        {/* Signature */}
        <div className="text-center min-w-[130px]">
          <div className="h-8 flex items-center justify-center">
            {data.signatureImage ? (
              <img src={data.signatureImage} alt="Signature" className="max-w-[120px] max-h-full object-contain" />
            ) : (
              <DefaultSignature color="#0c4a6e" text={data.instructorName} />
            )}
          </div>
          <div className="w-full border-t border-slate-300 mt-1"></div>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 block mt-0.5">MANAGING DIRECTOR</span>
          <span className="text-[10px] font-bold text-slate-700">{data.instructorName || '[Instructor Name]'}</span>
        </div>
      </div>
    </div>
  );
};

// 6. Academic Template
export const Academic = ({ data }) => {
  return (
    <div className="cert-base bg-amber-50/10 flex flex-col justify-between p-12 text-stone-850 font-serif relative overflow-hidden" style={{ backgroundColor: '#FAF9F4' }}>
      {/* Center security rosette */}
      <GuillocheWatermark color="#78350F" className="opacity-[0.03]" />

      {/* Gothic Corners */}
      <OrnateCorner className="absolute top-6 left-6 text-amber-900/15" />
      <OrnateCorner className="absolute top-6 right-6 text-amber-900/15 rotate-90" />
      <OrnateCorner className="absolute bottom-6 left-6 text-amber-900/15 -rotate-90" />
      <OrnateCorner className="absolute bottom-6 right-6 text-amber-900/15 rotate-180" />

      {/* Old University Style Border */}
      <div className="absolute inset-4 border-[4px] border-amber-900 pointer-events-none"></div>
      <div className="absolute inset-6 border border-amber-900/50 pointer-events-none"></div>
      {/* Ornate corners */}
      <div className="absolute top-4 left-4 w-6 h-6 border-b-4 border-r-4 border-transparent pointer-events-none bg-amber-900"></div>
      <div className="absolute top-4 right-4 w-6 h-6 border-b-4 border-l-4 border-transparent pointer-events-none bg-amber-900"></div>
      <div className="absolute bottom-4 left-4 w-6 h-6 border-t-4 border-r-4 border-transparent pointer-events-none bg-amber-900"></div>
      <div className="absolute bottom-4 right-4 w-6 h-6 border-t-4 border-l-4 border-transparent pointer-events-none bg-amber-900"></div>

      {/* Top Header */}
      <div className="text-center z-10 mt-2">
        <h4 className="text-sm font-bold uppercase tracking-widest text-amber-900 font-cinzel">{data.organizationName || 'UNIVERSITY ACCREDITATION BOARD'}</h4>
        <div className="w-16 h-px bg-amber-900/30 mx-auto mt-2"></div>
      </div>

      {/* Main Body */}
      <div className="text-center flex-grow flex flex-col justify-center my-2 z-10 px-12">
        <h1 className="text-3xl font-extrabold text-stone-900 font-cinzel mb-2 tracking-wide uppercase">
          {data.certificateTitle || 'Diploma of Graduation'}
        </h1>
        
        <p className="text-xs italic text-stone-500 max-w-[500px] mx-auto mt-1 leading-relaxed">
          Be it known that, on recommendation of the faculty, the trustees of the academy have conferred upon
        </p>

        <h2 className="text-3xl font-bold font-great text-amber-900 my-2 select-all leading-relaxed">
          {data.recipientName || '[Recipient Name]'}
        </h2>
        
        <p className="text-xs italic text-stone-500 max-w-[500px] mx-auto leading-relaxed">
          this certificate to confirm the completion of academic study and exams for
        </p>

        <div className="text-sm font-bold text-stone-850 mt-1 uppercase font-cinzel tracking-wider">
          {data.courseName || '[Course Name]'}
        </div>

        <p className="text-[11px] text-stone-600 max-w-[550px] mx-auto italic mt-3">
          {data.description || 'Awarded with all the honors, rights, and privileges pertaining to this accomplishment.'}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end z-10 border-t border-amber-900/20 pt-4 px-2">
        <div className="w-1/3 text-left">
          <span className="text-[9px] uppercase tracking-wider text-stone-400 font-sans block">ISSUED AT</span>
          <span className="text-xs font-semibold text-stone-700 font-sans block">{data.issueDate || 'N/A'}</span>
          <span className="text-[9px] font-mono text-stone-400 mt-1 block select-all">NO: {data.certificateNumber || 'N/A'}</span>
        </div>

        <div className="w-1/3 flex justify-center">
          <RedSeal text="ACADEMIC" />
        </div>

        {/* Signature & QR */}
        <div className="w-1/3 flex flex-col items-end">
          <div className="flex items-center gap-3">
            {data.verificationUrl && (
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=50&data=${encodeURIComponent(data.verificationUrl)}`}
                alt="Verification QR"
                className="w-10 h-10 border border-stone-200 p-0.5 bg-white rounded shadow-sm"
              />
            )}
            
            <div className="text-center min-w-[110px]">
              <div className="h-8 flex items-center justify-center">
                {data.signatureImage ? (
                  <img src={data.signatureImage} alt="Signature" className="max-w-[110px] max-h-full object-contain" />
                ) : (
                  <DefaultSignature color="#78350f" text={data.instructorName} />
                )}
              </div>
              <div className="w-full border-t border-stone-400 mt-1"></div>
              <span className="text-[9px] uppercase tracking-wider text-stone-400 block mt-0.5">ACADEMIC DEAN</span>
              <span className="text-[10px] font-bold text-stone-700 block leading-tight">{data.instructorName || '[Dean Name]'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 7. Luxury Premium Template
export const LuxuryPremium = ({ data }) => {
  return (
    <div className="cert-base bg-emerald-50/10 flex flex-col justify-between p-12 text-emerald-950 font-serif relative overflow-hidden" style={{ backgroundColor: '#F4F8F5' }}>
      {/* Luxurious Gold Marble Veins */}
      <GoldenVeins className="opacity-[0.10]" />
 
      {/* Golden center watermark rosette */}
      <GuillocheWatermark color="#10B981" className="opacity-[0.02]" />
 
      {/* Background radial gold glow and pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1.2px,transparent_0)] opacity-[0.015]" style={{ backgroundSize: '32px 32px' }}></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/2 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-500/2 rounded-full blur-3xl"></div>
      
      {/* Gold Scrollwork Borders */}
      <div className="absolute inset-5 border-[3px] border-amber-600/25 pointer-events-none rounded"></div>
      <div className="absolute inset-6 border border-amber-600/10 pointer-events-none rounded"></div>
      
      {/* Ornate Corners */}
      <div className="absolute top-7 left-7 w-8 h-8 border-t-2 border-l-2 border-amber-600/50 pointer-events-none"></div>
      <div className="absolute top-7 right-7 w-8 h-8 border-t-2 border-r-2 border-amber-600/50 pointer-events-none"></div>
      <div className="absolute bottom-7 left-7 w-8 h-8 border-b-2 border-l-2 border-amber-600/50 pointer-events-none"></div>
      <div className="absolute bottom-7 right-7 w-8 h-8 border-b-2 border-r-2 border-amber-600/50 pointer-events-none"></div>
 
      {/* Header */}
      <div className="flex justify-between items-start z-10 mt-2 px-2">
        <div className="flex items-center gap-3">
          {data.logoImage ? (
            <img src={data.logoImage} alt="Logo" className="w-12 h-12 object-contain filter brightness-100" />
          ) : (
            <div className="w-10 h-10 border border-amber-600/30 rounded-full flex items-center justify-center bg-emerald-50">
              <svg className="w-6 h-6 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
              </svg>
            </div>
          )}
          <div>
            <span className="text-[9px] uppercase tracking-widest text-amber-800 font-bold font-sans block">LUXURY RECOGNITION</span>
            <span className="text-xs uppercase font-cinzel font-semibold tracking-wider block text-emerald-950">{data.organizationName || '[ORGANIZATION]'}</span>
          </div>
        </div>
 
        <div className="text-right">
          <span className="text-[9px] uppercase tracking-widest text-amber-800/60 block font-sans font-bold">CERTIFICATE ID</span>
          <span className="text-xs font-mono text-emerald-900">{data.certificateNumber || 'N/A'}</span>
        </div>
      </div>
 
      {/* Main Body */}
      <div className="text-center flex-grow flex flex-col justify-center my-4 z-10 px-8">
        <h1 className="text-3xl lg:text-4xl text-gradient bg-gradient-to-r from-emerald-800 via-amber-700 to-emerald-900 font-black tracking-widest uppercase font-cinzel mb-2 drop-shadow-sm">
          {data.certificateTitle || 'Exemplary Achievement'}
        </h1>
        <div className="w-36 h-[1px] bg-gradient-to-r from-transparent via-emerald-800 to-transparent mx-auto mb-4"></div>
 
        <p className="text-[10px] tracking-widest text-amber-800/80 uppercase font-sans mb-2 font-bold">THIS HONOUR IS BESTOWED UPON</p>
        <h2 className="text-3xl font-extrabold text-emerald-950 font-serif tracking-wider font-bold mb-3">
          {data.recipientName || '[Recipient Name]'}
        </h2>
 
        <p className="text-xs text-emerald-900 max-w-[600px] mx-auto italic font-sans font-light leading-relaxed">
          {data.description || 'In recognition of outstanding distinction, extraordinary skill development, and an ongoing commitment to professional and technical mastery.'}
        </p>
 
        <div className="mt-4 font-sans text-xs font-bold text-emerald-800 uppercase tracking-widest">
          {data.courseName || '[Course or Event Name]'}
        </div>
      </div>
 
      {/* Footer */}
      <div className="flex justify-between items-end z-10 border-t border-amber-500/20 pt-4 px-2">
        <div className="w-1/3 text-left font-sans">
          <span className="text-[9px] uppercase tracking-wider text-emerald-800/60 block">DATE OF AWARD</span>
          <span className="text-xs font-medium text-emerald-950 mt-1 block">{data.issueDate || 'N/A'}</span>
        </div>
 
        <div className="w-1/3 flex justify-center">
          <GoldSeal text="SUPREME" />
        </div>
 
        {/* Signature & QR */}
        <div className="w-1/3 flex flex-col items-end">
          <div className="flex items-center gap-3">
            {data.verificationUrl && (
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=50&data=${encodeURIComponent(data.verificationUrl)}`}
                alt="Verification QR"
                className="w-10 h-10 border border-emerald-200/30 p-0.5 bg-white rounded shadow-sm"
              />
            )}
            
            <div className="text-center min-w-[110px] font-sans">
              <div className="h-8 flex items-center justify-center">
                {data.signatureImage ? (
                  <img src={data.signatureImage} alt="Signature" className="max-w-[110px] max-h-full object-contain" />
                ) : (
                  <DefaultSignature color="#047857" text={data.instructorName} />
                )}
              </div>
              <div className="w-full border-t border-amber-500/30 mt-1"></div>
              <span className="text-[9px] uppercase tracking-wider text-emerald-800/60 block mt-0.5">AUTHORIZER</span>
              <span className="text-[10px] font-bold text-emerald-950 block leading-tight">{data.instructorName || '[Instructor Name]'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper dictionary to dynamically load templates
export const TEMPLATES = {
  'classic-gold': ClassicGold,
  'modern-blue': ModernBlue,
  'minimal-white': MinimalWhite,
  'elegant-black': ElegantBlack,
  'corporate': Corporate,
  'academic': Academic,
  'luxury-premium': LuxuryPremium
};

export const TEMPLATE_LIST = [
  { id: 'classic-gold', name: 'Classic Gold', theme: 'Traditional & Formal' },
  { id: 'modern-blue', name: 'Modern Blue', theme: 'Tech & Modern' },
  { id: 'minimal-white', name: 'Minimal White', theme: 'Sleek & Understated' },
  { id: 'elegant-black', name: 'Elegant Black', theme: 'Luxury Dark' },
  { id: 'corporate', name: 'Corporate', theme: 'Professional & Business' },
  { id: 'academic', name: 'Academic', theme: 'University & Diploma' },
  { id: 'luxury-premium', name: 'Luxury Premium', theme: 'Royal Green & Gold' }
];
