import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";

interface GameLayoutProps {
  caseTitle: string;
  caseDescription: string;
  score: number;
  children: React.ReactNode;
}

export function GameLayout({ caseTitle, caseDescription, score, children }: GameLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <main className="w-full max-w-4xl mx-auto">
        <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Logo />
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg py-1 px-4">
                Score: <span className="font-bold ml-2 text-accent">{score}</span>
            </Badge>
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
