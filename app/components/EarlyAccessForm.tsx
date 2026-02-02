'use client';

import { useRef, useState, useEffect } from 'react';
import { submitEarlyAccess } from '../actions/formActions';
import SubmissionMessage from './SubmissionMessage';

export default function EarlyAccessForm() {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      {
        threshold: 0.1 // Trigger when 10% of the element is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  async function handleSubmit(formData: FormData) {
    try {
      const result = await submitEarlyAccess(formData);
      setMessage(result.message);
      setIsSuccess(result.success);
      setShowModal(true);
      if (result.success) {
        formRef.current?.reset();
        // Refresh stored feedback baseline so subsequent deletion detection works
        try {
          const r = await fetch('/api/feedback', { cache: 'no-store' });
          if (r.ok) {
            const payload = await r.json();
            const items = payload.items ?? [];
            const count = items.length;
            const max = items.reduce((acc: string | null, it: { timestamp: string }) => {
              if (!it?.timestamp) return acc;
              if (!acc) return it.timestamp;
              return acc > it.timestamp ? acc : it.timestamp;
            }, null as string | null);
            localStorage.setItem('feedbackCount', count.toString());
            if (max) localStorage.setItem('feedbackMaxTimestamp', max);
            // clear prior deletion-notified flag because baseline changed
            localStorage.removeItem('feedbackDeletionNotified');
          }
        } catch (e) {
          // ignore background errors
        }
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      setIsSuccess(false);
      setShowModal(true);
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`w-full transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
      }`}
    >
      <form ref={formRef} action={handleSubmit} className="w-full flex flex-col gap-4 mt-4">
        <textarea
          name="feedback"
          placeholder="Share your Issues, Complaints, Feedback, Ideas, Suggestions here..."
          className="w-full rounded-lg px-4 py-3 bg-black/20 backdrop-blur-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none h-32 border border-white/10"
          required
        />

        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-white text-black font-bold py-2 text-base shadow-lg hover:bg-lavender hover:text-black hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] transform transition-all duration-200"
        >
          Submit
        </button>
      </form>

      <SubmissionMessage
        message={message}
        isSuccess={isSuccess}
        isVisible={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}