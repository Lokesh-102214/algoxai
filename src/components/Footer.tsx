import { Link } from 'react-router-dom';
import AlgoXLogo from './AlgoXLogo';
import { Github, Twitter, Linkedin, ExternalLink } from 'lucide-react';

const LINKS = {
  Platform: [
    { label: 'Learning Hub',    to: '/learning-hub' },
    { label: 'Practice',        to: '/practice' },
    { label: 'Visualizations',  to: '/visualizations' },
    { label: 'Contests',        to: '/calendar' },
  ],
  Resources: [
    { label: 'Research Feed',   to: '/productivity' },
    { label: 'AI Assistant',    to: '/ai' },
    { label: 'Profile',         to: '/profile' },
    { label: 'Community',       to: '/community' },
  ],
  Topics: [
    { label: 'Dynamic Programming', to: '/algorithm/dynamic-programming' },
    { label: 'Graph Algorithms',    to: '/algorithm/graph-algorithms' },
    { label: 'Binary Search',       to: '/algorithm/binary-search' },
    { label: 'Backtracking',        to: '/algorithm/backtracking' },
  ],
};

const SOCIALS = [
  { icon: Github,   href: 'https://github.com', label: 'GitHub' },
  { icon: Twitter,  href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/30 bg-card/30 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-14">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-500/30 bg-gradient-to-br from-teal-950/80 to-indigo-950/80 group-hover:border-teal-400/50 transition-all duration-200">
                <AlgoXLogo size={20} />
              </div>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-teal-400">Algo</span>
                <span className="text-indigo-400">X</span>
                <span className="text-foreground/70">.ai</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              An AI-powered competitive programming platform with specialised agents for concept
              learning, code refactoring, and debugging.
            </p>

            <div className="flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-border/50 text-muted-foreground hover:text-teal-400 hover:border-teal-500/40 hover:bg-teal-500/10 transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading} className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                {heading}
              </h4>
              <ul className="space-y-2">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-muted-foreground hover:text-teal-400 transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} AlgoX.ai — Built for competitive programmers, by competitive programmers.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground/50">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Powered by Claude 3.5 Sonnet
            </span>
            <a
              href="https://aws.amazon.com/bedrock/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-teal-400 transition-colors"
            >
              AWS Bedrock <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
