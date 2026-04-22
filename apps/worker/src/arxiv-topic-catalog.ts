export type ArxivTopic = {
  code: string;
  label: string;
  keywords: string[];
};

export const ARXIV_TOPIC_CATALOG: ArxivTopic[] = [
  { code: "cs.AI", label: "Artificial Intelligence", keywords: ["ai", "artificial intelligence", "planning"] },
  { code: "cs.CL", label: "Computation and Language", keywords: ["nlp", "language", "linguistics"] },
  { code: "cs.CV", label: "Computer Vision", keywords: ["vision", "image", "video"] },
  { code: "cs.LG", label: "Machine Learning", keywords: ["machine learning", "learning", "ml"] },
  { code: "cs.RO", label: "Robotics", keywords: ["robotics", "robot", "manipulation"] },
  { code: "cs.IR", label: "Information Retrieval", keywords: ["retrieval", "search", "ranking"] },
  { code: "cs.CR", label: "Cryptography and Security", keywords: ["security", "privacy", "cryptography"] },
  { code: "cs.DB", label: "Databases", keywords: ["database", "query", "data management"] },
  { code: "cs.DC", label: "Distributed and Cluster Computing", keywords: ["distributed", "cluster", "parallel"] },
  { code: "cs.HC", label: "Human-Computer Interaction", keywords: ["hci", "interface", "user study"] },
  { code: "cs.SD", label: "Sound", keywords: ["audio", "speech", "sound"] },
  { code: "cs.SE", label: "Software Engineering", keywords: ["software engineering", "testing", "program analysis"] },
  { code: "cs.NI", label: "Networking and Internet Architecture", keywords: ["network", "internet", "routing"] },
  { code: "cs.CY", label: "Computers and Society", keywords: ["society", "ethics", "policy"] },
  { code: "cs.ET", label: "Emerging Technologies", keywords: ["emerging", "novel hardware", "prototype"] },
  { code: "cs.DS", label: "Data Structures and Algorithms", keywords: ["algorithms", "data structures", "complexity"] },
  { code: "cs.CC", label: "Computational Complexity", keywords: ["complexity", "hardness", "lower bounds"] },
  { code: "cs.CE", label: "Computational Engineering, Finance, and Science", keywords: ["engineering", "simulation", "scientific computing"] },
  { code: "cs.CG", label: "Computational Geometry", keywords: ["geometry", "geometric", "spatial"] },
  { code: "cs.GT", label: "Computer Science and Game Theory", keywords: ["game theory", "mechanism design", "equilibrium"] },
  { code: "cs.LO", label: "Logic in Computer Science", keywords: ["logic", "formal methods", "proof"] },
  { code: "cs.MM", label: "Multimedia", keywords: ["multimedia", "cross-modal", "multimodal"] },
  { code: "cs.MA", label: "Multiagent Systems", keywords: ["multiagent", "agents", "coordination"] },
  { code: "cs.NE", label: "Neural and Evolutionary Computing", keywords: ["neural", "evolutionary", "neuroevolution"] },
  { code: "cs.PL", label: "Programming Languages", keywords: ["programming languages", "compiler", "type system"] },
  { code: "cs.SI", label: "Social and Information Networks", keywords: ["social network", "graph", "network analysis"] },
  { code: "cs.SY", label: "Systems and Control", keywords: ["systems", "control", "dynamical"] },
  { code: "eess.AS", label: "Audio and Speech Processing", keywords: ["asr", "speech recognition", "speech synthesis"] },
  { code: "stat.ML", label: "Statistics Machine Learning", keywords: ["statistics", "statistical learning", "inference"] },
  { code: "math.OC", label: "Optimization and Control", keywords: ["optimization", "control", "solver"] },
  { code: "q-fin.ST", label: "Statistical Finance", keywords: ["finance", "trading", "market"] },
  { code: "q-bio.QM", label: "Quantitative Methods", keywords: ["biomedical", "clinical", "healthcare"] }
];

export function codeToSlug(code: string) {
  return code.toLowerCase().replace(/\./g, "-");
}
