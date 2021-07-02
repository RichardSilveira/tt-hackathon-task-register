import TaskEntry from './TaskEntry';
import type { ITaskExtractorHandler } from './ITaskExtractorHandler';

export default class RegisterTaskDomainService {
  constructor(private readonly taskExtractorHandler: ITaskExtractorHandler) {
  }

  extractTasksFromText(rawText: string): TaskEntry[] {
    const tasks: TaskEntry[] = [];
    return tasks;
  }
}
