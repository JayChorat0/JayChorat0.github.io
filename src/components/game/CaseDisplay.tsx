import { Puzzle } from "@/lib/cases";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Globe, Mail, Terminal } from "lucide-react";

interface CaseDisplayProps {
  puzzle: Puzzle;
}

const PuzzleIcon = ({ type }: { type: Puzzle['type'] }) => {
    switch (type) {
        case 'email': return <Mail className="h-5 w-5 mr-2" />;
        case 'website': return <Globe className="h-5 w-5 mr-2" />;
        case 'terminal': return <Terminal className="h-5 w-5 mr-2" />;
    }
}

export function CaseDisplay({ puzzle }: CaseDisplayProps) {
  const renderContent = () => {
    switch (puzzle.type) {
      case "email":
        return (
          <Card className="bg-background/50 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg font-code">Incoming Message</CardTitle>
              <CardDescription className="font-code">{puzzle.description}</CardDescription>
            </CardHeader>
            <Separator className="bg-primary/20" />
            <CardContent className="p-6 pt-4">
                <div dangerouslySetInnerHTML={{ __html: puzzle.content }} className="prose prose-invert prose-sm max-w-none font-code" />
            </CardContent>
          </Card>
        );
      case "website":
        return (
          <Card className="bg-background/50 overflow-hidden border-primary/20">
            <CardHeader className="bg-muted/30 p-2 flex-row items-center space-y-0">
                <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-500"></span>
                    <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                </div>
                <div className="text-sm text-muted-foreground bg-background/80 rounded-md px-4 py-1 ml-4 flex-grow text-center font-code">
                    http://suspicious-site.com
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <pre className="w-full bg-black/50 text-white p-4 overflow-x-auto text-sm font-code">
                    <code>{puzzle.content}</code>
                </pre>
            </CardContent>
          </Card>
        );
      case "terminal":
        return (
            <Card className="bg-black/80 font-code text-primary overflow-hidden border-primary/20">
                <CardHeader className="bg-gray-800/50 p-2 flex-row items-center space-y-0">
                    <Terminal className="h-4 w-4 mr-2" />
                    <p className="text-sm text-gray-300">/bin/zsh</p>
                </CardHeader>
                <CardContent className="p-4 text-sm whitespace-pre-wrap">
                    {puzzle.content}
                </CardContent>
          </Card>
        );
      default:
        return <div>Unknown puzzle type</div>;
    }
  };

  return (
    <div>
        <div className="flex items-center text-lg font-semibold mb-4 text-muted-foreground">
            <PuzzleIcon type={puzzle.type} />
            <h3 className="text-2xl font-headline tracking-wide">{puzzle.title}</h3>
        </div>
      {renderContent()}
    </div>
  );
}
