export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = Task['status'];
export type TaskPriority = Task['priority'];
