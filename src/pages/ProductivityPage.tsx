import { useState } from 'react';
import { ExternalLink, BookOpen, FileText, PlayCircle, Star, Tag, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ── Types ── */
type ResourceType = 'paper' | 'book' | 'blog' | 'tutorial';
type TopicTag = 'DP' | 'Graphs' | 'Trees' | 'Strings' | 'Geometry' | 'Sorting' | 'Number Theory' | 'Data Structures';

interface Resource {
  id: number; title: string; authors: string; venue: string; year: number;
  type: ResourceType; tags: TopicTag[]; abstract: string; url: string; starred?: boolean;
}

/* ── Data ── */
const RESOURCES: Resource[] = [
  { id: 1, title: 'Introduction to Algorithms (CLRS)', authors: 'Cormen, Leiserson, Rivest, Stein', venue: 'MIT Press', year: 2022, type: 'book', tags: ['DP', 'Graphs', 'Sorting', 'Data Structures'], abstract: 'The definitive reference covering a broad range of algorithms. Fourth edition includes coverage of linear programming, NP-completeness, and approximation algorithms — essential for any serious competitive programmer.', url: 'https://mitpress.mit.edu/9780262046305/', starred: true },
  { id: 2, title: 'A note on two problems in connexion with graphs', authors: 'E.W. Dijkstra', venue: 'Numerische Mathematik', year: 1959, type: 'paper', tags: ['Graphs'], abstract: "The original paper introducing Dijkstra's shortest-path algorithm and the minimum spanning tree construction. A landmark read that shows how clean mathematical reasoning leads to elegant algorithms in under 3 pages.", url: 'https://doi.org/10.1007/BF01386390', starred: true },
  { id: 3, title: "Competitive Programmer's Handbook", authors: 'Antti Laaksonen', venue: 'CSES / Self-published', year: 2018, type: 'book', tags: ['DP', 'Graphs', 'Trees', 'Strings', 'Geometry'], abstract: 'Free, comprehensive guide designed for ICPC-level competitive programming. Covers all major topics with concise explanations and C++ code examples. One of the best starting points for serious contestants.', url: 'https://cses.fi/book/book.pdf', starred: true },
  { id: 4, title: 'An O(nd) difference algorithm and its variations', authors: 'Eugene W. Myers', venue: 'Algorithmica', year: 1986, type: 'paper', tags: ['Strings', 'DP'], abstract: 'Introduces the Myers diff algorithm, the basis of git diff. Understanding edit-distance through this paper deepens intuition for Longest Common Subsequence and related DP patterns encountered in competitive programming.', url: 'https://doi.org/10.1007/BF01840446' },
  { id: 5, title: 'CP-Algorithms (cp-algorithms.com)', authors: 'Community (e-maxx)', venue: 'cp-algorithms.com', year: 2024, type: 'blog', tags: ['DP', 'Graphs', 'Trees', 'Strings', 'Number Theory', 'Geometry'], abstract: 'A community-maintained encyclopedia of competitive programming algorithms. Each article provides problem motivation, mathematical derivation, complexity analysis, and C++ implementation. Covers 150+ algorithmic topics.', url: 'https://cp-algorithms.com', starred: true },
  { id: 6, title: 'USACO Guide', authors: 'Various USACO alumni', venue: 'usaco.guide', year: 2024, type: 'tutorial', tags: ['DP', 'Graphs', 'Trees', 'Data Structures'], abstract: 'Structured learning path from Bronze to Platinum+, used by thousands of US computing olympiad contestants. Covers every major topic with curated problems and editorial solutions from experienced competitors.', url: 'https://usaco.guide', starred: true },
  { id: 7, title: 'Fibonacci Heaps and Their Uses in Improved Network Optimization Algorithms', authors: 'Fredman, Tarjan', venue: 'JACM', year: 1987, type: 'paper', tags: ['Graphs', 'Data Structures'], abstract: "Introduces Fibonacci heaps and proves the O(E + V log V) bound for Dijkstra's algorithm. Essential reading for understanding why amortized analysis matters in practice and how data structure design affects algorithm performance.", url: 'https://doi.org/10.1145/28869.28874' },
  { id: 8, title: 'Algorithm Design', authors: 'Jon Kleinberg, Éva Tardos', venue: 'Pearson', year: 2005, type: 'book', tags: ['DP', 'Graphs', 'Sorting'], abstract: 'Teaches algorithm design techniques through real-world problems and clean proofs. Excellent coverage of network flow, NP-hardness reductions, and approximation algorithms. A must-read alongside CLRS.', url: 'https://www.cs.cornell.edu/home/kleinber/networks-book/' },
  { id: 9, title: 'Suffix arrays: A new method for on-line string searches', authors: 'Udi Manber, Gene Myers', venue: 'SIAM Journal on Computing', year: 1993, type: 'paper', tags: ['Strings', 'Data Structures'], abstract: 'The foundational paper on suffix arrays — one of the most versatile data structures for string problems in competitive programming. Precedes the SA-IS construction algorithm but essential for conceptual grounding.', url: 'https://doi.org/10.1137/0222058' },
  { id: 10, title: 'Codeforces EDU — Segment Trees (Parts 1 & 2)', authors: 'Codeforces Editorial Team', venue: 'Codeforces EDU', year: 2024, type: 'tutorial', tags: ['Data Structures', 'Trees'], abstract: 'Step-by-step interactive lessons building segment trees from scratch, covering point and range updates, lazy propagation, and merge strategies. Paired with graded practice problems on the CF EDU section.', url: 'https://codeforces.com/edu/course/2' },
  { id: 11, title: 'Convex Hull Trick and Li Chao Trees', authors: 'Codeforces Community (tourist, neal_wu)', venue: 'Codeforces Blog', year: 2021, type: 'blog', tags: ['DP', 'Geometry'], abstract: 'In-depth explanation of the convex hull trick (CHT) and its efficient implementation as a Li Chao segment tree. Covers the standard form, monotone variant, and fully dynamic version with benchmark results.', url: 'https://codeforces.com/blog/entry/63823' },
  { id: 12, title: 'A Linear Time Algorithm for Finding Minimum Spanning Trees', authors: 'Karger, Klein, Tarjan', venue: 'JACM', year: 1995, type: 'paper', tags: ['Graphs'], abstract: 'Presents a randomized linear-time MST algorithm. While Kruskal/Prim are used in contests, this paper exemplifies the role of randomization in algorithm design — a powerful concept for advanced competitive problems.', url: 'https://doi.org/10.1145/201019.201022' },
];

const TYPE_CFG = {
  paper:    { label: 'Research Paper', icon: FileText,   color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
  book:     { label: 'Book',           icon: BookOpen,   color: 'bg-teal-500/15 text-teal-300 border-teal-500/30' },
  blog:     { label: 'Blog',           icon: PlayCircle, color: 'bg-orange-500/15 text-orange-300 border-orange-500/30' },
  tutorial: { label: 'Tutorial',       icon: PlayCircle, color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
} satisfies Record<ResourceType, { label: string; icon: typeof BookOpen; color: string }>;

const ALL_TAGS:  ('All' | TopicTag)[]      = ['All', 'DP', 'Graphs', 'Trees', 'Strings', 'Geometry', 'Sorting', 'Number Theory', 'Data Structures'];
const ALL_TYPES: ('All' | ResourceType)[]  = ['All', 'paper', 'book', 'blog', 'tutorial'];

export default function ProductivityPage() {
  const [tagFilter,    setTagFilter]    = useState<'All' | TopicTag>('All');
  const [typeFilter,   setTypeFilter]   = useState<'All' | ResourceType>('All');
  const [starredOnly,  setStarredOnly]  = useState(false);

  const filtered = RESOURCES.filter(r => {
    if (tagFilter  !== 'All' && !r.tags.includes(tagFilter as TopicTag)) return false;
    if (typeFilter !== 'All' && r.type !== typeFilter)                   return false;
    if (starredOnly && !r.starred)                                       return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-6 pb-16 px-4 animate-fade-in-up">
      <div className="container mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-sm font-medium">
            <BookOpen className="w-3.5 h-3.5" />
            Research &amp; Reading
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400">Algorithm Knowledge</span>{' '}Feed
          </h1>
          <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
            Curated research papers, authoritative books, and community blogs — the canonical
            reading list every competitive programmer should know.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-3 p-4 rounded-xl bg-card/40 border border-border/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" /> Filters
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map(tag => (
              <button key={tag} onClick={() => setTagFilter(tag as typeof tagFilter)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${tagFilter === tag ? 'bg-teal-500/20 border-teal-400/50 text-teal-300' : 'bg-transparent border-border/50 text-muted-foreground hover:border-teal-500/40 hover:text-teal-400'}`}>
                {tag}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {ALL_TYPES.map(type => (
              <button key={type} onClick={() => setTypeFilter(type as typeof typeFilter)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${typeFilter === type ? 'bg-indigo-500/20 border-indigo-400/50 text-indigo-300' : 'bg-transparent border-border/50 text-muted-foreground hover:border-indigo-500/40 hover:text-indigo-400'}`}>
                {type === 'All' ? 'All types' : TYPE_CFG[type as ResourceType].label}
              </button>
            ))}
            <button onClick={() => setStarredOnly(v => !v)}
              className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${starredOnly ? 'bg-amber-500/20 border-amber-400/50 text-amber-300' : 'bg-transparent border-border/50 text-muted-foreground hover:border-amber-500/40 hover:text-amber-400'}`}>
              <Star className={`w-3.5 h-3.5 ${starredOnly ? 'fill-amber-400' : ''}`} />
              Essential only
            </button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-5">
          Showing <span className="text-foreground font-semibold">{filtered.length}</span> of {RESOURCES.length} resources
        </p>

        {/* Cards */}
        <div className="space-y-4">
          {filtered.map(r => {
            const cfg = TYPE_CFG[r.type];
            const Icon = cfg.icon;
            return (
              <article key={r.id}
                className="group relative bg-card/50 border border-border/50 rounded-xl p-5 hover:border-teal-500/30 hover:bg-card/70 hover:shadow-[0_4px_24px_rgba(45,212,191,0.06)] transition-all duration-200">
                {r.starred && (
                  <div className="absolute top-4 right-4">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                )}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${cfg.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${cfg.color}`}>{cfg.label}</span>
                      <span className="text-[11px] text-muted-foreground">{r.year}</span>
                    </div>
                    <h3 className="font-semibold text-base leading-snug group-hover:text-teal-300 transition-colors">{r.title}</h3>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">{r.authors} · <span className="italic">{r.venue}</span></p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 ml-11">{r.abstract}</p>
                <div className="flex items-center justify-between ml-11">
                  <div className="flex flex-wrap gap-1.5">
                    {r.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50 text-[11px] text-muted-foreground border border-border/50">
                        <Tag className="w-2.5 h-2.5" />{tag}
                      </span>
                    ))}
                  </div>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <Button size="sm" variant="ghost" className="text-xs text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 px-3 h-7">
                      Read <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            No resources match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
