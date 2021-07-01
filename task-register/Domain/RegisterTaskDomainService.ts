import Task from './Task';

export default class RegisterTaskDomainService {
  extractTasksFromText(rawText: string): ReadonlyArray<Task> {
    const tasks: Task[] = [new Task()];
    return tasks;
  }
}
