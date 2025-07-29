export interface Category {
  id: number;
  name: string;
  color: string;
}

export const PREDEFINED_CATEGORIES: Category[] = [
  { id: 1, name: 'Personal', color: '#10B981' },
  { id: 2, name: 'Trabajo', color: '#3B82F6' },
  { id: 3, name: 'Salud', color: '#EF4444' },
  { id: 4, name: 'Estudios', color: '#8B5CF6' },
  { id: 5, name: 'Finanzas', color: '#F59E0B' },
  { id: 6, name: 'Hogar', color: '#06B6D4' },
  { id: 7, name: 'Creatividad', color: '#EC4899' },
  { id: 8, name: 'Relaciones', color: '#84CC16' },
  { id: 9, name: 'Fitness', color: '#F97316' },
  { id: 10, name: 'Hobbies', color: '#6366F1' }
];