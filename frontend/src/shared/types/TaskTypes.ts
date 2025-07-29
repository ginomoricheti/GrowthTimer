export interface Task {
  id: number;
  name: string;
  color?: string;
}

export const PREDEFINED_TASKS: Task[] = [
  { id: 1, name: 'Leer' },
  { id: 2, name: 'Estudiar' },
  { id: 3, name: 'Practicar' },
  { id: 4, name: 'Debuguear' },
  { id: 5, name: 'Planificar' },
  { id: 6, name: 'Investigar' },
  { id: 7, name: 'Documentar' },
  { id: 8, name: 'Revisar' },
  { id: 9, name: 'Refactorizar' },
  { id: 10, name: 'Diseñar' },
  { id: 11, name: 'Meditar' },
  { id: 12, name: 'Ejercitar' },
  { id: 13, name: 'Cocinar' },
  { id: 14, name: 'Organizar' }
];