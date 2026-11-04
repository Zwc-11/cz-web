export type CaseStudy = {
  ownership: string
  overview: string
  contribution: string
  decision: string
  evidence: string
  scope: string
  architecture: { name: string; detail: string }[]
  decisions: { title: string; detail: string }[]
}

// Contributions come from the personal project archive. Team submissions describe
// the shared system; they do not assign unverified individual ownership.
// Evidence and prototype boundaries were checked against public repositories.
export const caseStudies: Record<string, CaseStudy> = {
  agentreplay: {
    ownership: 'Personal project',
    overview: 'Record, replay and diff browser agents.',
    contribution: 'I built the path from recorded browser events to a workflow graph, replay evaluation and a React Flow dashboard. The interface compares human and agent actions at the first divergence.',
    decision: 'Store events, then reconstruct state. Keep the compiler and evaluator independent of the database and UI.',
    evidence: 'The bundled workflows produce step-level comparisons, failure evidence and an exported Playwright test scaffold.',
    scope: 'Early prototype. The benchmark uses bundled shop, CRM and calendar workflows with scripted drivers. It is not a general reliability score for language models.',
    architecture: [{name:'Record',detail:'Browser events + fetch requests'},{name:'Compile',detail:'Event log → workflow graph'},{name:'Replay',detail:'Runner + step evaluator'},{name:'Inspect',detail:'React Flow + failure evidence'}],
    decisions: [
      {title:'An event log, not just a final screenshot',detail:'A final state can hide the first mistake. Reconstructing each step makes the divergence and the preceding network activity inspectable.'},
      {title:'A core that runs without infrastructure',detail:'Ports separate compilation and evaluation from storage and HTTP. I can test the reasoning about a run without a database or browser session.'},
      {title:'Useful failure states in the frontend',detail:'The dashboard pairs the workflow graph with step evidence. Bundled demo data is identified as demo data when the backend is unavailable.'},
    ],
  },
  hindsight: {
    ownership: 'Personal project',
    overview: 'A backtesting engine that checks itself for look-ahead leakage.',
    contribution: 'I extracted a standalone evaluation engine with explicit boundaries for market events, labels and stored data. I built an offline demonstration that compares an unsafe strategy with a time-audited run.',
    decision: 'Make the time boundary enforceable. Record the data, configuration and code version beside every result.',
    evidence: 'Committed audit reports and run manifests make the comparison inspectable. CI checks that repeated demo runs produce identical report artifacts.',
    scope: 'Research evaluation, not a trading service. The offline demo uses synthetic data; the repository also documents a separate BTC, ETH and SOL local-data benchmark. Execution assumptions remain simplified.',
    architecture: [{name:'Ingest',detail:'Timestamped events + data provenance'},{name:'Guard',detail:'Point-in-time access checks'},{name:'Evaluate',detail:'Purged walk-forward splits'},{name:'Report',detail:'Audit, costs + run manifest'}],
    decisions: [
      {title:'Treat time as a contract',detail:'Random splits can put related labels on both sides of an evaluation. Purged time splits and guarded feature access make that failure visible.'},
      {title:'Keep the engine independent',detail:'Separating the evaluator from MarketImmune made it usable as its own package and kept strategy logic away from storage concerns.'},
      {title:'Make a result reproducible',detail:'A run manifest records inputs and configuration. The committed unsafe control shows why a high score alone is not enough evidence.'},
    ],
  },
  takeone: {
    ownership: 'Team project · Ryan Qin, Basil Liu & me',
    overview: 'An AI director with a robot camera crew.',
    contribution: 'Our team built a voice agent that asks follow-ups through constrained function calls, an AI director that emits structured shot plans, a Python validation and compile step with a 3D rehearsal, and the control path to a camera-and-lighting rig. A React / FFmpeg editor closes the loop.',
    decision: 'Put a typed contract between the model and the motors. Validate and rehearse every shot plan in simulation before supervised physical filming.',
    evidence: 'The Hack the North submission includes the working rig, simulator images, source code and a filmed demonstration.',
    scope: 'Built with Ryan Qin and Basil Liu. Physical filming requires an operator. The simulator checks the software plan; the rig and filmed demo document the hardware build.',
    architecture: [{name:'Direct',detail:'Scene → structured shot plan'},{name:'Rehearse',detail:'Python checks + 3D preview'},{name:'Film',detail:'Cart, two arms + operator'},{name:'Edit',detail:'React timeline + FFmpeg'}],
    decisions: [
      {title:'A typed plan between intent and motion',detail:'A structured shot plan gives the simulator and hardware path the same input. Creative direction can change without bypassing validation.'},
      {title:'Rehearsal before a physical take',detail:'The 3D preview exposes camera paths and constraints before the operator commits the rig to filming.'},
      {title:'Build the whole production loop',detail:'The project includes the editing step. A filmed result matters more than a standalone robot movement.'},
    ],
  },
  daycube: {
    ownership: 'Personal project · in progress',
    overview: 'Replay your day as a voxel world you can question.',
    contribution: 'I am building a local-first memory system. Each place from a day becomes a small voxel diorama in a React Three Fiber viewer, and a character walks the route through it: around furniture, up stairs between floors, with the floor above cut away. Underneath, a FastAPI service keeps a validated local vault. A browser extension, a webcam gaze tracker and a capture receiver record what was read and where the eyes dwelled, and one SQLite database indexes every day for keyword and meaning search with a knowledge graph.',
    decision: 'Contracts first, answers with receipts. Eight JSON Schemas generate the Pydantic and TypeScript models, and every answer quotes the records it came from instead of generating unsupported prose.',
    evidence: 'The repository has a 19-second demo, Python, contract and real-browser tests in CI, a retrieval evaluation comparing keyword, vector and combined search, and a head-aware gaze model benchmarked on MPIIFaceGaze (43 mm median error against 78 mm for EyeTrax on held-out days).',
    scope: 'Work in progress, started October 2026. The sample day, venues and indoor walks are fictional and labeled illustrative in the app. Native window capture, OCR, floor inference, generated answers and scene reconstruction are future milestones; the evaluation still uses synthetic questions.',
    architecture: [{name:'Capture',detail:'Browser extension + webcam gaze'},{name:'Vault',detail:'Validated local JSON + one SQLite DB'},{name:'Search',detail:'FTS5 + bge-small vectors, rank fusion'},{name:'Replay',detail:'Voxel dioramas + cited answers'}],
    decisions: [
      {title:'Local first, with a token on writes',detail:'Personal records stay in a vault on the machine. The API binds to loopback, and mutations need a token held only in page memory.'},
      {title:'Two kinds of search, one ranking',detail:'Keyword search catches exact names and course codes; int8 bge-small vectors catch paraphrases. Results merge by rank, and an evaluation script compares each mode on the sample day.'},
      {title:'Label what is illustrative',detail:'Unknown coordinates stay null. When a visit has no measured indoor positions, the walk between desk, stairs and door is drawn but marked illustrative rather than presented as a trajectory.'},
    ],
  },
  sproutpass: {
    ownership: 'Team project · Freja R, Yujing Wei & me',
    overview: 'AI companions that pass outgrown baby clothes to nearby families.',
    contribution: 'Our team built a Base44-hosted React / TypeScript web app and an iMessage companion through Photon. Parents add clothing by photo; an LLM suggests garment details and extracts explicitly stated sizes, categories and budgets from messages, and the parent confirms them. A nearby-encounter flow checks shared listings against confirmed needs, presents the offer, and on buyer approval records the ownership change and a simulated Visa receipt.',
    decision: 'Let the model interpret and the rules decide. AI drafts garment details and needs; backend functions validate matches, approvals and ownership updates.',
    evidence: 'Won the Visa challenge and placed runner-up in Photon’s iMessage track at the LA Hacks AI Hackathon 2026. The submission includes a demo video, the source repository and screenshots of the offline demo flow.',
    scope: 'Built with Freja R and Yujing Wei; implementation started at midnight after two earlier ideas were dropped. Payments are simulated: no Visa API, real charge or funds transfer. Locations and family profiles are demo data, rack-level positioning and production access controls are future work, and the product has not yet been tested with parents.',
    architecture: [{name:'Intake',detail:'Photo or iMessage → LLM draft + confirm'},{name:'Match',detail:'Needs × listings: size, category, budget'},{name:'Approve',detail:'Buyer-only final decision'},{name:'Record',detail:'Ownership update + simulated receipt'}],
    decisions: [
      {title:'Confirm what the model cannot know',detail:'Photo analysis suggests garment details, but uncertain fields go back to the parent. Needs use explicitly stated sizes and budgets rather than inferring a size from a baby’s age.'},
      {title:'One approval, on the buyer’s side',detail:'Sharing a listing already authorizes the seller. A second seller approval only added friction, so the buyer makes the final decision that triggers the payment flow.'},
      {title:'Verify delivery, not the interface',detail:'A message accepted for sending is not proof that it arrived. The demo separates submission status from delivery and checks the physical phone before claiming a receipt reached it.'},
    ],
  },
  murmur: {
    ownership: 'Personal project',
    overview: 'A reliability harness for agents, replayable in CI.',
    contribution: 'I designed a contract-first harness with separate agent, tool and environment interfaces. It runs independent attempts, validates outputs and generates a report with failure classes and trace evidence.',
    decision: 'Validate every attempt against a task contract. Use repeated trials and statistical checks before calling a change a regression.',
    evidence: 'The public repository includes generated reliability reports, a trace viewer and an offline deterministic workflow that CI can exercise without API keys.',
    scope: 'The public coding-agent harness is the evidence shown here. The archived screenshots use synthetic deterministic runs; they do not establish a production model success rate.',
    architecture: [{name:'Contract',detail:'Task requirements + tool policy'},{name:'Attempt',detail:'Independent isolated runs'},{name:'Validate',detail:'Checks + stable failure classes'},{name:'Prove',detail:'Reports, traces + CI gate'}],
    decisions: [
      {title:'Validate artifacts before scoring them',detail:'A fluent explanation does not prove that the code meets the task. Task-specific checks define success before the agent starts.'},
      {title:'Separate the harness from the model',detail:'An agent port lets different implementations use the same contracts, tools and validation path.'},
      {title:'Keep the feedback actionable',detail:'Failure classes and recorded tool paths connect a summary score to the attempt that produced it. The offline suite makes the reporting path reproducible.'},
    ],
  },
  marketimmune: {
    ownership: 'Personal project',
    overview: 'Predicts which Hyperliquid fills a market maker will regret 10 seconds later.',
    contribution: 'I built the path from raw exchange data to verdicts: a Rust rebuild of the Hyperliquid L4 order book, Parquet tables with point-in-time features, CatBoost regret models, a block-accurate maker simulator, and a live React terminal that labels every SOL fill with its 10 s markout.',
    decision: 'Commit the rules before the data. Every claim is pre-registered, each day is scored by a model trained only on the days before it, and nulls are reported next to the claims.',
    evidence: 'On 60 pre-registered days and 31.8M BTC, ETH and SOL fills (Sep to Oct 2026), the Binance price gap and the taker’s wallet score improved Brier in every coin, from 0.212–0.223 to 0.182–0.192 (14–16% lower). The claim that priority fees add information was rejected in all three. In the simulator, the model’s pull timing beats a time-shifted placebo by 0.44–0.54 bps per filled dollar.',
    scope: 'Research system: it sends no orders and holds no keys. No maker strategy is profitable after the 1.5 bp maker fee at any Hyperliquid fee tier; the signal’s timing is worth about half a basis point. The terminal streams live data and labels fills; it scores them only when an exported model is present. A January 2027 confirmation is pre-registered.',
    architecture: [{name:'Ingest',detail:'L4 archive, node fills, Binance trades'},{name:'Rebuild',detail:'Rust order book, 10 s labels, as-of features'},{name:'Test',detail:'Walk-forward ladder, block simulator'},{name:'Watch',detail:'Live terminal, regret clock'}],
    decisions: [
      {title:'Pre-register, then look',detail:'The A1 rules were committed before any model saw a 2026 date, and the run script refuses to train if that file changed. Claims need both registered metrics, Holm-corrected, with placebos.'},
      {title:'Score forward only',detail:'Each day is scored by a model trained on the 7 days before it, minus a 60 s purge. Every feature joins the book strictly before the fill, and each partition carries a no-look-ahead check.'},
      {title:'Test the money, not just the metric',detail:'The simulator replays the book block by block with our quotes in the queue, HyperCore’s in-block order, latency and fees. It matches hftbacktest to 0.1 bps on 31 of 31 days.'},
      {title:'Make iteration cheap',detail:'A NumPy index-array rewrite took threshold selection from 39.6 s to 0.61 s and a full training run from 200 s to 99 s, with every metric identical to 2e-13.'},
    ],
  },
  chaoswing: {
    ownership: 'Personal project',
    overview: 'Two-stage search for related prediction markets.',
    contribution: 'I built a two-stage search pipeline: a bi-encoder retrieves candidates and a fine-tuned cross-encoder reranks them. A Django application exposes the pipeline and its evaluation.',
    decision: 'Use fast retrieval for breadth and a more expensive reranker for precision. Evaluate both on the same time-safe splits.',
    evidence: 'The project compares neural, lexical and external reranking baselines using ranking quality and p95 latency.',
    scope: 'Research search system. Ranking quality measures retrieval, not investment returns. The archived image shows the API reference from that version.',
    architecture: [{name:'Query',detail:'Prediction-market question'},{name:'Retrieve',detail:'Bi-encoder candidate search'},{name:'Rerank',detail:'Cross-encoder scoring'},{name:'Evaluate',detail:'Ranking quality + latency'}],
    decisions: [
      {title:'Spend compute after narrowing the search',detail:'Retrieval selects a candidate set before the cross-encoder evaluates pairs. This makes the quality and latency tradeoff explicit.'},
      {title:'Keep near-duplicate events together',detail:'I grouped event families and split by first-seen time to reduce contamination between training and evaluation.'},
      {title:'Compare systems on one benchmark',detail:'The same temporal splits support comparisons across bi-encoders, rerankers and lexical baselines. Latency matters alongside ranking quality.'},
    ],
  },
  'quant-portfolio': {
    ownership: 'Course competition project',
    overview: 'Portfolio optimizer that outputs share counts after fees.',
    contribution: 'I built a repeatable Python pipeline that loads market data, estimates risk and return, samples portfolios and exports allocations with share counts.',
    decision: 'Carry currency, fees and allocation constraints into the output instead of stopping at an idealized weight vector.',
    evidence: '1st place in Waterloo’s CS & Finance quantitative portfolio management competition, November 2024. The notebook and strategy write-up are public.',
    scope: 'A course competition strategy. Allocations depend on the model assumptions and historical data used in the notebook.',
    architecture: [{name:'Load',detail:'Tickers + historical prices'},{name:'Estimate',detail:'CAPM + covariance'},{name:'Optimize',detail:'Monte Carlo + portfolio risk'},{name:'Allocate',detail:'Weights → shares + CSV'}],
    decisions: [{title:'Make allocations usable',detail:'Share counts, currency conversion and fees connect the portfolio model to a concrete output.'},{title:'Keep the pipeline repeatable',detail:'A notebook and exported allocations make the strategy assumptions and resulting portfolio inspectable.'}],
  },
  autodump: {
    ownership: 'Hackathon team project',
    overview: 'A trash rover that finds full bins and empties itself.',
    contribution: 'Our team wrote the perception-to-action pipeline: Raspberry Pi vision with ArUco markers locates the target, ultrasonic range data guides the approach, and microcontroller control code drives docking and dumping.',
    decision: 'Give perception and actuation separate jobs: vision locates the target, sensors support approach, and the controller drives the mechanism.',
    evidence: '3rd Place Overall at MakeCU 2025. The submission includes hardware photos and the team’s source repository.',
    scope: 'A hackathon prototype. The submission establishes the team build; it does not verify autonomous operation in arbitrary environments.',
    architecture: [{name:'Locate',detail:'Camera + ArUco markers'},{name:'Approach',detail:'Range sensing + navigation'},{name:'Dock',detail:'Motor control'},{name:'Empty',detail:'Dumping mechanism'}],
    decisions: [{title:'Connect sensing to a physical outcome',detail:'The integration challenge was completing the sequence from locating a target to operating the dumping mechanism.'}],
  },
  jamhacks8: {
    ownership: 'Hackathon team project',
    overview: 'A configurable plant-watering system.',
    contribution: 'Our team built a modular watering prototype with Arduino, C++ and integrated sensors, allowing the setup to adapt to different plants.',
    decision: 'Make configuration part of the system instead of assuming every plant needs the same watering routine.',
    evidence: 'Best Hardware Award at JamHacks 8. The original demonstration and award videos are linked.',
    scope: 'The videos document the hackathon prototype and its configurable setup.',
    architecture: [{name:'Configure',detail:'Plant-specific setup'},{name:'Sense',detail:'Sensor readings'},{name:'Control',detail:'Arduino + C++'},{name:'Water',detail:'Watering mechanism'}],
    decisions: [{title:'Build for different configurations',detail:'Modularity makes the prototype about adapting a system to its user, as well as driving a pump.'}],
  },
  'baymax-bot': {
    ownership: 'Hackathon team project',
    overview: 'A companion-care robot with voice and emotion vision.',
    contribution: 'Our team connected a Raspberry Pi prototype, voice interaction and a React / Flask application to LLM, vision and authentication services.',
    decision: 'Connect the physical interaction to an application layer, so the interface extends beyond a single hardware demonstration.',
    evidence: 'Submitted at UofTHacks 12. The project story and photos document the shell, electronics and software stack.',
    scope: 'A hackathon companion-interface prototype. The photos and project story document the submitted hardware and application.',
    architecture: [{name:'Interact',detail:'Voice + camera input'},{name:'Process',detail:'Python + vision services'},{name:'Connect',detail:'Flask application layer'},{name:'Present',detail:'React companion app'}],
    decisions: [{title:'Integrate across hardware and web',detail:'The build joins device input, service logic and a user-facing application rather than demonstrating each piece separately.'}],
  },
  xrsze: {
    ownership: 'Hackathon team project',
    overview: 'A computer-vision rep counter with an AI coach.',
    contribution: 'Our team built a MediaPipe pose-tracking interface with a calibrated repetition counter, then connected it to a Groq-powered workout and meal-planning chat.',
    decision: 'Use pose measurements for counting and a separate conversational layer for coaching.',
    evidence: 'The Hack the North 2024 submission includes a pose-tracking demonstration, app screenshots and source code.',
    scope: 'A hackathon fitness prototype. Camera position and calibration affect counting; screenshots document the submitted version.',
    architecture: [{name:'Capture',detail:'Browser camera'},{name:'Track',detail:'MediaPipe pose landmarks'},{name:'Count',detail:'Calibrated rep logic'},{name:'Coach',detail:'Groq-powered chat'}],
    decisions: [{title:'Separate measurement from conversation',detail:'Pose tracking drives the repetition count. The chat layer supports planning without becoming the counting mechanism.'}],
  },
}

// Newest first; projectCards and projectMetadata.json follow the same order.
export const projectOrder = ['marketimmune', 'daycube', 'sproutpass', 'takeone', 'hindsight', 'agentreplay', 'murmur', 'chaoswing', 'autodump', 'baymax-bot', 'quant-portfolio', 'xrsze', 'jamhacks8']
