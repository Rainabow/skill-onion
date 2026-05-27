/**
 * The Skill Onion — Layer Data
 *
 * layers는 바깥 껍질(index 0)에서 안쪽 코어(index N-1) 순서로 정렬.
 * OnionVisualization에서 index === radius 계산의 기준이 됨.
 */
export const skillLayers = [
  {
    id: 0,
    category: 'Soft Skills',
    keywords: ['Communication', 'Empathy', 'Collaboration', 'Growth Mindset'],
    color: '#8B4A1A',
    emissiveColor: '#A0441A',
  },
  {
    id: 1,
    category: 'Product Thinking',
    keywords: ['Problem Solver', 'Detail-Oriented', 'Perpetually Curious'],
    color: '#D8EAA0',
    emissiveColor: '#B8D460',
  },
  {
    id: 2,
    category: 'Visual Design',
    keywords: ['Typography', 'Colour Systems', 'Layout', 'Brand Consistency'],
    color: '#E6F0BE',
    emissiveColor: '#C8DC70',
  },
  {
    id: 3,
    category: 'Design System',
    keywords: ['Component Library', 'Design Tokens', 'Storybook', 'Documentation'],
    color: '#E2D8C8',
    emissiveColor: '#3A2810',
  },
  {
    id: 4,
    category: 'AI-Enhanced Workflow',
    keywords: ['Prompt Engineering', 'AI-assisted Design', 'LLM Integration'],
    color: '#E8DDD0',
    emissiveColor: '#3A2810',
  },
  {
    id: 5,
    category: 'UX Research',
    keywords: ['User Interviews', 'Usability Testing', 'Prototyping', 'User Flows', 'Journey Mapping'],
    color: '#ECDDCE',
    emissiveColor: '#3A2810',
  },
  {
    id: 6,
    category: 'Accessibility',
    keywords: ['WCAG', 'Inclusive Design', 'Colour Contrast', 'Keyboard Navigation'],
    color: '#EEE0D2',
    emissiveColor: '#3A2810',
  },
  {
    id: 7,
    category: 'UX Strategy',
    keywords: ['Competitive Analysis', 'Data-Driven', 'Stakeholder Alignment'],
    color: '#F2E8DE',
    emissiveColor: '#3A2810',
  },
];
