import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { CalendarComponent } from '../../calendar/calendar.component';
import { combineLatest } from 'rxjs';

import { TaskService, Task, TaskStatus } from '../../../services/task.service';
import { TaskDialogComponent } from '../../../shared/dialogs/task-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    CalendarComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];

  selectedDate: string | null = null;

  // 🔍 Search + Sort
  searchTerm: string = '';
  sortBy: string = 'createdAt';

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {

    combineLatest([
      this.taskService.tasks$,
      this.taskService.selectedDate$
    ]).subscribe(([tasks, date]) => {

      this.selectedDate = date;

      let filtered = [...tasks];

      // 1️⃣ Date Filter
      if (date) {
        filtered = filtered.filter(t =>
          t.dueDate?.startsWith(date)
        );
      }

      // 2️⃣ Search Filter
      if (this.searchTerm.trim()) {
        const term = this.searchTerm.toLowerCase();
        filtered = filtered.filter(t =>
          t.title.toLowerCase().includes(term) ||
          (t.description || '').toLowerCase().includes(term)
        );
      }

      // 3️⃣ Sorting
      filtered = this.sortTasks(filtered);

      // 4️⃣ Split by status
      this.todoTasks = filtered.filter(t => t.status === 'todo');
      this.inProgressTasks = filtered.filter(t => t.status === 'in-progress');
      this.completedTasks = filtered.filter(t => t.status === 'completed');
    });

    this.taskService.loadTasks().subscribe();
  }

  private sortTasks(tasks: Task[]): Task[] {

    switch (this.sortBy) {

      case 'dueDate':
        return [...tasks].sort((a, b) =>
          new Date(a.dueDate || 0).getTime() -
          new Date(b.dueDate || 0).getTime()
        );

      case 'priority':
        const priorityOrder: any = { high: 1, medium: 2, low: 3 };
        return [...tasks].sort((a, b) =>
          priorityOrder[a.priority] - priorityOrder[b.priority]
        );

      case 'createdAt':
      default:
        return [...tasks].sort((a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const newTask: Task = {
        ...result,
        status: result.status || 'todo',
        priority: result.priority || 'medium'
      };

      this.taskService.addTask(newTask).subscribe();
    });
  }

  openEditDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: { ...task, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.updateTask(task._id, result);
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus): void {
    if (event.previousContainer === event.container) return;

    const task = event.previousContainer.data[event.previousIndex];
    this.taskService.updateTaskStatus(task._id, newStatus);
  }

  deleteTask(id: string): void {
    if (!confirm('Are you sure you want to delete this task?')) return;
    this.taskService.deleteTask(id);
  }

  // 🔁 Trigger filter when search/sort changes
  triggerFilter(): void {
    this.taskService.tasks$.subscribe(); // forces recompute
  }
}
