/**
 * The Skill Onion — Layer Data
 *
 * layers는 바깥 껍질(index 0)에서 안쪽 코어(index N-1) 순서로 정렬.
 * OnionVisualization에서 index === radius 계산의 기준이 됨.
 */
export const skillLayers = [
  {
    id: 0,
    category: 'UI / UX Design',
    keywords: ['Figma', 'Wireframing', 'Prototyping', 'User Flows'],
    color: '#8B4A1A',
    emissiveColor: '#A0441A',
  },
  {
    id: 1,
    category: 'Visual Design',
    keywords: ['Typography', 'Colour Systems', 'Layout', 'Brand Identity'],
    color: '#D8EAA0',
    emissiveColor: '#B8D460',
  },
  {
    id: 2,
    category: 'Design System',
    keywords: ['Component Library', 'Design Tokens', 'Storybook', 'Documentation'],
    color: '#E6F0BE',
    emissiveColor: '#C8DC70',
  },
  {
    id: 3,
    category: 'Frontend',
    keywords: ['React', 'MUI', 'CSS Animation', 'Responsive Design'],
    color: '#D8CBBA',
    emissiveColor: '#3A2810',
  },
  {
    id: 4,
    category: 'Motion & Interaction',
    keywords: ['Framer Motion', 'Micro-interaction', 'Transition Design', 'Easing'],
    color: '#E2D8C8',
    emissiveColor: '#3A2810',
  },
  {
    id: 5,
    category: 'Research & Strategy',
    keywords: ['User Research', 'Heuristics', 'Information Architecture', 'Testing'],
    color: '#E8DDD0',
    emissiveColor: '#3A2810',
  },
  {
    id: 6,
    category: 'Collaboration',
    keywords: ['Agile', 'Design Handoff', 'Notion', 'Stakeholder Communication'],
    color: '#ECDDCE',
    emissiveColor: '#3A2810',
  },
  {
    id: 7,
    category: 'Core Identity',
    keywords: ['Problem Solver', 'Detail-Oriented', 'Perpetually Curious', 'Empathetic'],
    color: '#EEE0D2',
    emissiveColor: '#3A2810',
  },
];
