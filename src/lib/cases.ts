
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
        title: "Analyze Defaced Website",
        description: "The phishing link led to a defaced website. The hacker left a message.",
        content: `
          <div class="text-center p-8">
            <h1 class="text-5xl font-bold text-red-500">YOU'VE BEEN HACKED!</h1>
            <p class="mt-4 text-xl">Your security is a joke.</p>
            <p class="mt-8 font-mono bg-gray-800 p-4 rounded">I left a little secret for you. The keyword is: <span class="text-green-400 font-bold">sentinel</span></p>
            <!-- Pssst... the real password is cyber-sleuth-123 -->
          </div>
        `,
        prompt: "What is the keyword left by the hacker on the page?",
        solution: "sentinel",
        points: 25,
        aiPuzzleDescription: "The user is looking at a defaced webpage. They need to find a specific keyword that is clearly visible in the text content of the page."
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
  },
  {
    id: "case-03",
    title: "Case 03: The Ransomware Attack",
    description: "A critical server has been hit by ransomware. We need to understand the attack and find the payment portal.",
    puzzles: [
      {
        id: "c03p01",
        type: "terminal",
        title: "Decrypt the Ransom Note",
        description: "The attackers left a ransom note, but it's encoded. You need to read its contents.",
        content: `
          $ cat RANSOM_NOTE.txt
          WW91ciBmaWxlcyBhcmUgZW5jcnlwdGVkLiBQYXkgMTAgYml0Y29pbiB0byBnZXQgdGhlbSBiYWNrLg==
        `,
        prompt: "The ransom note appears to be Base64 encoded. What is the decoded message?",
        solution: "Your files are encrypted. Pay 10 bitcoin to get them back.",
        points: 75,
        aiPuzzleDescription: "The user is presented with a Base64 encoded string in a terminal. They need to decode it to reveal the hidden message."
      },
      {
        id: "c03p02",
        type: "website",
        title: "Find the Payment Portal",
        description: "The attackers have a payment portal, but it's hidden on their website.",
        content: `
          <div class="p-4">
            <h1 class="text-2xl font-bold">Welcome to Evil Corp</h1>
            <p>We are a legitimate business. Nothing to see here.</p>
            <!-- The payment portal is at a path hinted at by the ransom currency. -->
          </div>
        `,
        prompt: "The source code mentions a hint related to the ransom currency. What is the full URL of the payment portal?",
        solution: "http://evil-corp.net/bitcoin",
        points: 100,
        aiPuzzleDescription: "The user is on a website and needs to find a hidden page. A comment in the HTML source code hints that the path name is related to the currency mentioned in the previous puzzle (bitcoin)."
      }
    ]
  },
  {
    id: "case-04",
    title: "Case 04: The Insider Threat",
    description: "We suspect an employee is leaking data. We've captured some network traffic and server logs.",
    puzzles: [
      {
        id: "c04p01",
        type: "terminal",
        title: "Analyze Server Logs",
        description: "Analyze these server access logs to find the IP address that accessed the secret files.",
        content: `
          $ cat access.log
          192.168.1.1 - GET /index.html
          10.0.0.5 - GET /images/logo.png
          172.16.31.4 - POST /api/login
          203.0.113.78 - GET /data/finances.zip
          192.168.1.2 - GET /about.html
        `,
        prompt: "Which IP address downloaded the sensitive 'finances.zip' file?",
        solution: "203.0.113.78",
        points: 100,
        aiPuzzleDescription: "The user is shown a snippet of a server log file. They need to find the IP address associated with the download of a specific sensitive file mentioned in the log."
      },
      {
        id: "c04p02",
        type: "website",
        title: "Reassemble the Secret Key",
        description: "The data was protected by a key, but the employee shredded it. We recovered fragments from their browser cache.",
        content: `
          <div>
            <p>Key Fragments Found:</p>
            <ul class="font-mono list-disc list-inside bg-gray-800 p-4 rounded">
              <li>Part 3: 8JkL</li>
              <li>Part 1: AbC1</li>
              <li>Part 4: MnOp</li>
              <li>Part 2: 4FgH</li>
            </ul>
          </div>
        `,
        prompt: "Assemble the key fragments in the correct order (Part 1, Part 2, etc.).",
        solution: "AbC14FgH8JkLMnOp",
        points: 125,
        aiPuzzleDescription: "The user is presented with a list of key fragments that are out of order. They need to reassemble them into a single string based on the part numbers provided."
      }
    ]
  },
  {
    id: "case-05",
    title: "Case 05: The Social Engineering Ploy",
    description: "An attacker is using social engineering to gain access. We need to uncover their plot.",
    puzzles: [
      {
        id: "c05p01",
        type: "website",
        title: "Investigate Fake Profile",
        description: "The attacker is using a fake social media profile to appear legitimate. Find the hidden message.",
        content: `
          <div class="p-4 border rounded-lg">
            <h2 class="text-xl font-bold">Jane Doe</h2>
            <p class="text-sm text-gray-400">Project Manager at Innovate Inc.</p>
            <p class="mt-2">Connecting with industry leaders and sharing insights!</p>
            <!-- The next target is the CFO, the code word is 'ProjectEagle' -->
          </div>
        `,
        prompt: "The attacker hid a code word in the HTML of the profile page. What is it?",
        solution: "ProjectEagle",
        points: 100,
        aiPuzzleDescription: "The user is analyzing a fake social media profile page. They need to inspect the HTML source to find a hidden comment containing a code word."
      },
      {
        id: "c05p02",
        type: "email",
        title: "Analyze Spear Phishing Email",
        description: "The attacker sent a spear phishing email to the CFO. Identify the malicious payload.",
        content: `
          <p>Hi John,</p>
          <p>Following up on our discussion, here is the document for 'ProjectEagle'.</p>
          <p>Please review: <a href="http://evil-corp.net/docs/ProjectEagle.exe" target="_blank" class="text-blue-400 hover:underline">Download Secure Document</a></p>
          <p>Thanks,<br/>Jane Doe</p>
        `,
        prompt: "The link in the email downloads a file. What is the full filename of the download?",
        solution: "ProjectEagle.exe",
        points: 125,
        aiPuzzleDescription: "The user is analyzing a phishing email. They need to identify the full filename, including the extension, of the file that would be downloaded from the hyperlink."
      }
    ]
  },
  {
    id: "case-06",
    title: "Case 06: The Data Exfiltration",
    description: "Sensitive data is being slowly leaked from our network. Find the source and the leaked data.",
    puzzles: [
      {
        id: "c06p01",
        type: "terminal",
        title: "Analyze DNS Logs",
        description: "The attacker is using DNS tunneling to exfiltrate data. Find the suspicious domain in the logs.",
        content: `
          $ tail -f dns_queries.log
          [INFO] query for www.google.com
          [INFO] query for cdn.corp.com
          [INFO] query for a7b3c1d9.secret-data.net
          [INFO] query for auth.corp.com
        `,
        prompt: "A domain in the logs looks suspicious and is likely used for data exfiltration. What is the suspicious domain?",
        solution: "a7b3c1d9.secret-data.net",
        points: 150,
        aiPuzzleDescription: "The user is viewing DNS query logs. They need to identify a strange-looking domain that doesn't fit the pattern of legitimate corporate domains, suggesting it's used for data exfiltration."
      },
      {
        id: "c06p02",
        type: "website",
        title: "Find Leaked Data",
        description: "The suspicious domain leads to a public paste site where a fragment of the leaked data was posted.",
        content: `
          <div class="font-mono text-sm whitespace-pre-wrap bg-gray-800 p-4 rounded">
            <div>...BEGIN LEAKED DATA...</div>
            <div>User: jsmith</div>
            <div>Pass: S3cureP@ssw0rd!</div>
            <div>FLAG: {CYBER_HUNTER_MASTER}</div>
            <div>...END LEAKED DATA...</div>
          </div>
        `,
        prompt: "The leaked data contains a 'flag'. What is the value of the flag?",
        solution: "{CYBER_HUNTER_MASTER}",
        points: 100,
        aiPuzzleDescription: "The user is viewing a text snippet on a webpage that represents leaked data. They need to find and copy the value of the 'FLAG' contained within the text."
      }
    ]
  },
  {
    id: "case-07",
    title: "Case 07: The Wi-Fi Intrusion",
    description: "Unusual activity has been detected on the corporate Wi-Fi. Identify the unauthorized device.",
    puzzles: [
      {
        id: "c07p01",
        type: "terminal",
        title: "Scan the Network",
        description: "A network scan reveals all connected devices. Find the one that doesn't belong.",
        content: `
          $ nmap -sP 192.168.1.0/24
          ...
          Nmap scan report for 192.168.1.101 (Server-01)
          Nmap scan report for 192.168.1.102 (Workstation-34)
          Nmap scan report for 192.168.1.103 (pwn-box)
          Nmap scan report for 192.168.1.104 (Printer-Office)
          ...
        `,
        prompt: "One of these devices has a suspicious hostname. What is it?",
        solution: "pwn-box",
        points: 150,
        aiPuzzleDescription: "The user is looking at a list of devices on a network from an nmap scan. They need to identify the device with a name that implies malicious intent."
      }
    ]
  },
  {
    id: "case-08",
    title: "Case 08: The Malware Outbreak",
    description: "A piece of malware is spreading. Analyze its code to find the command and control server.",
    puzzles: [
      {
        id: "c08p01",
        type: "website",
        title: "Analyze Malware Code",
        description: "You've obtained a snippet of the malware's source code.",
        content: `
          <div class="font-mono text-sm whitespace-pre-wrap bg-black text-green-400 p-4 rounded">
            <span class="text-blue-400">function</span> <span class="text-yellow-300">contactC2</span>() {
              <span class="text-gray-400">// Config</span>
              <span class="text-purple-400">let</span> server = <span class="text-red-400">atob</span>(<span class="text-orange-400">"ZXZpbC1jMmQuaW5mby8="</span>);
              <span class="text-purple-400">fetch</span>(server + <span class="text-orange-400">"/checkin"</span>);
            }
          </div>
        `,
        prompt: "The malware contacts a Command & Control (C2) server. The address is Base64 encoded. What is the decoded C2 domain?",
        solution: "evil-c2.info/",
        points: 200,
        aiPuzzleDescription: "The user is looking at a snippet of code. They need to find a Base64 encoded string, decode it, to find the malware's command and control server domain."
      }
    ]
  }
];
