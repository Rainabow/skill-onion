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
    color: '#3D1A08',
    emissiveColor: '#1A0800',
  },
  {
    id: 1,
    category: 'Visual Design',
    keywords: ['Typography', 'Colour Systems', 'Layout', 'Brand Identity'],
    color: '#6B3015',
    emissiveColor: '#2A1205',
  },
  {
    id: 2,
    category: 'Design System',
    keywords: ['Component Library', 'Design Tokens', 'Storybook', 'Documentation'],
    color: '#8B5A20',
    emissiveColor: '#3A2008',
  },
  {
    id: 3,
    category: 'Frontend',
    keywords: ['React', 'MUI', 'CSS Animation', 'Responsive Design'],
    color: '#5B6B1A',
    emissiveColor: '#1A2008',
  },
  {
    id: 4,
    category: 'Motion & Interaction',
    keywords: ['Framer Motion', 'Micro-interaction', 'Transition Design', 'Easing'],
    color: '#3A7B2A',
    emissiveColor: '#102808',
  },
  {
    id: 5,
    category: 'Research & Strategy',
    keywords: ['User Research', 'Heuristics', 'Information Architecture', 'Testing'],
    color: '#5A9B4A',
    emissiveColor: '#1A3018',
  },
  {
    id: 6,
    category: 'Collaboration',
    keywords: ['Agile', 'Design Handoff', 'Notion', 'Stakeholder Communication'],
    color: '#7ABB6A',
    emissiveColor: '#284028',
  },
  {
    id: 7,
    category: 'Core Identity',
    keywords: ['Problem Solver', 'Detail-Oriented', 'Perpetually Curious', 'Empathetic'],
    color: '#D8EAA0',
    emissiveColor: '#486030',
  },
];
