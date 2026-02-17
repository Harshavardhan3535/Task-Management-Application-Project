import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TaskStatus = Task['status'];
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  private selectedDateSubject = new BehaviorSubject<string | null>(null);
  selectedDate$ = this.selectedDateSubject.asObservable();
  
  filterByDate(date: string | null) {
    this.selectedDateSubject.next(date);
  }

  constructor(private http: HttpClient) {}

  /** Load tasks ONCE */
  loadTasks() {
    return this.http.get<{ tasks: Task[] }>(this.apiUrl).pipe(
      tap(res => {
        const normalized = res.tasks.map(task => ({
          ...task,
          status: task.status.toLowerCase() as TaskStatus,
          priority: task.priority.toLowerCase() as Task['priority']
        }));
        this.tasksSubject.next(normalized);
      })
    );
  }

  addTask(task: Omit<Task, '_id'>) {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap((savedTask) => {
        const current = this.tasksSubject.value;
        this.tasksSubject.next([...current, savedTask]);
      })
    );
  }

  updateTask(id: string, updates: Partial<Task>) {
    const updated = this.tasksSubject.value.map(t =>
      t._id === id ? { ...t, ...updates } : t
    );
    this.tasksSubject.next(updated);

    return this.http.put(`${this.apiUrl}/${id}`, updates).subscribe();
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    this.updateTask(id, { status });
  }

  deleteTask(id: string) {
    this.tasksSubject.next(
      this.tasksSubject.value.filter(t => t._id !== id)
    );

    return this.http.delete(`${this.apiUrl}/${id}`).subscribe();
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    
    const today = new Date();
    const due = new Date(task.dueDate);
    
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    
    return due < today && task.status !== 'completed';
  }
}
