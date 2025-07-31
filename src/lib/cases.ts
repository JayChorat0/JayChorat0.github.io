export interface Puzzle {
  id: string;
  type: "email" | "website" | "terminal";
  title: string;
  description: string;
  content: string;
  prompt: string;
  solution: string;
  points: number;
  aiPuzzleDescription: string;
}

export interface Case {
  id:string;
  title: string;
  description: string;
  puzzles: Puzzle[];
}

export const cases: Case[] = [
  {
    id: "case-01",
    title: "Case 01: The Phishing Lure",
    description: "An employee has reported a suspicious email. Your job is to analyze it and find the threat.",
    puzzles: [
      {
        id: "c01p01",
        type: "email",
        title: "Analyze Suspicious Email",
        description: "From: SecureBank <support@securebanc.com>\nTo: employee@corp.com\nSubject: Urgent: Your Account Has Been Compromised!",
        content: `
          <p>Dear Valued Customer,</p>
          <p>We detected unusual activity on your account. For your security, we have temporarily suspended your account. Please login immediately to verify your identity and restore access.</p>
          <p>Click here to login: <a href="http://evil-corp.net/login" target="_blank" class="text-blue-400 hover:underline">https://my-secure-bank.com/verify</a></p>
          <p>Thank you,<br/>SecureBank Security Team</p>
        `,
        prompt: "What is the true domain name of the suspicious link?",
        solution: "evil-corp.net",
        points: 50,
        aiPuzzleDescription: "The user is analyzing a phishing email. They need to find the actual destination URL of a hyperlink, which is different from the link text."
      },
      {
        id: "c01p02",
        type: "website",
        title: "Investigate Leaked Credentials",
        description: "The phishing link led to a simple login page. The developer seems to have left a comment in the source code.",
        content: `
          <html>
            <head><title>Login</title></head>
            <body>
              <h1>Bank Login</h1>
              <input type="text" placeholder="username" />
              <input type="password" placeholder="password" />
              <button>Login</button>
              <!-- TODO: Remove test credentials before deployment. User: admin Pass: cyber-sleuth-123 -->
            </body>
          </html>
        `,
        prompt: "What is the password found in the website's source code?",
        solution: "cyber-sleuth-123",
        points: 50,
        aiPuzzleDescription: "The user is looking at the HTML source of a webpage. They need to find a password left inside an HTML comment."
      }
    ],
  },
  {
    id: "case-02",
    title: "Case 02: The Rogue Server",
    description: "We've found a rogue server on our network. We need you to gain access and see what's on it.",
    puzzles: [
      {
        id: "c02p01",
        type: "terminal",
        title: "Find the Hidden File",
        description: "You have basic access to a terminal on the server. Find the file containing sensitive information.",
        content: `
          $ ls -la
          total 8
          drwxr-xr-x 2 user user 4096 Jan 1 12:00 .
          drwxr-xr-x 4 user user 4096 Jan 1 12:00 ..
          -rw-r--r-- 1 user user  134 Jan 1 12:00 notes.txt
          -rw-r--r-- 1 user user   52 Jan 1 12:00 .secret_plans
        `,
        prompt: "What is the name of the hidden file?",
        solution: ".secret_plans",
        points: 100,
        aiPuzzleDescription: "The user is looking at the output of 'ls -la' in a Linux terminal. They need to identify the hidden file, which starts with a dot."
      }
    ]
  }
];
