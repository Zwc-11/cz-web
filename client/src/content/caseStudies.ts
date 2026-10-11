export type CaseStudy = {
  ownership: string
  focus: string
  overview: string
  contribution: string
  decision: string
  evidence: string
  scope: string
  architecture: { name: string; detail: string }[]
  decisions: { title: string; detail: string }[]
  capabilities: string[]
}

// Contributions come from the personal project archive. Team submissions describe
// the shared system; they do not assign unverified individual ownership.
// Evidence and prototype boundaries were checked against public repositories.
export const caseStudies: Record<string, CaseStudy> = {
  agentreplay: {
    ownership: 'Personal project', focus: 'Full-stack systems · Developer tooling',
    overview: 'Find the first wrong turn in a browser-agent run.',
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
    capabilities: ['Event sourcing','API design','State reconstruction','Failure analysis'],
  },
  hindsight: {
    ownership: 'Personal project', focus: 'Data systems · Evaluation infrastructure',
    overview: 'A good backtest should survive a check for future information.',
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
    capabilities: ['Data contracts','Reproducible pipelines','Temporal validation','Package design'],
  },
  takeone: {
    ownership: 'Team project · Ryan Qin, Basil Liu & me', focus: 'AI agents · Systems integration',
    overview: 'An AI director that turns a spoken scene into a validated plan a robot rig can film.',
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
    capabilities: ['Structured LLM outputs','Interface contracts','Simulation & validation','Hardware integration'],
  },
  murmur: {
    ownership: 'Personal project', focus: 'Agent infrastructure · Reliability engineering',
    overview: 'One successful agent run is not a reliability claim.',
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
    capabilities: ['Ports & adapters','Contract validation','Observability','CI quality gates'],
  },
  marketimmune: {
    ownership: 'Personal project', focus: 'Full-stack research · Auditable agents',
    overview: 'Give a market-risk decision a trace you can inspect.',
    contribution: 'I built a six-agent investigation loop, a React / Django research dashboard and an append-only decision trail. The data path connects exchange fills, markout labels and model evaluation.',
    decision: 'Keep detection, investigation and policy separate. Every decision should retain the evidence that led to it.',
    evidence: 'The repository exposes structured agent traces, audit records and a documented local SOL CatBoost evaluation. The screenshots show the actual research interface.',
    scope: 'Research prototype. It sends no real orders. Some dashboard views use labeled fixtures; the SOL evaluation is a local panel proof, not a broad production benchmark.',
    architecture: [{name:'Observe',detail:'Exchange fills + markout labels'},{name:'Detect',detail:'Risk signals + model scores'},{name:'Investigate',detail:'Agent case + policy decision'},{name:'Remember',detail:'Append-only audit + dashboard'}],
    decisions: [
      {title:'Separate a signal from a decision',detail:'Model scores enter a structured case. The policy layer can flag, monitor or withhold rather than treating every anomaly as an automatic action.'},
      {title:'Preserve decision history',detail:'Append-only records make the chain from observation to policy inspectable in the dashboard.'},
      {title:'Evaluate in time order',detail:'Purged and embargoed walk-forward splits reduce leakage between related fills and labels. Prototype fixtures remain separate from real-data evidence.'},
    ],
    capabilities: ['Agent orchestration','Data ingestion','Audit design','Research interfaces'],
  },
  chaoswing: {
    ownership: 'Personal project', focus: 'Search systems · Machine learning',
    overview: 'Retrieve related prediction markets, then rank the useful ones.',
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
    capabilities: ['Retrieval & ranking','Model evaluation','Temporal data splits','API delivery'],
  },
  'quant-portfolio': {
    ownership: 'Course competition project', focus: 'Financial modelling · Data engineering',
    overview: 'Turn a ticker list and risk preference into an allocation.',
    contribution: 'I built a repeatable Python pipeline that loads market data, estimates risk and return, samples portfolios and exports allocations with share counts.',
    decision: 'Carry currency, fees and allocation constraints into the output instead of stopping at an idealized weight vector.',
    evidence: '1st place in Waterloo’s CS & Finance quantitative portfolio management competition, November 2024. The notebook and strategy write-up are public.',
    scope: 'A course competition strategy. Allocations depend on the model assumptions and historical data used in the notebook.',
    architecture: [{name:'Load',detail:'Tickers + historical prices'},{name:'Estimate',detail:'CAPM + covariance'},{name:'Optimize',detail:'Monte Carlo + portfolio risk'},{name:'Allocate',detail:'Weights → shares + CSV'}],
    decisions: [{title:'Make allocations usable',detail:'Share counts, currency conversion and fees connect the portfolio model to a concrete output.'},{title:'Keep the pipeline repeatable',detail:'A notebook and exported allocations make the strategy assumptions and resulting portfolio inspectable.'}],
    capabilities: ['Python pipelines','Financial modelling','Constraint handling','Clear outputs'],
  },
  autodump: {
    ownership: 'Hackathon team project', focus: 'Computer vision · Autonomy software',
    overview: 'Vision-guided autonomy: find a full bin, dock and empty it without a driver.',
    contribution: 'Our team wrote the perception-to-action pipeline: Raspberry Pi vision with ArUco markers locates the target, ultrasonic range data guides the approach, and microcontroller control code drives docking and dumping.',
    decision: 'Give perception and actuation separate jobs: vision locates the target, sensors support approach, and the controller drives the mechanism.',
    evidence: '3rd Place Overall at MakeCU 2025. The submission includes hardware photos and the team’s source repository.',
    scope: 'A hackathon prototype. The submission establishes the team build; it does not verify autonomous operation in arbitrary environments.',
    architecture: [{name:'Locate',detail:'Camera + ArUco markers'},{name:'Approach',detail:'Range sensing + navigation'},{name:'Dock',detail:'Motor control'},{name:'Empty',detail:'Dumping mechanism'}],
    decisions: [{title:'Connect sensing to a physical outcome',detail:'The integration challenge was completing the sequence from locating a target to operating the dumping mechanism.'}],
    capabilities: ['Perception pipeline','Embedded control software','System integration'],
  },
  jamhacks8: {
    ownership: 'Hackathon team project', focus: 'Embedded software · Configurable systems',
    overview: 'Sensor-driven control software that adapts watering to each plant.',
    contribution: 'Our team built a modular watering prototype with Arduino, C++ and integrated sensors, allowing the setup to adapt to different plants.',
    decision: 'Make configuration part of the system instead of assuming every plant needs the same watering routine.',
    evidence: 'Best Hardware Award at JamHacks 8. The original demonstration and award videos are linked.',
    scope: 'The videos document the hackathon prototype and its configurable setup.',
    architecture: [{name:'Configure',detail:'Plant-specific setup'},{name:'Sense',detail:'Sensor readings'},{name:'Control',detail:'Arduino + C++'},{name:'Water',detail:'Watering mechanism'}],
    decisions: [{title:'Build for different configurations',detail:'Modularity makes the prototype about adapting a system to its user, as well as driving a pump.'}],
    capabilities: ['Embedded C++','Sensor integration','Configurable products'],
  },
  'baymax-bot': {
    ownership: 'Hackathon team project', focus: 'Applied AI · Full-stack integration',
    overview: 'A voice-and-vision AI assistant, running on a companion device.',
    contribution: 'Our team connected a Raspberry Pi prototype, voice interaction and a React / Flask application to LLM, vision and authentication services.',
    decision: 'Connect the physical interaction to an application layer, so the interface extends beyond a single hardware demonstration.',
    evidence: 'Submitted at UofTHacks 12. The project story and photos document the shell, electronics and software stack.',
    scope: 'A hackathon companion-interface prototype. The photos and project story document the submitted hardware and application.',
    architecture: [{name:'Interact',detail:'Voice + camera input'},{name:'Process',detail:'Python + vision services'},{name:'Connect',detail:'Flask application layer'},{name:'Present',detail:'React companion app'}],
    decisions: [{title:'Integrate across hardware and web',detail:'The build joins device input, service logic and a user-facing application rather than demonstrating each piece separately.'}],
    capabilities: ['LLM integration','Vision services','Full-stack apps'],
  },
  xrsze: {
    ownership: 'Hackathon team project', focus: 'Computer vision · LLM integration',
    overview: 'Count exercise repetitions through an ordinary camera.',
    contribution: 'Our team built a MediaPipe pose-tracking interface with a calibrated repetition counter, then connected it to a Groq-powered workout and meal-planning chat.',
    decision: 'Use pose measurements for counting and a separate conversational layer for coaching.',
    evidence: 'The Hack the North 2024 submission includes a pose-tracking demonstration, app screenshots and source code.',
    scope: 'A hackathon fitness prototype. Camera position and calibration affect counting; screenshots document the submitted version.',
    architecture: [{name:'Capture',detail:'Browser camera'},{name:'Track',detail:'MediaPipe pose landmarks'},{name:'Count',detail:'Calibrated rep logic'},{name:'Coach',detail:'Groq-powered chat'}],
    decisions: [{title:'Separate measurement from conversation',detail:'Pose tracking drives the repetition count. The chat layer supports planning without becoming the counting mechanism.'}],
    capabilities: ['Realtime computer vision','Pose tracking','LLM integration'],
  },
}

// AI and agent infrastructure first; hardware builds are framed as applied AI.
export const selectedProjectIds = ['agentreplay', 'murmur', 'takeone']
export const projectOrder = [...selectedProjectIds, 'hindsight', 'marketimmune', 'chaoswing', 'quant-portfolio', 'xrsze', 'baymax-bot', 'autodump', 'jamhacks8']
