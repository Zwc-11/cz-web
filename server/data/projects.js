// Project case studies.
//
// Content here is sourced from each project's live GitHub repository
// (README, languages API, repo metadata) — deliberately richer and more
// specific than the one-line résumé bullets, so each detail page tells its
// own story. Screenshots under /projects/* are real captures: app SVGs and
// dashboard PNGs pulled from the repos, plus a live-site / repo capture.

export const projects = [
  {
    id: 'agentreplay',
    name: 'AgentReplay',
    subtitle: 'Browser Workflow Replay & Agent Failure Analysis',
    tagline: 'Record once, replay forever, see exactly where the agent diverged',
    role: 'Solo build · open source · MIT',
    year: '2026',
    description:
      'An open-source browser-workflow simulator and failure-analysis platform: record a real web workflow once, compile it into a replayable simulator, run an agent against it, and see exactly where the agent path diverged from the human path.',
    overview:
      'AgentReplay records a human performing a real browser workflow — clicks, typed input, navigations, network calls, and DOM snapshots — then turns that recording into a structured workflow graph and a runnable Playwright replay. You can run a browser agent against the same task and compare the human path to the agent path. The dashboard surfaces the first divergence step, step-level metrics, timeline evidence, network state, a root-cause summary, and an exportable Playwright test. The full loop is record → compile graph → run agent → compare paths → explain failure → export test.',
    challenge:
      'Browser agents fail in ways that are hard to diagnose from a transcript alone: they click a lookalike button or an ad, act on stale DOM before a route finishes loading, retry the wrong action after a network failure, or diverge silently several steps before the visible failure.',
    approach:
      'I built an event-sourced, hexagonal backend that reconstructs the browser state at every step. A recorder SDK streams BrowserEvents into an ingestion API and event store; a workflow compiler turns events into states and a graph; an agent runner and evaluator replay the task and detect the first divergence; a React Flow dashboard renders the human and agent paths side by side. The compiler and evaluator stay testable without a web server or database.',
    outcome:
      'Every recorded workflow compiles to a runnable Playwright test, and each run reports step-level outcomes — task success, step accuracy, first divergence, wrong-click count, recovery rate, and network-caused failure rate. A bundled benchmark across 4 workflows and 3 drivers shows the scripted baseline at 100% success while the divergent and random failure drivers drop to 63% and 47% step accuracy, pinpointing exactly where and why they break.',
    highlights: [
      'Record → replay → diff agent vs human',
      'First-divergence detection + root cause',
      'Workflow graph from real browser events',
      'Exportable runnable Playwright tests',
      'Event-sourced, hexagonal architecture',
    ],
    features: [
      'Recorder SDK captures clicks, input, navigations, network calls, and DOM snapshots as a structured BrowserEvent stream.',
      'Workflow compiler turns the event stream into states and a replayable workflow graph.',
      'Agent runner + evaluator replay the task and detect the first step where the agent diverged.',
      'React Flow dashboard renders human vs agent paths, timeline evidence, and network state.',
      'Failure summary explains the root cause and opens a pre-filled GitHub issue.',
      'Every workflow exports to a runnable Playwright test; a DeepSeek thinking-model driver can be benchmarked too.',
    ],
    metrics: [
      { label: 'Demo workflows', value: '4' },
      { label: 'Agent drivers', value: '3' },
      { label: 'Scripted success', value: '100%' },
      { label: 'Step-level metrics', value: '8' },
      { label: 'Core language', value: 'Python' },
      { label: 'License', value: 'MIT' },
    ],
    commands: [
      'npm install',
      'npm run dev -w @agentreplay/web',
      'python -m app.scripts.demo',
      'docker compose -f infra/docker-compose.yml up',
    ],
    screenshots: [
      { src: '/projects/agentreplay-calendar.png', caption: 'Calendar workflow replay — the agent clicked a "Special offer" lookalike instead of Save; first divergence flagged at step 6 with an AI root-cause summary.' },
      { src: '/projects/agentreplay-live-test.png', caption: 'Flaky-checkout run — a network delay surfaced a popup the agent clicked; divergence caught at step 2 and classified as network-caused.' },
    ],
    languages: [
      { name: 'Python', bytes: 100010 },
      { name: 'TypeScript', bytes: 67229 },
      { name: 'CSS', bytes: 1677 },
      { name: 'Makefile', bytes: 1246 },
      { name: 'HTML', bytes: 967 },
    ],
    repoMeta: { stars: 1, license: 'MIT', branch: 'main', updated: 'Jun 2026', primaryLanguage: 'Python' },
    tech: ['Python', 'FastAPI', 'Playwright', 'React', 'TypeScript', 'React Flow', 'Tailwind', 'PostgreSQL', 'Redis', 'Docker'],
    topics: ['browser-agents', 'workflow-replay', 'failure-analysis', 'playwright', 'event-sourcing', 'evaluation'],
    link: 'https://github.com/Zwc-11/agentreplay',
    liveUrl: null,
    image: '/projects/agentreplay-calendar.png',
    visual: 'trace',
  },
  {
    id: 'murmur',
    name: 'Murmur',
    subtitle: 'Reliability Harness for AI Coding Agents',
    tagline: 'Make coding-agent output measurable',
    role: 'Solo build · open source · MIT',
    year: '2026',
    description:
      'An open-source reliability harness that turns a task into an enforceable contract, runs agents through policy-controlled tools in an isolated workspace, and emits a PR-ready proof package with pass^k reliability metrics.',
    overview:
      'Cheap coding agents are useful, but a single generated patch is not enough for production. Murmur runs a task through many isolated attempts, checks every result against an explicit contract, and produces proof artifacts that show what passed, what failed, where it failed, and how reliable the workflow actually is. Instead of trusting one lucky run, it shows the whole distribution: pass@1, projected and empirical pass^k, variance, failures, cost, latency, event logs, trace spans, and acceptance evidence.',
    challenge:
      'Coding agents are non-deterministic — the same task can pass once and fail the next five times. There was no clean way to tell whether a failure was a bad model answer, a tool issue, a missing artifact, or a weak validator, and no way for CI to block only the regressions that are statistically real instead of noisy dips.',
    approach:
      'I built a Python-first, ports-and-adapters harness around a contract-first core. It fans a single task out into N independent attempts, verifies task-specific requirements before trusting any artifact, traces every step as gen_ai.*-style spans, and stamps failed spans with stable failure classes and diagnostic IDs. Models, tools, judges, storage, tracing, and report renderers all plug in through adapters.',
    outcome:
      'A statistical CI gate that blocks pull requests only on meaningful reliability regressions, a local workbench (`murmur serve`), deterministic offline demos that need no API key, a trace viewer, and a SWE-bench adapter. Murmur intentionally refuses to print benchmark-like numbers unless a real model and evaluator actually ran.',
    highlights: [
      'pass@1 / pass^k reliability reports',
      'Contract-first acceptance checks',
      'N-attempt agent fan-out',
      'gen_ai.* trace spans + replay',
      'Statistical CI regression gate',
    ],
    features: [
      'Agent fan-out — executes N independent attempts for the same task and reports the distribution, not one lucky run.',
      'Contract-first verification — checks task-specific acceptance requirements before trusting any generated artifact.',
      'Failure diagnosis — stamps failed spans with stable failure classes, diagnostic IDs, and evidence.',
      'Trace viewer — per-agent span waterfall with selectable trajectories and an inspector.',
      'CI gate — blocks PRs only when a reliability regression is statistically meaningful.',
      'Offline-first — deterministic scaffolds let you demo and test the harness with no API keys.',
    ],
    metrics: [
      { label: 'Test modules', value: '29' },
      { label: 'Fan-out attempts', value: '30' },
      { label: 'Core language', value: 'Python' },
      { label: 'License', value: 'MIT' },
    ],
    commands: [
      'murmur serve',
      'murmur fix-test --cmd "pytest -q" --budget 0.50',
      'murmur run --n 30 --success-rate 0.7 --seed 7',
      'murmur gate --branch main --n 20 --update-baseline',
    ],
    screenshots: [
      { src: '/projects/murmur-workflow-map.png', caption: 'Operator map from a live run — a natural-language goal fans out across classify, generate, rank, verify, and report modules (7 modules · 9 flows · 33 gates).' },
      { src: '/projects/murmur-fan-report.png', caption: 'Reliability report from a 30-attempt fan-out — pass@1 0.80 (Wilson 95% CI 0.63–0.90), pass^k decay projected vs empirical, variance 0.16, 6/30 failures.' },
      { src: '/projects/murmur-trace-viewer.png', caption: 'Trace viewer — per-trajectory span waterfall with the agent.run → plan → act → verify timeline and a gen_ai.* span inspector.' },
    ],
    languages: [
      { name: 'Python', bytes: 1065856 },
      { name: 'TypeScript', bytes: 52519 },
      { name: 'CSS', bytes: 25797 },
      { name: 'JavaScript', bytes: 5369 },
      { name: 'Makefile', bytes: 963 },
    ],
    repoMeta: { stars: 1, license: 'MIT', branch: 'main', updated: 'Jun 2026', primaryLanguage: 'Python' },
    tech: ['Python', 'pytest', 'TypeScript', 'GitHub Actions', 'OpenTelemetry', 'SWE-bench', 'Docker'],
    topics: ['agent-harness', 'ai-agents', 'coding-agent', 'evaluation', 'llm', 'proof', 'reliability', 'swe-bench'],
    link: 'https://github.com/Zwc-11/Murmur-ai-harness',
    liveUrl: null,
    image: '/projects/murmur-workflow-map.png',
    visual: 'trace',
  },
  {
    id: 'marketimmune',
    name: 'MarketImmune',
    subtitle: 'AI Market-Safety Platform · Agentic Immune Loop',
    tagline: 'An immune system for adversarial trading agents',
    role: 'Full-stack ML platform',
    year: '2026',
    description:
      'An agentic market-safety research platform for crypto perpetuals: a six-agent autonomous immune loop runs over live Hyperliquid perp flow, scores maker fills for adverse selection with a CatBoost markout model, investigates each alert, decides a control action, and persists an append-only audit trail behind a terminal-style Django + React/TypeScript dashboard.',
    overview:
      'MarketImmune is a research prototype for detecting adverse selection and toxic order flow in crypto perpetual markets, built around an immune-loop model: generate → detect → investigate → decide → remember. It ingests free public Hyperliquid API candles, order book, and perp context, scores maker fills with a promoted CatBoost markout model, raises toxicity alerts, opens investigation case files with matched rules and feature evidence, decides withhold / flag / monitor, and remembers novel episodes — all visible in a terminal-style dashboard with an append-only decision audit trail. Metrics are honesty-first: numbers come from real markout evaluation, never hard-coded claims.',
    challenge:
      'Harmful order flow hides inside ordinary-looking maker fills and moves faster than human review. Detecting adverse selection needs a calibrated markout model plus an auditable explanation a compliance reviewer can trust — and an evaluation that refuses to leak the future.',
    approach:
      'I built a six-agent loop — RedTeam, Market Simulator, Risk Sentinel, Investigator, Policy, and Immune Memory — over live Hyperliquid perp data. A promoted CatBoost markout model scores maker fills; matched rule overlays and feature deviations turn each alert into a structured investigation case file; a policy agent decides withhold / flag / monitor; and every step persists to an append-only audit trail. Model promotion runs under a leakage-safe, purged and embargoed walk-forward.',
    outcome:
      'A live terminal dashboard over real Hyperliquid flow: the immune loop completes in ~15 ms per cycle, the benchmark champion holds a 0.821 walk-forward PR-AUC, and the CatBoost markout candidate is weighed against an explicit event-OFI baseline. Every alert carries feature evidence, matched rules, a model verdict, and a fully traceable decision record.',
    highlights: [
      'Six-agent autonomous immune loop',
      'Live Hyperliquid perp market data',
      'CatBoost markout risk model',
      'Explainable investigation case files',
      'Append-only decision audit trail',
    ],
    features: [
      'Live Hyperliquid market cockpit — candles, order-book depth, funding, and basis at ~4 ms cache latency.',
      'Six-agent loop: RedTeam → Market Simulator → Risk Sentinel → Investigator → Policy → Immune Memory, with persisted tool traces.',
      'Toxicity Sentinel scores maker fills for adverse selection with explainable feature evidence.',
      'Investigation case files pair matched rules, feature deviations, and a model verdict per alert.',
      'Model & Benchmark Center weighs a CatBoost markout candidate against an event-OFI baseline under purged/embargoed walk-forward.',
      'Append-only decision audit trail makes every loop decision and agent action traceable.',
    ],
    metrics: [
      { label: 'Walk-forward PR-AUC', value: '0.821' },
      { label: 'Prediction confidence', value: '74%' },
      { label: 'False-positive rate', value: '0.120%' },
      { label: 'Autonomous agents', value: '6' },
      { label: 'Loop cycle', value: '~15 ms' },
      { label: 'Market data', value: 'Hyperliquid' },
    ],
    commands: [
      "python -m pip install -e '.[dev]'",
      'python manage.py migrate',
      'python manage.py runserver 127.0.0.1:8000',
      'python scripts/train_hyperliquid_markout.py --coin SOL --date 20260601',
    ],
    screenshots: [
      { src: '/projects/mi-command.png', caption: 'Command Center — the immune loop completed 6/6 over live Hyperliquid flow, with active scenario, toxicity posture, and loop telemetry (walk-forward PR-AUC 0.821, FP rate 0.120%).' },
      { src: '/projects/mi-live.png', caption: 'Live Hyperliquid market — free public API candles, order-book depth, funding, and basis streaming at ~4 ms cache latency.' },
      { src: '/projects/mi-immune-loop.png', caption: 'Immune Loop — six-agent orchestration (RedTeam → Market Simulator → Risk Sentinel → Investigator → Policy → Immune Memory) with per-agent latency and persisted tool traces.' },
      { src: '/projects/mi-investigation.png', caption: 'Investigation Case File — an adverse-selection markout alert with feature evidence, matched rules, a CatBoost model verdict, and linked identifiers.' },
      { src: '/projects/mi-models.png', caption: 'Model & Benchmark Center — CatBoost markout candidate weighed against an event-OFI champion under a purged/embargoed walk-forward.' },
    ],
    languages: [
      { name: 'Python', bytes: 597568 },
      { name: 'TypeScript', bytes: 209231 },
      { name: 'HTML', bytes: 165301 },
      { name: 'CSS', bytes: 81461 },
      { name: 'JavaScript', bytes: 23381 },
    ],
    repoMeta: { stars: 1, license: '—', branch: 'master', updated: 'Jun 2026', primaryLanguage: 'Python' },
    tech: ['Python', 'Django', 'DRF', 'CatBoost', 'scikit-learn', 'PyTorch', 'React', 'TypeScript', 'Vite', 'Hyperliquid API'],
    topics: ['market-safety', 'multi-agent', 'adverse-selection', 'hyperliquid', 'catboost', 'markout'],
    link: 'https://github.com/Zwc-11/Marketimmune',
    liveUrl: null,
    image: '/projects/mi-command.png',
    visual: 'flow',
  },
  {
    id: 'chaoswing',
    name: 'ChaosWing',
    subtitle: 'Self-Supervised Neural Reranker for Prediction Markets',
    tagline: 'Let the price history mine its own labels',
    role: 'Retrieval & ranking research · live',
    year: '2026',
    description:
      'A two-stage neural retrieval pipeline for prediction-market events: a bi-encoder retrieves the top-100 candidate markets and a fine-tuned cross-encoder reranks them — with relevance labels mined automatically from historical implied-probability lead-lag co-movement, no human labeling required.',
    overview:
      'Most prediction-market rerankers rely on title similarity or hand-curated labels. ChaosWing asks a different question: can a market\'s historical probability series tell us which other markets are economically related? The answer is yes, at three levels — cross-correlation, Granger causality (p < 0.01), and shared-shock co-fraction — which combine into a 0–3 graded relevance label mined from the data itself. The cross-encoder learns from those labels, and a downstream forecasting probe tests whether its top-k neighbors actually improve Brier score over a single-market logistic baseline.',
    challenge:
      'Ranking prediction-market questions by relevance is easy to fake and even easier to leak. A single event like "Fed March decision" spawns many correlated sub-markets, so a random split leaks near-twins across train and test and inflates every metric.',
    approach:
      'Labels are mined from lead-lag co-movement instead of written by hand. Splits are strictly temporal — never random — bucketed by first-seen and de-duplicated by event family so a market and its near-twin land in the same split. Every label-mining, reranking, and forecasting call flows through a TemporalCutoff chokepoint that raises a LeakageError if any feature touches data at or after its cutoff.',
    outcome:
      'A live Django app and a benchmark where the fine-tuned cross-encoder is scored against a bi-encoder, RankGPT, Cohere Rerank, BM25, and lexical baselines on the same temporal test split (NDCG@5/10, MRR, Recall@5/100, p95 latency). A 162-test suite enforces leakage, per-method chokepoints, and the ranking/forecasting math.',
    highlights: [
      'Self-mined 0–3 relevance labels',
      'Bi-encoder → fine-tuned cross-encoder',
      'Granger + cross-correlation signals',
      'Leakage-safe temporal splits',
      '162 tests · live on Render',
    ],
    features: [
      'Label factory mines relevance from cross-correlation, Granger causality, and shared-shock co-fraction.',
      'Stage 1 bi-encoder (SentenceTransformers + FAISS) retrieves the top-100 candidates.',
      'Stage 2 fine-tuned cross-encoder reranks, early-stopping on validation NDCG@5.',
      'Leakage chokepoint — a TemporalCutoff value object raises LeakageError on any post-cutoff data.',
      'Reranker registry — add a method with one class plus one @register decorator.',
      'Forecasting probe checks whether top-k neighbors beat a logistic baseline on Brier score.',
    ],
    metrics: [
      { label: 'Tests passing', value: '162' },
      { label: 'Stage-1 retrieval', value: 'top-100' },
      { label: 'Granger threshold', value: 'p < 0.01' },
      { label: 'Label grades', value: '0–3' },
    ],
    commands: [
      'python manage.py mine_relevance_labels --cutoff 2025-06-01T00:00:00Z',
      'python manage.py build_temporal_splits --name chaoswing-2025',
      'python manage.py train_cross_encoder --split chaoswing-2025',
      'python manage.py run_rerank_benchmark --split chaoswing-2025',
    ],
    screenshots: [
      { src: '/projects/chaoswing-live.png', caption: 'The deployed ChaosWing site — public OpenAPI + live reference for graph generation, benchmarks, watchlists, and lead-lag research.' },
    ],
    languages: [
      { name: 'Python', bytes: 1157044 },
      { name: 'HTML', bytes: 142024 },
      { name: 'CSS', bytes: 132038 },
      { name: 'JavaScript', bytes: 93525 },
      { name: 'Jupyter Notebook', bytes: 16559 },
    ],
    repoMeta: { stars: 1, license: 'MIT', branch: 'main', updated: 'May 2026', primaryLanguage: 'Python' },
    tech: ['Python', 'PyTorch', 'Django', 'SentenceTransformers', 'FAISS', 'transformers', 'statsmodels', 'MLflow', 'Cohere'],
    topics: ['reranking', 'retrieval', 'prediction-markets', 'self-supervised', 'leakage-safe'],
    link: 'https://github.com/Zwc-11/Chaoswing',
    liveUrl: 'https://chaoswing.onrender.com',
    image: '/projects/chaoswing-live.png',
    visual: 'graph',
  },
  {
    id: 'quant-portfolio',
    name: 'Quant Portfolio',
    subtitle: 'Monte Carlo + CAPM + MPT Allocator',
    tagline: 'Pick and size a portfolio you have never seen',
    role: 'Waterloo CS & Finance final · team build',
    year: '2024',
    description:
      'A stock-portfolio construction engine for the University of Waterloo CS & Finance final: it combines Monte Carlo simulation, the Capital Asset Pricing Model, and Modern Portfolio Theory to pick and size an equally-weighted, risk-diversified basket from a competition ticker set.',
    overview:
      'The competition only releases the ticker set after the contest, so you cannot hand-pick winners in advance — the TA then chooses 12 stocks from the program\'s output and tracks them for a week to compute an average return rate. The engine retrieves market data, runs Monte Carlo simulations over CAPM expected returns and Modern Portfolio Theory risk, scores each stock on volatility and risk-adjusted return, equally weights the survivors to diversify, and computes exact share counts accounting for currency conversion and trading costs — exporting a ready-to-submit CSV.',
    challenge:
      'Because the tickers are unknown until after the contest, there is no room to over-fit to specific names. The strategy has to be a repeatable, defensible process that holds up on an arbitrary basket over a tracked week.',
    approach:
      'I pulled market data and ran Monte Carlo simulations over CAPM expected returns and MPT risk, scoring every candidate on volatility and risk-adjusted return. The survivors are equally weighted to diversify idiosyncratic risk, and share counts are sized against currency conversion and per-trade costs.',
    outcome:
      'The program outputs the selected stocks and exact share counts as a ready-to-submit CSV for the TA-tracked simulated portfolio — a fully reproducible pipeline from raw tickers to an executable allocation.',
    highlights: [
      'Monte Carlo simulation',
      'CAPM expected returns',
      'Modern Portfolio Theory weighting',
      'FX + trading-cost share sizing',
      'CSV portfolio export',
    ],
    features: [
      'Retrieves market data for an arbitrary, contest-supplied ticker set.',
      'Monte Carlo simulation over CAPM expected returns and MPT risk.',
      'Volatility and risk-adjusted-return scoring per stock.',
      'Equal-weight allocation to diversify idiosyncratic risk.',
      'Share sizing with currency conversion and trading costs.',
      'CSV export ready for the TA-tracked simulated portfolio.',
    ],
    metrics: [
      { label: 'Tracked stocks', value: '12' },
      { label: 'Tracking window', value: '1 week' },
      { label: 'Weighting', value: 'Equal' },
      { label: 'Format', value: 'Jupyter' },
    ],
    commands: [],
    screenshots: [
      { src: '/projects/quant-repo.png', caption: 'The project repository — a Colab notebook, the competition Tickers.xls, and the strategy write-up.' },
    ],
    languages: [
      { name: 'Jupyter Notebook', bytes: 36127 },
    ],
    repoMeta: { stars: 0, license: '—', branch: 'main', updated: 'Dec 2024', primaryLanguage: 'Jupyter Notebook' },
    tech: ['Python', 'Jupyter', 'NumPy', 'pandas', 'Monte Carlo', 'CAPM', 'MPT'],
    topics: ['quantitative-finance', 'portfolio-optimization', 'monte-carlo', 'capm', 'mpt'],
    link: 'https://github.com/Zwc-11/Quantitative-Portfolio-Management-Strategy',
    liveUrl: null,
    image: '/projects/quant-repo.png',
    visual: 'flow',
  },
];
