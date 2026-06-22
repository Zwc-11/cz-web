export const projects = [
  {
    id: 'murmur',
    name: 'Murmur',
    subtitle: 'Agent Workflow and Reliability Harness',
    description:
      'Open-source agent workflow harness for testing, ranking, tracing, and replaying coding-agent attempts.',
    highlights: [
      '29 test modules',
      '30-attempt fan-out runs',
      'pass@1 / pass@k reliability reports',
      'GitHub Actions checks',
      'record/replay artifacts',
    ],
    tech: ['Python', 'JavaScript', 'Node.js', 'GitHub Actions', 'Postgres', 'Ollama', 'DeepSeek'],
    link: 'https://github.com/Zwc-11/Murmur-ai-harness',
    image: 'https://github-readme-stats.vercel.app/api/pin/?username=Zwc-11&repo=Murmur-ai-harness&bg_color=00000000&hide_border=true&show_owner=true&title_color=22d3ee&icon_color=22d3ee&text_color=adbac7',
    visual: 'trace',
  },
  {
    id: 'marketimmune',
    name: 'MarketImmune',
    subtitle: 'Toxic-Flow Detection for On-Chain Perpetuals',
    description:
      'Full-stack ML platform for detecting adverse selection and toxic order flow in perpetual-swap markets.',
    highlights: [
      'Hyperliquid market data',
      'CatBoost risk model',
      '0.769 PR-AUC',
      '0.758 ROC-AUC',
      '15 bps out-of-sample markout lift',
    ],
    tech: ['Python', 'Node.js', 'Express', 'JavaScript', 'React', 'CatBoost', 'MLflow', 'DuckDB', 'WebSocket APIs'],
    link: 'https://github.com/Zwc-11/marketimmune-benchmark',
    image: 'https://github-readme-stats.vercel.app/api/pin/?username=Zwc-11&repo=marketimmune-benchmark&bg_color=00000000&hide_border=true&show_owner=true&title_color=22d3ee&icon_color=22d3ee&text_color=adbac7',
    visual: 'flow',
  },
  {
    id: 'chaoswing',
    name: 'ChaosWing',
    subtitle: 'Prediction-Market Reranking System',
    description:
      'Prediction-market retrieval and reranking system using temporal labels, lead-lag signals, and leakage-safe ranking evaluation.',
    highlights: [
      'top-100 candidate retrieval',
      'cross-encoder reranking',
      '0-3 graded relevance labels',
      'NDCG@5, MRR, Recall@100',
      'strict temporal split',
    ],
    tech: ['Python', 'DuckDB', 'CatBoost', 'Cytoscape.js'],
    link: 'https://github.com/Zwc-11/Chaoswing',
    image: 'https://github-readme-stats.vercel.app/api/pin/?username=Zwc-11&repo=Chaoswing&bg_color=00000000&hide_border=true&show_owner=true&title_color=22d3ee&icon_color=22d3ee&text_color=adbac7',
    visual: 'graph',
  },
];
