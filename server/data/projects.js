// Project case studies.
//
// Content here is sourced from each project's live GitHub repository README,
// GitHub metadata, and visible repo artifacts. Keep claims narrower than the
// linked repo: if a feature, metric, benchmark, screenshot status, or maturity
// claim is not visible there, soften it here.
// 2026-07-01: Hindsight goes to slot 1 once its repo has a committed benchmark artifact + demo GIF — do not add it before then

export const projects = [
  {
    id: 'hindsight',
    name: 'Hindsight',
    subtitle: 'Leakage-Audited Backtesting Harness',
    tagline: 'The backtester that catches you lying to yourself',
    role: 'Solo extraction, open source, MIT',
    year: '2026',
    description:
      'A standalone Python evaluation harness for Hyperliquid microstructure strategies: deterministic replay, point-in-time feature access, purged walk-forward validation, leakage tripwires, costed fills, and hash-stamped run manifests.',
    overview:
      'Hindsight turns the evaluation layer that used to live inside MarketImmune into its own focused repo. It is built for research integrity rather than live trading: every run is deterministic, feature reads are pinned to replay time, folds are purged and embargoed, leakage probes fail hard, and reports carry code/config/data provenance through a manifest.',
    challenge:
      'Trading-model backtests are easy to make look good by accidentally leaking the future: random splits over forward-looking labels, features fit on test data, overlapping label intervals, or a baseline that reads future returns directly. The project needed a public proof that catches those mistakes instead of hiding them inside a larger app repo.',
    approach:
      'I extracted the engine into a clean package, vendored only the small event/markout/lake boundaries it needed, removed MarketImmune imports, added strict lint/type/coverage gates, and built an offline demo that compares a deliberately unsafe random-split control against the Hindsight audit path.',
    outcome:
      'The standalone repo now runs offline with 86 Hindsight tests at a 95% coverage gate. Its committed demo artifacts show the unsafe control ranking the leaky policy first, then the Hindsight auditor blocking that same policy and emitting reproducible JSON, Markdown, leaderboard, and manifest outputs from synthetic sample data.',
    highlights: [
      '86-test standalone suite',
      '95% coverage gate',
      'Purged and embargoed folds',
      'Four-probe leakage auditor',
      'Hash-stamped run manifests',
    ],
    features: [
      'Point-in-time view raises on lookahead feature access.',
      'Purged walk-forward folds remove overlapping label intervals and embargo neighboring samples.',
      'Leakage auditor checks target-name leakage, fit-on-test normalizers, label overlap, and future-perturbation sensitivity.',
      'Execution model discloses its limits: taker-at-touch market fills, capped maker fills, linear slippage, flat funding, no queue model.',
      'Offline demo produces JSON, Markdown, leaderboards, and a manifest from bundled synthetic sample data.',
      'CI workflow runs lint, mypy, coverage, import isolation, smoke commands, and demo determinism.',
    ],
    metrics: [
      { label: 'Tests passing', value: '86' },
      { label: 'Coverage gate', value: '95%' },
      { label: 'Demo mode', value: 'Offline' },
      { label: 'Data label', value: 'Synthetic' },
      { label: 'License', value: 'MIT' },
    ],
    commands: [
      'python -m pip install -e ".[dev]"',
      'python -m coverage run -m pytest tests/hindsight -q',
      'python -m coverage report',
      'python -m hindsight.cli demo',
    ],
    screenshots: [],
    languages: [
      { name: 'Python', bytes: 175216 },
      { name: 'Markdown', bytes: 9968 },
      { name: 'YAML', bytes: 1654 },
      { name: 'PowerShell', bytes: 1262 },
      { name: 'TOML', bytes: 1202 },
    ],
    repoMeta: { stars: 0, license: 'MIT', branch: 'main', updated: 'Jul 2026', primaryLanguage: 'Python' },
    tech: ['Python', 'pytest', 'mypy', 'Ruff', 'coverage.py', 'pyarrow', 'Hyperliquid data layout'],
    topics: ['backtesting', 'market-microstructure', 'leakage-detection', 'hyperliquid', 'evaluation', 'quant-research'],
    link: 'https://github.com/Zwc-11/Hindsight',
    liveUrl: null,
    image: null,
    visual: 'trace',
  },
  {
    id: 'marketimmune',
    name: 'MarketImmune',
    subtitle: 'Agentic Market-Safety Research Prototype',
    tagline: 'Audit market-structure alerts without trading claims',
    role: 'Full-stack ML research prototype',
    year: '2026',
    description:
      'A research prototype for crypto perpetual market monitoring: a terminal-style Django + React dashboard, an agentic immune loop, append-only audit records, a Hyperliquid market-data path, and real markout evaluation around CatBoost.',
    overview:
      'MarketImmune is a research prototype, not a live trading system. The linked repo shows a Django/React market dashboard, agentic immune-loop endpoints, Hyperliquid public API market-data path, markout labeling/evaluation for real Hyperliquid fills, leakage-aware evaluation tools, and an append-only decision audit trail. The README also labels remaining fixture-backed views and scopes the CatBoost report as a first local SOL panel proof, not a broad production benchmark.',
    challenge:
      'Toxic order flow can hide inside ordinary-looking market activity, and reviewers need a model result plus an auditable explanation path before trusting an alert.',
    approach:
      'I built the dashboard/API around an immune-loop model: generate, detect, investigate, decide, and remember. The current repo records structured AgentRun, ToolCall, and DecisionTrace evidence, exposes dashboard views for simulator, risk, model, memory, audit, and loop state, and keeps the markout evaluation path separated from trading execution.',
    outcome:
      '[real-model] The committed README reports a local SOL holdout run trained on 20260527..20260531 and held out on 20260601: PR-AUC=0.556, Brier=0.233, markout_lift_bps=0.860, and +0.109 bps versus the event-OFI baseline. The project is presented as a dashboard and research workspace, with no claim that real orders are sent.',
    highlights: [
      'Agentic immune-loop dashboard',
      'Append-only decision audit trail',
      'Hyperliquid market-data path',
      '[real-model] CatBoost markout report',
      'Leakage-aware evaluation tooling',
    ],
    features: [
      'React/Django market dashboard with simulator, risk, model, memory, audit, and agentic-loop screens.',
      'Django API endpoints for live tick data, simulator state/control, risk-head health, markout-model health, and agentic loop state/run.',
      'Agentic immune loop emits structured AgentRun, ToolCall, and DecisionTrace records.',
      'Exchange ingestion path covers Hyperliquid public API samples and requester-pays historical backfills into local parquet tables.',
      'Markout labeling and CatBoost evaluation run on real Hyperliquid fills, with the README scoping current results to a local SOL panel proof.',
      'Leakage-aware evaluation uses purged/embargoed walk-forward splits, calibration metrics, and promotion policy checks.',
    ],
    metrics: [
      { label: '[real-model] PR-AUC', value: '0.556' },
      { label: '[real-model] Brier', value: '0.233' },
      { label: '[real-model] Markout lift', value: '0.860 bps' },
      { label: '[real-model] vs event-OFI', value: '+0.109 bps' },
      { label: 'Market data path', value: 'Hyperliquid' },
      { label: 'Status', value: 'Prototype' },
    ],
    commands: [
      "python -m pip install -e '.[dev]'",
      'python manage.py migrate',
      'python manage.py runserver 127.0.0.1:8000',
      'python -m scripts.train_hyperliquid_markout --coin SOL --date 20260601 --horizon 10s --iterations 150',
    ],
    screenshots: [
      { src: '/projects/mi-command.png', caption: 'Command Center capture - terminal-style dashboard with simulator, risk, model, memory, audit, and agentic-loop surfaces.' },
      { src: '/projects/mi-live.png', caption: 'Live Market capture - README-backed market dashboard surface with ticker, candle, and depth views over the Hyperliquid data path.' },
      { src: '/projects/mi-immune-loop.png', caption: 'Immune Loop capture - agentic-loop state with structured run, tool-call, and decision-trace evidence.' },
      { src: '/projects/mi-investigation.png', caption: 'Investigation Case File capture - alert evidence, matched rules, model context, and linked identifiers in the dashboard.' },
      { src: '/projects/mi-models.png', caption: 'Model Center capture - CatBoost markout report presented as a local SOL panel proof against an event-OFI baseline.' },
    ],
    languages: [
      { name: 'Python', bytes: 1199716 },
      { name: 'TypeScript', bytes: 316610 },
      { name: 'HTML', bytes: 166486 },
      { name: 'CSS', bytes: 99568 },
      { name: 'JavaScript', bytes: 24438 },
      { name: 'Batchfile', bytes: 1964 },
      { name: 'PowerShell', bytes: 1941 },
      { name: 'Shell', bytes: 1684 },
      { name: 'Makefile', bytes: 909 },
    ],
    repoMeta: { license: 'No license', branch: 'master', updated: 'Jul 2026', primaryLanguage: 'Python' },
    tech: ['Python', 'Django', 'DRF', 'CatBoost', 'scikit-learn', 'React', 'TypeScript', 'Vite', 'Hyperliquid API'],
    topics: ['market-safety', 'multi-agent', 'adverse-selection', 'hyperliquid', 'catboost', 'markout'],
    link: 'https://github.com/Zwc-11/Marketimmune',
    liveUrl: null,
    image: '/projects/mi-command.png',
    visual: 'flow',
  },
  {
    id: 'murmur',
    name: 'Murmur',
    subtitle: 'Reliability Harness for AI Coding Agents',
    tagline: 'Make coding-agent output measurable',
    role: 'Solo build - open source - MIT',
    year: '2026',
    description:
      'An open-source reliability harness that turns a coding task into an explicit contract, runs multiple isolated attempts, and emits proof artifacts that show what passed, what failed, and how reliable the workflow was.',
    overview:
      'Cheap coding agents are useful, but a single generated patch is not enough for production. Murmur runs a task through many isolated attempts, checks every result against an explicit contract, and produces artifacts that show what passed, what failed, where it failed, and how reliable the workflow actually is. Instead of trusting one lucky run, it shows the distribution: pass@1, projected and empirical pass^k, Wilson intervals, variance, failures, cost, latency, event logs, trace spans, and acceptance evidence.',
    challenge:
      'Coding agents are non-deterministic: the same task can pass once and fail the next five times. There was no clean way to tell whether a failure was a bad model answer, a tool issue, a missing artifact, or a weak validator, and no way for CI to block only the regressions that are statistically real instead of noisy dips.',
    approach:
      'I built a Python-first, ports-and-adapters harness around a contract-first core. It fans a single task out into N independent attempts, verifies task-specific requirements before trusting any artifact, traces every step as gen_ai.*-style spans, and stamps failed spans with stable failure classes and diagnostic IDs. Models, tools, judges, storage, tracing, reports, and agents plug in through ports.',
    outcome:
      'The linked repo shows deterministic offline demos, fan reports, trace viewer, replay verification, a contract-first fix/test flow, a statistical regression gate with a GitHub Action wrapper, a local workbench, public trace importers, and SWE-bench adapter wiring with fake-model tests. Murmur intentionally refuses to print benchmark-like numbers unless a real model and evaluator actually ran.',
    highlights: [
      'pass@1 / pass^k reliability reports',
      'Contract-first acceptance checks',
      'N-attempt agent fan-out',
      'gen_ai.* trace spans + replay',
      'Statistical CI regression gate',
    ],
    features: [
      'Agent fan-out executes N independent attempts for the same task and reports the distribution, not one lucky run.',
      'Contract-first verification checks task-specific acceptance requirements before trusting any generated artifact.',
      'Failure diagnosis stamps failed spans with stable failure classes, diagnostic IDs, and evidence.',
      'Trace viewer shows per-agent span waterfalls with selectable trajectories and an inspector.',
      'CI gate compares pass^k against a stored baseline with a seeded paired-delta bootstrap and blocks only when the CI is below zero.',
      'Offline-first deterministic scaffolds demo and test the harness with no API keys.',
    ],
    metrics: [
      { label: '[synthetic/deterministic] Attempts', value: '30' },
      { label: '[synthetic/deterministic] pass@1', value: '0.80' },
      { label: '[synthetic/deterministic] Replay', value: '30/30' },
      { label: '[real-model] Sample size', value: 'n=10' },
      { label: 'Core language', value: 'Python' },
      { label: 'License', value: 'MIT' },
    ],
    commands: [
      'murmur serve',
      'murmur fix-test --cmd "python -m pytest tests/test_checkout.py -q" --budget 0.50',
      'murmur run --n 30 --success-rate 0.7 --error-rate 0.1 --seed 7',
      'murmur gate --suite synthetic --n 30 --k 5 --seed 7 --branch main',
    ],
    screenshots: [
      { src: '/projects/murmur-workflow-map.svg', caption: '[bundled demo data] Workbench operator map in offline preview mode before a run is launched.' },
      { src: '/projects/murmur-fan-report.png', caption: '[synthetic/deterministic] Reliability fan report from a 30-attempt seeded scaffold: pass@1 0.80 with Wilson interval, projected vs empirical pass^k decay, and 6/30 failures.' },
      { src: '/projects/murmur-trace-viewer.png', caption: '[synthetic/deterministic] Trace viewer capture for 30 trajectories with replay verification, span waterfall, and inspector.' },
    ],
    languages: [
      { name: 'Python', bytes: 1115134 },
      { name: 'TypeScript', bytes: 52519 },
      { name: 'CSS', bytes: 26149 },
      { name: 'JavaScript', bytes: 5369 },
      { name: 'Makefile', bytes: 927 },
    ],
    repoMeta: { license: 'MIT', branch: 'main', updated: 'Jul 2026', primaryLanguage: 'Python' },
    tech: ['Python', 'pytest', 'TypeScript', 'GitHub Actions', 'OpenTelemetry', 'SWE-bench', 'Docker'],
    topics: ['agent-harness', 'ai-agents', 'coding-agent', 'evaluation', 'llm', 'proof', 'reliability', 'swe-bench'],
    link: 'https://github.com/Zwc-11/Murmur-ai-harness',
    liveUrl: null,
    image: '/projects/murmur-workflow-map.svg',
    visual: 'trace',
  },
  {
    id: 'agentreplay',
    name: 'AgentReplay',
    subtitle: 'Browser Workflow Replay & Agent Failure Analysis',
    tagline: 'Record a bundled workflow, replay it, and inspect divergence',
    role: 'Solo build - open source - MIT',
    year: '2026',
    description:
      'An early-prototype browser-workflow simulator and failure-analysis platform: record a browser workflow, compile it into a replayable graph, run an agent against it, and inspect where the agent diverged from the human path.',
    overview:
      'AgentReplay records a human performing a browser workflow - clicks, typed input, navigations, fetch network calls, and DOM snapshots - then turns that recording into a structured workflow graph and a Playwright test scaffold. The dashboard compares the human path to an agent path and surfaces first divergence, step-level metrics, timeline evidence, network state, a root-cause summary, and an exportable scaffold. The README scopes the current v0.x target to bundled demo sites and recordings; drifting public sites, authentication flows, and anti-automation controls are out of scope today.',
    challenge:
      'Browser agents fail in ways that are hard to diagnose from a transcript alone: they click a lookalike button or an ad, act on stale DOM before a route finishes loading, retry the wrong action after a network failure, or diverge silently several steps before the visible failure.',
    approach:
      'I built an event-sourced, hexagonal backend that reconstructs browser state at each step. A recorder SDK streams BrowserEvents into an ingestion API and event store; a workflow compiler turns events into states and a graph; an agent runner and evaluator replay the task and detect the first divergence; a React Flow dashboard renders the human and agent paths side by side.',
    outcome:
      '[bundled demo data] The README reports a bundled benchmark across 4 workflows and 3 drivers: the scripted driver reaches 100% task success and 100% mean step accuracy, while deliberate divergent and random drivers show lower step accuracy and first-divergence evidence. Generated Playwright exports are described as scaffolds that may need target-app setup before standalone use.',
    highlights: [
      'Early v0.x prototype',
      'Bundled demo workflow replay',
      'First-divergence detection + root cause',
      'Workflow graph from browser events',
      'Exportable Playwright test scaffold',
    ],
    features: [
      'Recorder SDK captures clicks, input, navigations, fetch network calls, and DOM snapshots as structured BrowserEvents; XHR is not intercepted.',
      'Workflow compiler turns the event stream into states and a replayable workflow graph.',
      'Agent runner + evaluator replay the task and detect the first step where the agent diverged.',
      'React Flow dashboard renders human vs agent paths, timeline evidence, and network state.',
      'Failure summary explains the root cause and can open a pre-filled GitHub issue.',
      'Recorded human-path commands export to a Playwright test scaffold, with verification artifacts for the calendar demo.',
    ],
    metrics: [
      { label: '[bundled demo data] Workflows', value: '4' },
      { label: '[bundled demo data] Drivers', value: '3' },
      { label: '[bundled demo data] Scripted success', value: '100%' },
      { label: '[bundled demo data] Divergent accuracy', value: '63%' },
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
      { src: '/projects/agentreplay-calendar.png', caption: '[bundled demo data] Calendar workflow replay from a local bundled demo run, showing human-vs-agent graph and first-divergence evidence.' },
      { src: '/projects/agentreplay-live-test.png', caption: '[bundled demo data] Dashboard detail view showing timeline evidence, network state, and divergence context from a bundled workflow.' },
    ],
    languages: [
      { name: 'Python', bytes: 100010 },
      { name: 'TypeScript', bytes: 67979 },
      { name: 'CSS', bytes: 1677 },
      { name: 'Makefile', bytes: 1246 },
      { name: 'HTML', bytes: 967 },
      { name: 'JavaScript', bytes: 642 },
      { name: 'Dockerfile', bytes: 433 },
    ],
    repoMeta: { license: 'MIT', branch: 'main', updated: 'Jul 2026', primaryLanguage: 'Python' },
    tech: ['Python', 'FastAPI', 'Playwright', 'React', 'TypeScript', 'React Flow', 'Tailwind', 'PostgreSQL', 'Redis', 'Docker'],
    topics: ['browser-agents', 'workflow-replay', 'failure-analysis', 'playwright', 'event-sourcing', 'evaluation'],
    link: 'https://github.com/Zwc-11/agentreplay',
    liveUrl: null,
    image: '/projects/agentreplay-calendar.png',
    visual: 'trace',
  },
  {
    id: 'chaoswing',
    name: 'ChaosWing',
    subtitle: 'Self-Supervised Neural Reranker for Prediction Markets',
    tagline: 'Let price history mine its own labels',
    role: 'Retrieval & ranking research',
    year: '2026',
    description:
      'A two-stage neural retrieval pipeline for prediction-market events: a bi-encoder retrieves the top-100 candidate markets and a fine-tuned cross-encoder reranks them with labels mined from historical implied-probability lead-lag co-movement.',
    overview:
      'Most prediction-market rerankers rely on title similarity or hand-curated labels. ChaosWing asks whether a market price series can identify economically related markets. The README defines three label signals - cross-correlation, Granger causality at p < 0.01, and shock co-fraction - which combine into a 0-3 graded relevance label mined from data. The cross-encoder learns from those labels, and a downstream forecasting probe tests whether its top-k neighbors improve Brier score relative to a single-market logistic baseline.',
    challenge:
      'Ranking prediction-market questions by relevance is easy to leak. A single event like "Fed March decision" can spawn correlated sub-markets, so a random split leaks near-twins across train and test and inflates metrics.',
    approach:
      'Labels are mined from lead-lag co-movement instead of written by hand. Splits are strictly temporal, bucketed by first-seen time, and de-duplicated by event family so a market and its near-twin land in the same split. Every label-mining, reranking, and forecasting call flows through a TemporalCutoff chokepoint that raises LeakageError if any feature touches data at or after its cutoff.',
    outcome:
      'The linked repo defines a benchmark harness where the fine-tuned cross-encoder is scored against a bi-encoder, RankGPT-style listwise baseline, Cohere Rerank, BM25, and lexical baselines on the same temporal test split. The README reports a 162-test ranker suite covering leakage, method-level chokepoints, and ranking/forecasting math. The Render demo link is omitted here because the current liveness probe returned a server error.',
    highlights: [
      'Self-mined 0-3 relevance labels',
      'Bi-encoder -> fine-tuned cross-encoder',
      'Granger + cross-correlation signals',
      'Leakage-safe temporal splits',
      '162 tests in linked README',
    ],
    features: [
      'Label factory mines relevance from cross-correlation, Granger causality, and shock co-fraction.',
      'Stage 1 bi-encoder with SentenceTransformers + FAISS retrieves the top-100 candidates.',
      'Stage 2 fine-tuned cross-encoder reranks, early-stopping on validation NDCG@5.',
      'Leakage chokepoint: a TemporalCutoff value object raises LeakageError on any post-cutoff data.',
      'Reranker registry lets a method be added with one class plus one @register decorator.',
      'Forecasting probe checks whether top-k neighbors beat a logistic baseline on Brier score.',
    ],
    metrics: [
      { label: 'Tests in README', value: '162' },
      { label: 'Stage-1 retrieval', value: 'top-100' },
      { label: 'Granger threshold', value: 'p < 0.01' },
      { label: 'Label grades', value: '0-3' },
    ],
    commands: [
      'python manage.py mine_relevance_labels --cutoff 2025-06-01T00:00:00Z',
      'python manage.py build_temporal_splits --name chaoswing-2025',
      'python manage.py train_cross_encoder --split chaoswing-2025',
      'python manage.py run_rerank_benchmark --split chaoswing-2025',
    ],
    screenshots: [
      { src: '/projects/chaoswing-live.png', caption: 'ChaosWing interface capture - ranking, benchmark, watchlist, and lead-lag research surfaces described in the linked repo.' },
    ],
    languages: [
      { name: 'Python', bytes: 1157044 },
      { name: 'HTML', bytes: 142024 },
      { name: 'CSS', bytes: 132038 },
      { name: 'JavaScript', bytes: 93525 },
      { name: 'Jupyter Notebook', bytes: 16559 },
      { name: 'Makefile', bytes: 695 },
      { name: 'Shell', bytes: 146 },
    ],
    repoMeta: { license: 'MIT', branch: 'main', updated: 'May 2026', primaryLanguage: 'Python' },
    tech: ['Python', 'PyTorch', 'Django', 'SentenceTransformers', 'FAISS', 'transformers', 'statsmodels', 'MLflow', 'Cohere'],
    topics: ['reranking', 'retrieval', 'prediction-markets', 'self-supervised', 'leakage-safe'],
    link: 'https://github.com/Zwc-11/Chaoswing',
    liveUrl: null,
    image: '/projects/chaoswing-live.png',
    visual: 'graph',
  },
  {
    id: 'quant-portfolio',
    name: 'Quant Portfolio',
    subtitle: 'Monte Carlo + CAPM + MPT Allocator',
    tagline: 'Build a repeatable allocation from a contest ticker set',
    role: 'Waterloo CS & Finance final - team build',
    year: '2024',
    description:
      'A stock-portfolio construction notebook for the University of Waterloo CS & Finance final: it combines Monte Carlo simulation, the Capital Asset Pricing Model, and Modern Portfolio Theory to evaluate and size an equally weighted basket from a competition ticker set.',
    overview:
      'The competition releases the ticker set after the contest to prevent teams from hand-picking stocks in advance. The TA then chooses 12 stocks from the program output and tracks them for a week to compute average return rate. The notebook retrieves market data, runs Monte Carlo simulations over CAPM expected returns and Modern Portfolio Theory risk, scores each stock on volatility and risk-return factors, equally weights selected stocks, computes share counts with currency conversion and trading costs, and exports a CSV for the simulated portfolio.',
    challenge:
      'Because the tickers are unknown until after the contest, the strategy has to be a repeatable process that can run on an arbitrary basket rather than a hand-picked list.',
    approach:
      'The notebook pulls market data, runs Monte Carlo simulations over CAPM expected returns and MPT risk, scores candidates on volatility and risk-return factors, equally weights selected stocks, and sizes shares against currency conversion and per-trade costs.',
    outcome:
      'The program outputs selected stocks and share counts as a CSV for the TA-tracked simulated portfolio. The linked repo is a compact legacy notebook project with the Colab notebook, Tickers.xls, and the strategy write-up.',
    highlights: [
      'Monte Carlo simulation',
      'CAPM expected returns',
      'Modern Portfolio Theory weighting',
      'FX + trading-cost share sizing',
      'CSV portfolio export',
    ],
    features: [
      'Retrieves market data for an arbitrary contest-supplied ticker set.',
      'Monte Carlo simulation over CAPM expected returns and MPT risk.',
      'Volatility and risk-return scoring per stock.',
      'Equal-weight allocation to diversify selected holdings.',
      'Share sizing with currency conversion and trading costs.',
      'CSV export for the TA-tracked simulated portfolio.',
    ],
    metrics: [
      { label: 'Tracked stocks', value: '12' },
      { label: 'Tracking window', value: '1 week' },
      { label: 'Weighting', value: 'Equal' },
      { label: 'Format', value: 'Jupyter' },
    ],
    commands: [],
    screenshots: [
      { src: '/projects/quant-repo.png', caption: 'The project repository - a Colab notebook, Tickers.xls, and the strategy write-up.' },
    ],
    languages: [
      { name: 'Jupyter Notebook', bytes: 36127 },
    ],
    repoMeta: { license: 'No license', branch: 'main', updated: 'Dec 2024', primaryLanguage: 'Jupyter Notebook' },
    tech: ['Python', 'Jupyter', 'NumPy', 'pandas', 'Monte Carlo', 'CAPM', 'MPT'],
    topics: ['quantitative-finance', 'portfolio-optimization', 'monte-carlo', 'capm', 'mpt'],
    link: 'https://github.com/Zwc-11/Quantitative-Portfolio-Management-Strategy',
    liveUrl: null,
    image: '/projects/quant-repo.png',
    visual: 'flow',
  },
];
