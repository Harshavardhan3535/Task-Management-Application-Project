import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  stats = {
    total: 0,
    completed: 0,
    inProgress: 0,
    todo: 0,
    overdue: 0
  };

  upcomingTasks: Task[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private taskService: TaskService
  ) {}
  
  distribution = {
    completed: 0,
    inProgress: 0,
    todo: 0
  };

  ngOnInit(): void {
    this.taskService.loadTasks().subscribe();

    this.taskService.tasks$.subscribe((tasks: Task[]) => {
      this.calculateStats(tasks);
    });
  }

  private calculateStats(tasks: Task[]): void {
    this.stats.total = tasks.length;
    this.stats.completed = tasks.filter(t => t.status === 'completed').length;
    this.stats.inProgress = tasks.filter(t => t.status === 'in-progress').length;
    this.stats.todo = tasks.filter(t => t.status === 'todo').length;
    
    this.stats.overdue = tasks.filter(t =>
      this.taskService.isOverdue(t)
    ).length;
    
    const total = this.stats.total || 1;
    
    this.distribution.completed =
      Math.round((this.stats.completed / total) * 100);
    
    this.distribution.inProgress =
      Math.round((this.stats.inProgress / total) * 100);
      
    this.distribution.todo =
      Math.round((this.stats.todo / total) * 100);
      
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    this.upcomingTasks = tasks
      .filter(t =>
        t.dueDate &&
        new Date(t.dueDate) >= today &&
        t.status !== 'completed'
      )
      .sort((a, b) =>
        new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
      )
      .slice(0, 5);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToTasks(): void {
    this.router.navigate(['/tasks']);
  }
}
