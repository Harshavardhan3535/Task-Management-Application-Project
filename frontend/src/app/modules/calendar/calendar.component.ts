import { Component, OnInit, Input } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @Input() embedded = false;

  calendarOptions!: CalendarOptions;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {

    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      height: this.embedded ? 420 : 'auto',

      headerToolbar: this.embedded
      ? {
        left: 'prev',
        center: 'title',
        right: 'next'
      }
      : {
        left: 'prev',
        center: 'title',
        right: 'next today clearFilter'
      },
      
      customButtons: {
        clearFilter: {
          text: 'Clear',
          click: () => this.taskService.filterByDate(null)
        }
      },

      dateClick: (arg) => {
        this.taskService.filterByDate(arg.dateStr);
      },

      events: []
    };

    this.taskService.tasks$.subscribe(tasks => {
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.mapTasksToEvents(tasks)
      };
    });
  }

  private mapTasksToEvents(tasks: Task[]) {
    return tasks
      .filter(t => t.dueDate)
      .map(t => ({
        id: t._id,
        title: t.title,
        date: t.dueDate,
        display: 'block',
        classNames: [
          'task-event',
          t.priority,
          this.taskService.isOverdue(t) ? 'overdue-event' : ''
        ]
      }));
  }
}
