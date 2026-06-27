import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Undo2, Redo2, Download, RefreshCw, Upload, Image as ImageIcon, 
  Trash2, Plus, Copy, FileCode, CheckCircle2, AlertCircle, FileSpreadsheet,
  Settings, Award, HelpCircle, FileText, Moon, Sun, Search, Calendar, ChevronRight, X
} from 'lucide-react';
import { TEMPLATES, TEMPLATE_LIST } from '../templates/CertificateTemplates';

// Initial state for certificate form fields
const INITIAL_FORM_STATE = {
  recipientName: '',
  certificateTitle: 'Certificate of Completion',
  courseName: 'Advanced Full-Stack Engineering',
  organizationName: 'Tech Academy Global',
  description: 'Has successfully fulfilled all learning requirements, completed practical labs, and demonstrated core competencies in architecture, design patterns, and deployment strategies.',
  issueDate: new Date().toISOString().split('T')[0],
  certificateNumber: 'CERT-2026-' + Math.floor(100000 + Math.random() * 900000),
  instructorName: 'Dr. Sarah Connor',
  signatureImage: '',
  logoImage: '',
  verificationUrl: ''
};

export default function Dashboard() {
  const previewRef = useRef(null);
  const containerRef = useRef(null);

  // Core States
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [activeTemplate, setActiveTemplate] = useState('classic-gold');
  const [activeMode, setActiveMode] = useState('single'); // 'single' or 'bulk'
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  // Undo/Redo States
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  // Saved Drafts & Registry States
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // AI Generative State
  const [aiContext, setAiContext] = useState('');
  const [aiTone, setAiTone] = useState('Professional');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiType, setAiType] = useState('description'); // 'description', 'appreciation', 'citation'

  // Bulk Upload States
  const [csvFile, setCsvFile] = useState(null);
  const [bulkRecords, setBulkRecords] = useState([]);
  const [mappedColumns, setMappedColumns] = useState({
    recipientName: '',
    certificateTitle: '',
    courseName: '',
    issueDate: '',
    certificateNumber: '',
    instructorName: '',
    description: ''
  });
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0, active: false });

  // UI Utilities
  const [previewScale, setPreviewScale] = useState(1);
  const [toast, setToast] = useState(null);

  // Trigger temporary toasts
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Toggle Theme Class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Handle live preview resizing & scaling — account for BOTH width AND height
  const containerRef2 = useRef(null);
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef2.current;
      if (!container) return;
      // Available space inside the preview column (subtract padding + button bar)
      const availW = container.clientWidth - 48;   // 24px padding each side
      const availH = container.clientHeight - 120;  // top bar (~56px) + bottom url (~40px) + gap
      const scaleW = availW / 1000;
      const scaleH = availH / 707;
      // Use the smaller of the two so certificate fits both dimensions
      setPreviewScale(Math.min(scaleW, scaleH, 1));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeMode]);

  // Load Saved Drafts from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('certificate_drafts');
    if (saved) {
      try {
        setSavedDrafts(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    // Load active draft if saved
    const active = localStorage.getItem('certificate_active_draft');
    if (active) {
      try {
        const parsed = JSON.parse(active);
        setFormState(parsed.formState || INITIAL_FORM_STATE);
        setActiveTemplate(parsed.activeTemplate || 'classic-gold');
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Update verification URL dynamically whenever cert number changes
  useEffect(() => {
    setFormState(prev => ({
      ...prev,
      verificationUrl: `${window.location.origin}/verify/${prev.certificateNumber}`
    }));
  }, [formState.certificateNumber]);

  // Autosave Draft
  const saveActiveDraft = (newState, newTemplate) => {
    localStorage.setItem('certificate_active_draft', JSON.stringify({
      formState: newState,
      activeTemplate: newTemplate || activeTemplate
    }));
  };

  // Update form values with Undo/Redo recording
  const updateFormValue = (key, value) => {
    // Record current state in undo history
    setHistory(prev => [...prev.slice(-19), formState]); // Keep max 20 entries
    setRedoHistory([]); // Clear redo stack on edit

    const updated = { ...formState, [key]: value };
    setFormState(updated);
    saveActiveDraft(updated);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoHistory(prev => [...prev, formState]);
    setFormState(previous);
    setHistory(prev => prev.slice(0, -1));
    saveActiveDraft(previous);
    triggerToast('Undo applied', 'info');
  };

  const handleRedo = () => {
    if (redoHistory.length === 0) return;
    const next = redoHistory[redoHistory.length - 1];
    setHistory(prev => [...prev, formState]);
    setFormState(next);
    setRedoHistory(prev => prev.slice(0, -1));
    saveActiveDraft(next);
    triggerToast('Redo applied', 'info');
  };

  // Base64 file loaders for images (to avoid CORS Canvas issues)
  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      triggerToast('Image must be smaller than 2MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateFormValue(field, reader.result);
      triggerToast(`${field === 'logoImage' ? 'Logo' : 'Signature'} uploaded successfully`);
    };
    reader.onerror = () => {
      triggerToast('Failed to read image file', 'error');
    };
    reader.readAsDataURL(file);
  };

  // AI Generation with Gemini
  const generateAIText = async () => {
    if (!formState.courseName) {
      triggerToast('Please provide a course or event name first', 'error');
      return;
    }

    setAiGenerating(true);
    try {
      const response = await axios.post('/api/ai/generate', {
        promptType: aiType,
        courseName: formState.courseName,
        recipientName: formState.recipientName || 'a candidate',
        organizationName: formState.organizationName,
        additionalContext: aiContext,
        tone: aiTone
      });

      if (response.data && response.data.text) {
        updateFormValue('description', response.data.text);
        triggerToast('AI generated text loaded successfully!');
      } else {
        throw new Error('No text returned from Gemini api');
      }
    } catch (err) {
      console.error(err);
      triggerToast(err.response?.data?.error || 'AI generation failed. Using backup writer.', 'error');
      
      // Fallback generator in case backend is offline/unconfigured
      const backupText = `This certificate is awarded in recognition of outstanding performance, core competence, and technical mastery displayed during the "${formState.courseName}" workshop, meeting the professional benchmark and quality checks established by ${formState.organizationName || 'our academy'}.`;
      updateFormValue('description', backupText);
    } finally {
      setAiGenerating(false);
    }
  };

  // Single Certificate DB Registration
  const registerCertificate = async (certificateData) => {
    try {
      await axios.post('/api/certificate/create', certificateData);
    } catch (err) {
      console.error('Failed to register certificate database record:', err);
    }
  };

  // Export current certificate
  const exportCertificate = async (format = 'pdf') => {
    if (!previewRef.current) {
      triggerToast('Preview not ready. Please wait.', 'error');
      return;
    }

    if (!formState.recipientName) {
      triggerToast('Please enter a recipient name before downloading.', 'error');
      return;
    }

    // Register the certificate for verification
    await registerCertificate({
      ...formState,
      templateId: activeTemplate
    });

    triggerToast(`Generating ${format.toUpperCase()}... please wait`, 'info');

    try {
      const element = previewRef.current;

      // Temporarily remove contentVisibility constraint so html2canvas captures fully
      const prevCV = element.style.contentVisibility;
      element.style.contentVisibility = 'visible';

      const canvas = await html2canvas(element, {
        scale: 3,           // High DPI — 3000×2121px for crisp A4 print
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',  // Always white bg — prevents black JPG
        logging: false,
        imageTimeout: 0,
        removeContainer: true
      });

      // Restore previous style
      element.style.contentVisibility = prevCV;

      const safeName = (formState.recipientName || 'Certificate').replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_');

      if (format === 'jpg') {
        // Convert to JPEG with white background
        const jpgCanvas = document.createElement('canvas');
        jpgCanvas.width = canvas.width;
        jpgCanvas.height = canvas.height;
        const ctx = jpgCanvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, jpgCanvas.width, jpgCanvas.height);
        ctx.drawImage(canvas, 0, 0);

        const dataUrl = jpgCanvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        link.download = `${safeName}_Certificate.jpg`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        triggerToast('JPG downloaded successfully!');

      } else if (format === 'pdf') {
        // Use canvas pixel dimensions to set PDF page size (no scaling distortion)
        const canvasWidthPx = canvas.width;
        const canvasHeightPx = canvas.height;

        const pdf = new jsPDF({
          orientation: canvasWidthPx > canvasHeightPx ? 'landscape' : 'portrait',
          unit: 'px',
          format: [canvasWidthPx, canvasHeightPx],
          hotfixes: ['px_scaling']
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 'JPEG', 0, 0, canvasWidthPx, canvasHeightPx, '', 'FAST');
        pdf.save(`${safeName}_Certificate.pdf`);

        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        triggerToast('PDF downloaded successfully!');
      }
    } catch (err) {
      console.error('Export error:', err);
      triggerToast(`Export failed: ${err.message || 'Unknown error'}`, 'error');
    }
  };

  // CSV parsing
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n');
      if (lines.length < 2) {
        triggerToast('CSV contains no records', 'error');
        return;
      }

      // Simple CSV header and quote parser
      const parseCSVLine = (line) => {
        const result = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"' || char === "'") {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(cur.trim().replace(/^["']|["']$/g, ''));
            cur = '';
          } else {
            cur += char;
          }
        }
        result.push(cur.trim().replace(/^["']|["']$/g, ''));
        return result;
      };

      const headers = parseCSVLine(lines[0]);
      setCsvHeaders(headers);

      // Auto map matching columns
      const mapping = { ...mappedColumns };
      headers.forEach(h => {
        const lower = h.toLowerCase();
        if (lower.includes('name') || lower.includes('recipient')) mapping.recipientName = h;
        else if (lower.includes('title') || lower.includes('cert')) mapping.certificateTitle = h;
        else if (lower.includes('course') || lower.includes('event')) mapping.courseName = h;
        else if (lower.includes('date')) mapping.issueDate = h;
        else if (lower.includes('number') || lower.includes('id')) mapping.certificateNumber = h;
        else if (lower.includes('instructor') || lower.includes('sign')) mapping.instructorName = h;
        else if (lower.includes('description') || lower.includes('desc')) mapping.description = h;
      });
      setMappedColumns(mapping);

      const parsedRows = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = parseCSVLine(lines[i]);
        const record = {};
        headers.forEach((h, idx) => {
          record[h] = cols[idx] || '';
        });
        parsedRows.push(record);
      }
      setBulkRecords(parsedRows);
      triggerToast(`Parsed ${parsedRows.length} records successfully!`);
    };
    reader.readAsText(file);
  };

  // Run Bulk ZIP Generation
  const processBulkGeneration = async () => {
    if (bulkRecords.length === 0) {
      triggerToast('No CSV records loaded', 'error');
      return;
    }

    const missingMappings = ['recipientName'].filter(key => !mappedColumns[key]);
    if (missingMappings.length > 0) {
      triggerToast('Map "Recipient Name" column to continue', 'error');
      return;
    }

    setBulkProgress({ current: 0, total: bulkRecords.length, active: true });
    const zip = new JSZip();

    // Store records on the backend in one bulk payload
    const backendRecords = [];

    // Create a hidden workspace area to render certificates one by one
    const renderContainer = document.createElement('div');
    renderContainer.style.position = 'fixed';
    renderContainer.style.left = '-9999px';
    renderContainer.style.top = '-9999px';
    renderContainer.style.width = '1000px';
    renderContainer.style.height = '707px'; // A4 Aspect ratio
    document.body.appendChild(renderContainer);

    try {
      for (let i = 0; i < bulkRecords.length; i++) {
        const row = bulkRecords[i];
        
        // Compile single record row data mapping fields
        const recordState = {
          recipientName: row[mappedColumns.recipientName] || 'Recipient',
          certificateTitle: row[mappedColumns.certificateTitle] || formState.certificateTitle,
          courseName: row[mappedColumns.courseName] || formState.courseName,
          organizationName: formState.organizationName,
          description: row[mappedColumns.description] || formState.description,
          issueDate: row[mappedColumns.issueDate] || formState.issueDate,
          certificateNumber: row[mappedColumns.certificateNumber] || `CERT-B-${100000 + i}`,
          instructorName: row[mappedColumns.instructorName] || formState.instructorName,
          signatureImage: formState.signatureImage,
          logoImage: formState.logoImage,
          verificationUrl: `${window.location.origin}/verify/${row[mappedColumns.certificateNumber] || `CERT-B-${100000 + i}`}`
        };

        backendRecords.push({
          ...recordState,
          templateId: activeTemplate
        });

        // Instantiate active template
        const TemplateComponent = TEMPLATES[activeTemplate];
        
        // Render to virtual container
        const virtualRoot = document.createElement('div');
        virtualRoot.style.width = '1000px';
        virtualRoot.style.height = '707px';
        renderContainer.appendChild(virtualRoot);

        // We temporarily mount standard react components by mimicking rendering structure or writing templates directly
        // However, a pure React-to-HTML canvas works easiest inside our current structure.
        // We will force a render in our React Tree or handle using a dynamic container.
        // To do this simply, we will change our formState temporarily, await a layout paint, screenshot, and repeat!
        // This is highly reliable, visual, and requires zero virtual DOM mounting issues.

        setFormState(recordState);
        setBulkProgress(prev => ({ ...prev, current: i + 1 }));
        
        // Await frame painting
        await new Promise(r => setTimeout(r, 450));

        const canvas = await html2canvas(previewRef.current, {
          scale: 2.0,
          useCORS: true,
          logging: false
        });

        const imgData = canvas.toDataURL('image/png');
        
        // Convert to PDF block
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: 'a4'
        });
        const w = pdf.internal.pageSize.getWidth();
        const h = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'PNG', 0, 0, w, h, undefined, 'FAST');
        
        const pdfBlob = pdf.output('blob');
        const filename = `${recordState.recipientName.replace(/\s+/g, '_')}_${recordState.certificateNumber}.pdf`;
        zip.file(filename, pdfBlob);

        renderContainer.innerHTML = '';
      }

      // Send to server in bulk for registry records
      try {
        await axios.post('/api/certificate/bulk', { certificates: backendRecords });
      } catch (e) {
        console.error('Failed to post bulk certificate logs to database', e);
      }

      // Download compiled zip file
      triggerToast('Zipping files...', 'info');
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.download = `Certificates_Bulk_Export.zip`;
      link.href = URL.createObjectURL(content);
      link.click();

      confetti({ particleCount: 150, spread: 80 });
      triggerToast('Bulk ZIP downloaded successfully!');
    } catch (err) {
      console.error(err);
      triggerToast('Bulk Generation error. Review output.', 'error');
    } finally {
      document.body.removeChild(renderContainer);
      setBulkProgress({ current: 0, total: 0, active: false });
      // Reset dashboard visual formState back to last configuration
      setFormState(formState);
    }
  };

  // Draft Management (History)
  const saveCurrentAsDraft = () => {
    const newDraft = {
      id: 'DRAFT-' + Date.now(),
      name: `${formState.recipientName || 'Unnamed Draft'} - ${formState.courseName || 'No Course'}`,
      timestamp: new Date().toLocaleString(),
      formState,
      activeTemplate
    };

    const updated = [newDraft, ...savedDrafts];
    setSavedDrafts(updated);
    localStorage.setItem('certificate_drafts', JSON.stringify(updated));
    triggerToast('Saved to drafts panel!');
  };

  const loadDraft = (draft) => {
    setFormState(draft.formState);
    setActiveTemplate(draft.activeTemplate);
    saveActiveDraft(draft.formState, draft.activeTemplate);
    triggerToast('Draft configuration loaded');
  };

  const deleteDraft = (draftId) => {
    const updated = savedDrafts.filter(d => d.id !== draftId);
    setSavedDrafts(updated);
    localStorage.setItem('certificate_drafts', JSON.stringify(updated));
    triggerToast('Draft removed', 'info');
  };

  // Import/Export Workspace JSON Settings
  const exportWorkspaceJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ formState, activeTemplate }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href",     dataStr);
    downloadAnchor.setAttribute("download", `CertifyAI_Config_${formState.certificateNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('Workspace config JSON exported');
  };

  const importWorkspaceJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.formState) {
          setFormState(parsed.formState);
          if (parsed.activeTemplate) {
            setActiveTemplate(parsed.activeTemplate);
          }
          saveActiveDraft(parsed.formState, parsed.activeTemplate || activeTemplate);
          triggerToast('Workspace configuration imported successfully');
        } else {
          triggerToast('Invalid backup configuration file', 'error');
        }
      } catch (err) {
        triggerToast('Failed to parse JSON file', 'error');
      }
    };
    reader.readAsText(file);
  };

  const SelectedTemplate = TEMPLATES[activeTemplate] || TEMPLATES['classic-gold'];

  // Filter history drafts based on search
  const filteredDrafts = savedDrafts.filter(draft => {
    const matchesSearch = 
      draft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.formState.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      draft.formState.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col font-sans relative transition-colors duration-300">
      {/* Visual Toasts */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border ${
              toast.type === 'error' ? 'bg-red-950/90 text-red-200 border-red-500/30' :
              toast.type === 'info' ? 'bg-indigo-950/90 text-indigo-200 border-indigo-500/30' :
              'bg-surface/90 text-text-primary border-emerald-500/30'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-400" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            <span className="text-sm font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar */}
      <header className="glass-panel border-b border-stroke sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-7 h-7 text-blue-600" />
          <h1 className="text-lg font-bold font-montserrat">Certify<span className="text-blue-600 dark:text-blue-400 font-extrabold">AI</span></h1>
          <span className="px-2.5 py-0.5 bg-surface text-muted rounded-full text-[10px] font-bold border border-stroke">Workspace</span>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-4">
          {/* Undo/Redo */}
          <div className="flex gap-1.5 bg-surface/80 p-1 rounded-xl border border-stroke">
            <button 
              onClick={handleUndo} 
              disabled={history.length === 0}
              className="p-1.5 hover:bg-stroke text-muted disabled:opacity-40 disabled:hover:bg-transparent rounded-lg transition-colors"
              title="Undo Edit"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button 
              onClick={handleRedo} 
              disabled={redoHistory.length === 0}
              className="p-1.5 hover:bg-stroke text-muted disabled:opacity-40 disabled:hover:bg-transparent rounded-lg transition-colors"
              title="Redo Edit"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Backup Configurations */}
          <div className="flex gap-2">
            <label className="px-3.5 py-2 bg-surface hover:bg-stroke/60 rounded-xl text-xs font-semibold border border-stroke transition-colors flex items-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import Config</span>
              <input type="file" accept=".json" onChange={importWorkspaceJSON} className="hidden" />
            </label>
            <button 
              onClick={exportWorkspaceJSON} 
              className="px-3.5 py-2 bg-surface hover:bg-stroke/60 rounded-xl text-xs font-semibold border border-stroke transition-colors flex items-center gap-1.5"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Export Config</span>
            </button>
          </div>

          <div className="h-6 w-px bg-stroke"></div>

          {/* Dark / Light Toggle */}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-surface rounded-xl border border-stroke transition-colors text-text-primary"
          >
            {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
        </div>
      </header>

      {/* Main Workspace layout */}
      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
        {/* Left Control Panel Column */}
        <div className="w-full lg:w-5/12 border-r border-stroke flex flex-col h-[calc(100vh-68px)] overflow-y-auto bg-bg p-6 no-scrollbar">
          
          {/* Mode Switcher */}
          <div className="flex bg-surface p-1 rounded-2xl border border-stroke mb-6">
            <button 
              onClick={() => setActiveMode('single')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${activeMode === 'single' ? 'bg-blue-600 text-white shadow-md' : 'text-muted hover:text-text-primary'}`}
            >
              <Award className="w-4.5 h-4.5" />
              <span>Single Certificate</span>
            </button>
            <button 
              onClick={() => setActiveMode('bulk')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${activeMode === 'bulk' ? 'bg-blue-600 text-white shadow-md' : 'text-muted hover:text-text-primary'}`}
            >
              <FileSpreadsheet className="w-4.5 h-4.5" />
              <span>Bulk Generation</span>
            </button>
          </div>

          {/* Template Carousel Selector */}
          <div className="mb-6">
            <h3 className="text-xs uppercase font-bold tracking-widest text-muted mb-3 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-blue-500" />
              <span>Select Certificate Theme</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TEMPLATE_LIST.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    setActiveTemplate(tmpl.id);
                    saveActiveDraft(formState, tmpl.id);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                    activeTemplate === tmpl.id 
                      ? 'bg-blue-600/10 border-blue-500 text-text-primary font-medium ring-1 ring-blue-500' 
                      : 'bg-surface border-stroke hover:border-text-primary/30 text-text-primary'
                  }`}
                >
                  <span className="text-xs font-bold block">{tmpl.name}</span>
                  <span className="text-[9px] text-muted block mt-0.5 font-light group-hover:text-text-primary transition-colors">{tmpl.theme}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Mode rendering */}
          {activeMode === 'single' ? (
            <div className="space-y-6">
              {/* Recipient details */}
              <div className="space-y-4 bg-surface p-5 rounded-2xl border border-stroke">
                <h3 className="text-xs uppercase font-bold tracking-widest text-blue-500 mb-1">Recipient & Issuance Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase font-bold text-muted block mb-1">Recipient Full Name</label>
                    <input 
                      type="text"
                      value={formState.recipientName}
                      onChange={(e) => updateFormValue('recipientName', e.target.value)}
                      placeholder="Jane Elizabeth Doe"
                      className="w-full bg-bg border border-stroke rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] uppercase font-bold text-muted block mb-1">Course / event Name</label>
                    <input 
                      type="text"
                      value={formState.courseName}
                      onChange={(e) => updateFormValue('courseName', e.target.value)}
                      placeholder="Advanced React Development Program"
                      className="w-full bg-bg border border-stroke rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted block mb-1">Certificate Title</label>
                    <input 
                      type="text"
                      value={formState.certificateTitle}
                      onChange={(e) => updateFormValue('certificateTitle', e.target.value)}
                      placeholder="Certificate of Completion"
                      className="w-full bg-bg border border-stroke rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted block mb-1">Certificate Number</label>
                    <div className="flex gap-1.5">
                      <input 
                        type="text"
                        value={formState.certificateNumber}
                        onChange={(e) => updateFormValue('certificateNumber', e.target.value)}
                        placeholder="CERT-2026-X839"
                        className="w-full bg-bg border border-stroke rounded-xl px-3 py-2 text-xs font-mono text-text-primary focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                      />
                      <button 
                        onClick={() => updateFormValue('certificateNumber', 'CERT-2026-' + Math.floor(100000 + Math.random() * 900000))}
                        className="p-2 bg-bg border border-stroke hover:border-text-primary/30 text-muted hover:text-text-primary rounded-xl transition-colors"
                        title="Generate random ID"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted block mb-1">Organization Name</label>
                    <input 
                      type="text"
                      value={formState.organizationName}
                      onChange={(e) => updateFormValue('organizationName', e.target.value)}
                      placeholder="Tech Academy Global"
                      className="w-full bg-bg border border-stroke rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted block mb-1">Issue Date</label>
                    <input 
                      type="date"
                      value={formState.issueDate}
                      onChange={(e) => updateFormValue('issueDate', e.target.value)}
                      className="w-full bg-bg border border-stroke rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Groq AI assist box */}
              <div className="space-y-4 bg-surface p-5 rounded-2xl border border-stroke">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs uppercase font-bold tracking-widest text-blue-500 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    <span>Groq AI Writing Assistant</span>
                  </h3>
                  <span className="text-[9px] px-2 py-0.5 bg-blue-600/10 text-blue-500 rounded font-bold border border-blue-500/20">llama-3.3-70b</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted block mb-1">AI Output Block Type</label>
                    <select
                      value={aiType}
                      onChange={(e) => setAiType(e.target.value)}
                      className="w-full bg-bg border border-stroke rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="description">Standard Course Completion Description</option>
                      <option value="appreciation">Appreciation & Leadership Paragraph</option>
                      <option value="citation">Award Citation & Formal Phrasing</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted block mb-1">Tone Profile</label>
                    <div className="grid grid-cols-3 gap-1 bg-bg p-1 rounded-xl border border-stroke">
                      {['Professional', 'Academic', 'Luxury'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setAiTone(t)}
                          className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${aiTone === t ? 'bg-blue-600 text-white' : 'text-muted hover:text-text-primary'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-muted block mb-1">Additional Candidate Context (Optional)</label>
                    <textarea 
                      value={aiContext}
                      onChange={(e) => setAiContext(e.target.value)}
                      placeholder="e.g. scored 98% in final project, top of the class, completed in 2 weeks"
                      className="w-full h-16 bg-bg border border-stroke rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    onClick={generateAIText}
                    disabled={aiGenerating}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    {aiGenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating Custom Text...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate Text with Groq</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Certificate Description Box */}
              <div>
                <label className="text-[10px] uppercase font-bold text-muted block mb-1">Certificate Description Text</label>
                <textarea 
                  value={formState.description}
                  onChange={(e) => updateFormValue('description', e.target.value)}
                  className="w-full h-24 bg-bg border border-stroke rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-blue-500 transition-colors resize-y leading-relaxed"
                />
              </div>

              {/* Assets Upload Section */}
              <div className="space-y-4 bg-surface p-5 rounded-2xl border border-stroke">
                <h3 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-1">Assets & Verification Signatures</h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Instructor Name */}
                  <div className="col-span-2">
                    <label className="text-[10px] uppercase font-bold text-muted block mb-1">Instructor / Signee Name</label>
                    <input 
                      type="text"
                      value={formState.instructorName}
                      onChange={(e) => updateFormValue('instructorName', e.target.value)}
                      placeholder="Dr. Alan Turing"
                      className="w-full bg-bg border border-stroke rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-muted block mb-1">Organization Logo</label>
                    <div className="border border-dashed border-stroke hover:border-text-primary/30 transition-colors bg-bg p-4 rounded-xl text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer relative group min-h-[90px]">
                      {formState.logoImage ? (
                        <div className="relative w-full h-full flex items-center justify-center p-2">
                          <img src={formState.logoImage} alt="Logo preview" className="max-h-12 max-w-full object-contain" />
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateFormValue('logoImage', ''); }}
                            className="absolute -top-1 -right-1 p-1 bg-red-950 text-red-300 border border-red-500/20 rounded-full hover:bg-red-900 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="w-5 h-5 text-muted group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold text-text-primary">Upload Logo</span>
                          <span className="text-[8px] text-muted">PNG/SVG - Max 2MB</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, 'logoImage')} 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </div>
                  </div>

                  {/* Signature Upload */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-muted block mb-1">Authorized Signature</label>
                    <div className="border border-dashed border-stroke hover:border-text-primary/30 transition-colors bg-bg p-4 rounded-xl text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer relative group min-h-[90px]">
                      {formState.signatureImage ? (
                        <div className="relative w-full h-full flex items-center justify-center p-2">
                          <img src={formState.signatureImage} alt="Signature preview" className="max-h-12 max-w-full object-contain filter invert dark:invert-0" />
                          <button 
                            onClick={(e) => { e.stopPropagation(); updateFormValue('signatureImage', ''); }}
                            className="absolute -top-1 -right-1 p-1 bg-red-950 text-red-300 border border-red-500/20 rounded-full hover:bg-red-900 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <FileText className="w-5 h-5 text-muted group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-bold text-text-primary">Upload Signature</span>
                          <span className="text-[8px] text-muted">Transparent PNG</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, 'signatureImage')} 
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Draft actions */}
              <div className="flex gap-3">
                <button
                  onClick={saveCurrentAsDraft}
                  className="flex-1 py-2.5 rounded-xl bg-surface hover:bg-stroke/60 border border-stroke text-text-primary text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>
              </div>

              {/* Saved Drafts History Panel */}
              <div className="border-t border-stroke pt-6">
                <h3 className="text-xs uppercase font-bold tracking-widest text-muted mb-4">Saved Drafts History</h3>
                
                {/* Search Drafts */}
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder="Search saved drafts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-bg border border-stroke rounded-xl pl-9 pr-4 py-2 text-xs text-text-primary focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {filteredDrafts.length === 0 ? (
                  <p className="text-xs text-muted text-center py-4 italic">No drafts saved matches query.</p>
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto no-scrollbar">
                    {filteredDrafts.map((d) => (
                      <div key={d.id} className="p-3 bg-surface hover:bg-stroke/60 border border-stroke rounded-xl flex items-center justify-between group transition-colors">
                        <div className="flex-1 min-w-0 pr-3 cursor-pointer" onClick={() => loadDraft(d)}>
                          <span className="text-xs font-bold text-text-primary block truncate leading-snug">{d.name}</span>
                          <span className="text-[9px] text-muted block mt-0.5">{d.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              const dup = { ...d, id: 'DRAFT-' + Date.now(), name: `${d.name} (Copy)` };
                              setSavedDrafts([dup, ...savedDrafts]);
                              localStorage.setItem('certificate_drafts', JSON.stringify([dup, ...savedDrafts]));
                              triggerToast('Draft duplicated');
                            }}
                            className="p-1 hover:bg-bg text-muted hover:text-text-primary rounded"
                            title="Duplicate Draft"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteDraft(d.id)}
                            className="p-1 hover:bg-bg text-muted hover:text-red-400 rounded"
                            title="Delete Draft"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Bulk Generation Column
            <div className="space-y-6">
              <div className="bg-surface p-5 rounded-2xl border border-stroke space-y-4">
                <h3 className="text-xs uppercase font-bold tracking-widest text-blue-500 mb-1">Bulk Generation Setup</h3>

                {/* CSV File input */}
                <div className="border-2 border-dashed border-stroke hover:border-blue-500/50 transition-colors bg-bg p-6 rounded-2xl text-center flex flex-col items-center justify-center gap-2 cursor-pointer relative group">
                  <Upload className="w-8 h-8 text-muted group-hover:scale-110 transition-transform group-hover:text-blue-500" />
                  <span className="text-sm font-semibold text-text-primary">
                    {csvFile ? csvFile.name : 'Upload Participant CSV File'}
                  </span>
                  <span className="text-xs text-muted">Provide comma-separated fields</span>
                  <input 
                    type="file" 
                    accept=".csv" 
                    onChange={handleCSVUpload} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>

                {csvFile && bulkRecords.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-stroke">
                    <span className="text-[10px] uppercase font-bold text-muted block mb-1">Map CSV Headers to Fields</span>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {Object.keys(mappedColumns).map((field) => (
                        <div key={field} className="space-y-1">
                          <label className="text-[9px] uppercase font-bold text-muted block">
                            {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </label>
                          <select
                            value={mappedColumns[field]}
                            onChange={(e) => setMappedColumns({ ...mappedColumns, [field]: e.target.value })}
                            className="w-full bg-bg border border-stroke rounded-xl px-2 py-1.5 text-xs text-text-primary focus:outline-none focus:border-blue-500"
                          >
                            <option value="">-- Do Not Map --</option>
                            {csvHeaders.map(h => (
                              <option key={h} value={h}>{h}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Parsed list of records */}
              {bulkRecords.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase font-bold tracking-widest text-muted">
                      Parsed Candidates ({bulkRecords.length})
                    </span>
                    <button 
                      onClick={() => { setBulkRecords([]); setCsvFile(null); }}
                      className="text-xs text-red-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear Records
                    </button>
                  </div>

                  <div className="max-h-[250px] overflow-auto border border-stroke rounded-xl bg-bg no-scrollbar">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-surface text-muted border-b border-stroke">
                          <th className="p-2.5 font-bold">Recipient</th>
                          <th className="p-2.5 font-bold">Course / Event</th>
                          <th className="p-2.5 font-bold">Cert No.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stroke">
                        {bulkRecords.map((r, index) => (
                          <tr key={index} className="hover:bg-surface/50 text-text-primary">
                            <td className="p-2.5 truncate max-w-[120px] font-semibold text-text-primary">{r[mappedColumns.recipientName] || 'N/A'}</td>
                            <td className="p-2.5 truncate max-w-[150px]">{r[mappedColumns.courseName] || 'N/A'}</td>
                            <td className="p-2.5 font-mono text-[10px]">{r[mappedColumns.certificateNumber] || `CERT-B-${100000 + index}`}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Bulk download trigger */}
                  <button
                    onClick={processBulkGeneration}
                    disabled={bulkProgress.active}
                    className="w-full btn-gradient py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                  >
                    {bulkProgress.active ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Rendering {bulkProgress.current} of {bulkProgress.total}...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Generate Bulk Certificates (ZIP)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Preview Column Panel */}
        <div
          ref={containerRef2}
          className="w-full lg:w-7/12 bg-bg flex flex-col items-center justify-center p-6 lg:p-8 relative overflow-hidden h-[calc(100vh-68px)]"
        >
          {/* Decorative background grid and lighting */}
          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'linear-gradient(to right, hsl(var(--stroke)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--stroke)) 1px, transparent 1px)', backgroundSize: '4rem 4rem' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>

          {/* Export Floating Actions bar */}
          {activeMode === 'single' && (
            <div className="mb-4 z-10 bg-surface/75 p-1.5 rounded-2xl border border-stroke flex gap-2 shadow-xl backdrop-blur flex-shrink-0">
              <button
                onClick={() => exportCertificate('pdf')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-colors text-white"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={() => exportCertificate('jpg')}
                className="px-4 py-2 bg-bg hover:bg-surface rounded-xl text-xs font-semibold border border-stroke flex items-center gap-1.5 transition-colors text-text-primary"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Download JPG</span>
              </button>
            </div>
          )}

          {/* Scaled Preview Frame — shrink-wrapper pattern so layout matches visual size */}
          <div className="z-10 flex-shrink-0">
            {bulkProgress.active ? (
              <div className="text-center p-8 bg-surface/50 rounded-3xl border border-stroke backdrop-blur max-w-sm flex flex-col items-center">
                <RefreshCw className="w-12 h-12 text-indigo-400 animate-spin mb-4" />
                <h3 className="text-lg font-bold text-text-primary mb-2">Generating ZIP Bundle</h3>
                <p className="text-muted text-xs mb-4">
                  Currently rendering and encoding certificate {bulkProgress.current} of {bulkProgress.total}. Please hold.
                </p>
                <div className="w-full bg-bg h-2 rounded-full overflow-hidden border border-stroke">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${(bulkProgress.current / bulkProgress.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              // Outer wrapper collapses to the visual (scaled) size so no overflow
              <div
                style={{
                  width: `${Math.round(1000 * previewScale)}px`,
                  height: `${Math.round(707 * previewScale)}px`,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  boxShadow: '0 25px 60px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.15)',
                }}
              >
                {/* Inner div is always 1000×707, scales from top-left */}
                <div
                  ref={previewRef}
                  style={{
                    width: '1000px',
                    height: '707px',
                    transform: `scale(${previewScale})`,
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transition: 'transform 0.15s ease-out',
                    backgroundColor: '#ffffff',
                    overflow: 'hidden',
                  }}
                >
                  <SelectedTemplate data={formState} />
                </div>
              </div>
            )}
          </div>

          {/* Quick verification URL */}
          {!bulkProgress.active && (
            <div className="mt-3 text-center z-10 flex-shrink-0">
              <span className="text-[10px] text-muted">
                Verification:
                <span className="font-mono text-indigo-400 select-all ml-1 underline cursor-pointer">
                  {formState.verificationUrl}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
