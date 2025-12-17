export type Message = {
  id: string;
  from: string;
  text: string;
  createdAt: string;
};

export type Room = {
  id: string;
  name: string;
  members: string[];
  lastMessage?: Message;
  messages?: Message[];
  notes?: { id: string; title: string; content: string }[];
  whiteboards?: { id: string; title: string }[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  bio?: string;
};

export const currentUser: User = {
  id: 'u1',
  name: 'Olude Fiyinfoluwa',
  email: 'oludefiyinfoluwa@gmail.com',
  bio: 'Computer science student who loves collaborative studying',
};

const now = () => new Date().toISOString();

export const rooms: Room[] = [
  {
    id: 'w1',
    name: 'Calculus Study Group',
    members: ['Olude Fiyinfoluwa', 'Jon', 'Priya'],
    lastMessage: { id: 'm3', from: 'Jon', text: 'Let’s meet at 7pm', createdAt: now() },
    messages: [
      { id: 'm1', from: 'Olude Fiyinfoluwa', text: 'Welcome to Calculus!', createdAt: now() },
      { id: 'm2', from: 'Priya', text: 'Thanks — excited to learn', createdAt: now() },
    ],
    notes: [
      { id: 'n1', title: 'Limits recap', content: 'Key theorems and examples' },
    ],
    whiteboards: [{ id: 'w1', title: 'Integration examples' }],
  },
  {
    id: 'r2',
    name: 'Physics 201',
    members: ['Olude Fiyinfoluwa', 'Leo', 'Sara'],
    lastMessage: { id: 'm5', from: 'Sara', text: 'Shared the notes', createdAt: now() },
    messages: [
      { id: 'm4', from: 'Leo', text: 'Who has the lab report?', createdAt: now() },
    ],
    notes: [
      { id: 'n2', title: 'Lab 4 summary', content: 'Measurements and errors' },
    ],
    whiteboards: [{ id: 'w2', title: 'Forces diagram' }],
  },
];

export default { currentUser, rooms };
