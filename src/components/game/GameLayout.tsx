
"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { InstallButton } from "./InstallButton";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";


interface GameLayoutProps {
  caseTitle: string;
  caseDescription: string;
  score: number;
  children: React.ReactNode;
}

export function GameLayout({ caseTitle, caseDescription, score, children }: GameLayoutProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <main className="w-full max-w-4xl mx-auto">
        <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Logo />
          <div className="flex items-center gap-4">
            <InstallButton />
            <Badge variant="outline" className="text-lg py-1 px-4">
                Score: <span className="font-bold ml-2 text-accent">{score}</span>
            </Badge>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button onClick={handleSignOut} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                            <LogOut className="h-5 w-5" />
                            <span className="sr-only">Exit Game</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Exit Game</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </div>
        </header>

        <Card className="w-full bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-headline tracking-wider text-accent">{caseTitle}</CardTitle>
                <CardDescription className="text-base">{caseDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>

        <footer className="text-center mt-6 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Bug Hunters. Become the hunter.</p>
        </footer>
      </main>
    </div>
  );
}
