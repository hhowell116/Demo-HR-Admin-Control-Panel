import { Info } from 'lucide-react';

export function DemoBanner() {
  return (
    <div className="bg-gradient-to-r from-brand-warm-brown to-brand-taupe text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 z-[9999] relative">
      <Info size={15} />
      <span>Demo Mode -- This is a portfolio preview with sample data. No real backend connected.</span>
    </div>
  );
}
