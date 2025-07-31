import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 text-inherit", className)}>
      <ShieldCheck className="h-8 w-8 text-accent" />
      <span className="text-2xl font-bold font-headline">Bug Hunters</span>
    </div>
  );
}
