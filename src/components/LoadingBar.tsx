'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function LoadingBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] h-1 pointer-events-none">
      <div className="h-full bg-indigo-600 animate-loading-bar shadow-[0_0_10px_rgba(79,70,229,0.8)]" />
      <style jsx>{`
        @keyframes loading-bar {
          0% { width: 0%; opacity: 1; }
          50% { width: 70%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
        .animate-loading-bar {
          animation: loading-bar 0.8s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}
