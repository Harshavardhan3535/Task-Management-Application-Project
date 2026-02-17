import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { TaskService, Task } from '../../services/task.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: any;
  taskCount = 0;

  constructor(
    private authService: AuthService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.taskService.loadTasks().subscribe();

    this.taskService.tasks$.subscribe((tasks: Task[]) => {
      this.taskCount = tasks.length;
    });
  }
  logout() {
    this.authService.logout();
  }
}