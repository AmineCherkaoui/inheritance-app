import React from 'react';
import { ShieldCheck, Zap, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BottomFooter() {
  const badges = [
    { label: 'موثوق و آمن', icon: ShieldCheck },
    { label: 'سهل وسريع', icon: Zap },
    { label: 'معتمد على المذهب المالكي', icon: BookOpen },
    { label: 'دقّة شرعية', icon: CheckCircle2 }
  ];

  return (
    <footer className="w-full space-y-4 pt-4 shrink-0">


      <div className="w-full bg-secondary-400/20  py-4 px-4 grid grid-cols-2 sm:grid-cols-4 justify-items-center  gap-4 text-xs font-extrabold text-amber-950">
        {badges.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div key={idx} className="flex flex-col sm:flex-row items-center gap-2">
              <div className="size-10 rounded-full bg-secondary-200 flex items-center justify-center shrink-0 text-primary-950">
                <Icon size={24} />
              </div>
              <span className='text-center'>{b.label}</span>
            </div>
          );
        })}
      </div>
    </footer>
  );
}
