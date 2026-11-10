// Security / strictness layer for ProjectLink (stronger programming)
// Enforces strict typing, input sanitization, and no implicit any.
export type StrictProject = Readonly<{
  id: number;
  title: string;
  description: string;
  image: string;
  age: string;
  interest: 'web' | 'mobile' | 'design' | 'research' | 'ai';
  role: 'developer' | 'designer' | 'smm' | 'researcher';
  status: 'Open' | 'Urgent';
  owner: string;
  ownerInitials: string;
  ownerAvatar: string;
  postedDate: string;
  applications: number;
  tags: readonly string[];
  requirements: readonly string[];
  deadline: string;
}>;

export const sanitize = (s: string): string => {
  if (typeof s !== 'string') return '';
  return s.replace(/[<>"'&]/g, '').trim().slice(0, 500);
};

export const isValidEmail = (e: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitize(e));
};
