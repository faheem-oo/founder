'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import DarkVeil from './components/DarkVeil';
import EarlyAccessForm from './components/EarlyAccessForm';

export default function Home() {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [feedbackItems, setFeedbackItems] = useState<{ timestamp: string; feedback: string }[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  const [deletionMessage, setDeletionMessage] = useState('');
  const [previousCount, setPreviousCount] = useState<number | null>(null);
  const [previousMaxTimestamp, setPreviousMaxTimestamp] = useState<string | null>(null);

  // Trigger the background animation after the form entrance animation finishes.
  useEffect(() => {
    const t = setTimeout(() => {
      window.dispatchEvent(new Event('darkveil-start'));
    }, 750); // match form animation (700ms in globals.css)
    return () => clearTimeout(t);
  }, []);

  // Load previous count from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('feedbackCount');
    if (stored) {
      setPreviousCount(parseInt(stored, 10));
    }
    const storedMax = localStorage.getItem('feedbackMaxTimestamp');
    if (storedMax) setPreviousMaxTimestamp(storedMax);
  }, []);

  // Background check: fetch current feedback count & latest timestamp on mount to detect deletions
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await fetch('/api/feedback', { cache: 'no-store' });
        if (!response.ok) return;
        const res = await response.json();
        const newItems = res.items ?? [];
        const newCount = newItems.length;
        // compute newest timestamp (items are expected sorted desc, but compute defensively)
        const newMax = newItems.reduce((acc: string | null, it: { timestamp: string }) => {
          if (!it?.timestamp) return acc;
          if (!acc) return it.timestamp;
          return acc > it.timestamp ? acc : it.timestamp;
        }, null as string | null);

        const stored = localStorage.getItem('feedbackCount');
        const storedCount = stored ? parseInt(stored, 10) : null;
        const storedMax = localStorage.getItem('feedbackMaxTimestamp');

        

        const baselineCount = storedCount;
        const baselineMax = storedMax || null;

        // Deletion detection: if count decreased OR latest timestamp is older/missing
        if (
          mounted &&
          ((baselineCount !== null && baselineCount > 0 && newCount < baselineCount) ||
            (baselineMax && newMax && newMax < baselineMax) ||
            (baselineMax && newCount === 0))
        ) {
          const deletedCount = (baselineCount !== null ? baselineCount : 0) - newCount;
          const effectiveDeleted = deletedCount > 0 ? deletedCount : 1;
          setDeletionMessage(`${effectiveDeleted} item${effectiveDeleted > 1 ? 's' : ''} deleted from the sheet.`);
        }

        // Update stored baseline values so future checks compare against latest
        localStorage.setItem('feedbackCount', newCount.toString());
        if (newMax) localStorage.setItem('feedbackMaxTimestamp', newMax);
        if (mounted) {
          setPreviousCount(newCount);
          if (newMax) setPreviousMaxTimestamp(newMax);
        }
      } catch (e) {
        // ignore background errors
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleViewFeedback = async () => {
    setLoadingFeedback(true);
    setFeedbackError('');
    setDeletionMessage('');
    try {
      const response = await fetch('/api/feedback', { cache: 'no-store' });
      const res = await response.json();
      if (!response.ok || !res?.success) {
        setFeedbackItems([]);
        setFeedbackError('Failed to load feedback.');
        return;
      }
      const newItems = res.items ?? [];
      const newCount = newItems.length;
      const newMax = newItems.reduce((acc: string | null, it: { timestamp: string }) => {
        if (!it?.timestamp) return acc;
        if (!acc) return it.timestamp;
        return acc > it.timestamp ? acc : it.timestamp;
      }, null as string | null);

      const stored = localStorage.getItem('feedbackCount');
      const storedCount = stored ? parseInt(stored, 10) : null;
      const storedMax = localStorage.getItem('feedbackMaxTimestamp');

      

      const baselineCount = previousCount ?? storedCount;
      const baselineMax = previousMaxTimestamp ?? storedMax ?? null;

      // Detect if data was deleted: count decreased OR latest timestamp older/removed
      if (
        baselineCount !== null && baselineCount > 0 && newCount < baselineCount ||
        (baselineMax && newMax && newMax < baselineMax) ||
        (baselineMax && newCount === 0)
      ) {
        // Show the deletion message only once per baseline. Use a stable key saved in localStorage
        // so subsequent clicks don't re-show the same deletion notice.
        const baselineKey = baselineCount !== null ? `count:${baselineCount}` : baselineMax ? `max:${baselineMax}` : null;
        const notifiedFor = baselineKey ? localStorage.getItem('feedbackDeletionNotified') : null;
        if (baselineKey && notifiedFor === baselineKey) {
          // already notified for this baseline, skip showing again
        } else {
          const effectiveDeleted = (baselineCount !== null ? baselineCount : (baselineMax ? 1 : 0)) - newCount;
          const deletedCount = effectiveDeleted > 0 ? effectiveDeleted : 1;
          setDeletionMessage(`${deletedCount} item${deletedCount > 1 ? 's' : ''} deleted from the sheet.`);
          if (baselineKey) localStorage.setItem('feedbackDeletionNotified', baselineKey);
        }
      }
      
      setFeedbackItems(newItems);
      setPreviousCount(newCount);
      if (newMax) setPreviousMaxTimestamp(newMax);
      // Save count and max timestamp to localStorage
      localStorage.setItem('feedbackCount', newCount.toString());
      if (newMax) localStorage.setItem('feedbackMaxTimestamp', newMax);
      setViewerOpen(true);
    } catch (err: any) {
      setFeedbackError(err?.message ?? 'Failed to load feedback.');
    } finally {
      setLoadingFeedback(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start font-sans">
      {/* Background */}
      <div style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
        <DarkVeil />
      </div>

      {/* Navigation Bar */}
      <nav className="w-full max-w-4xl flex items-center justify-between mt-4 px-4 py-2 rounded-full bg-black/20 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Image src="/imitate-logo.png" alt="Imitate Labs Logo" width={40} height={40} />
          <span className="text-lg font-bold text-white tracking-wide">IMITATE LABS</span>
        </div>
        <button
          onClick={handleViewFeedback}
          className="text-sm font-semibold text-white px-4 py-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition"
          disabled={loadingFeedback}
        >
          {loadingFeedback ? 'Loading...' : 'View Feedback'}
        </button>

      </nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center w-full px-4 py-4">
        <h3 className="mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-3xl font-extrabold text-white text-center leading-tight drop-shadow-lg">
         Communicate your Queries to the Founder
        </h3>
       

        {/* Early Access Card */}
  <section className="mt-8 p-6 w-full max-w-sm flex flex-col items-center animate-formEnter glass-card inset-glow">
          <h2 className="text-lg font-semibold text-white text-center mb-2">
            Query Box
          </h2>
          <EarlyAccessForm />

          <p className="mt-3 text-xs text-white/80 text-center">
            We assure you that your identity will not be recorded or stored.<br />All submissions are completely annonymous.
          </p>
        </section>
      </main>

      {viewerOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-3xl bg-black/70 border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Submitted Feedback</h3>
              <button
                onClick={() => setViewerOpen(false)}
                className="text-sm text-white/70 hover:text-white"
              >
                Close
              </button>
            </div>

            {feedbackError && (
              <div className="text-sm text-red-300 bg-red-900/40 border border-red-500/40 rounded-lg px-3 py-2">
                {feedbackError}
              </div>
            )}

            {deletionMessage && (
              <div className="text-sm text-yellow-300 bg-yellow-900/40 border border-yellow-500/40 rounded-lg px-3 py-2">
                ⚠️ {deletionMessage}
              </div>
            )}

            

            {feedbackItems.length === 0 && !feedbackError && (
              <p className="text-white/70 text-sm">No feedback yet.</p>
            )}

            <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
              {feedbackItems.map((item, idx) => (
                <div key={`${item.timestamp}-${idx}`} className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="text-xs text-white/50 mb-1">{new Date(item.timestamp).toLocaleString()}</div>
                  <div className="text-sm text-white/90 whitespace-pre-wrap break-words">{item.feedback}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}