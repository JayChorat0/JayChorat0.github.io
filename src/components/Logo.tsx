import { Fingerprint } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 text-inherit", className)}>
      <Fingerprint className="h-8 w-8 text-accent" />
      <span className="text-4xl font-headline tracking-widest">BUG HUNTERS</span>
    </div>
  );
}
