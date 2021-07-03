import TaskEntry from './TaskEntry';
import type { ITaskExtractorHandler } from './ITaskExtractorHandler';
import Task from './Task';

export default class RegisterTaskDomainService {
  constructor(private readonly taskExtractorHandler: ITaskExtractorHandler) {
  }

  extractTasksEntriesFrom(rawText: string): TaskEntry[] {
    const tasks: TaskEntry[] = [];

    // apply bussines rules related to what is a valid instance of a Task entry, e.g. you can't register future hours | can't register more that 9hs in a single row
    // todo: No, the right way is apply those rules in the Task Entry Value Object, then I think I can simplify this method to return a Task directly

    return tasks;
  }

  generateTask(employeeId: string) : Task {

  }

  //! We should have a TaskQueryService (or TaskRepository (better) ) to deliver the CURRENT Focal Point | Project given an employeeId
  // A EmployeeTaskSettings is better for that
  // Projects | FocalPoints -> same table? Those information will came from the current Baires system' integration (that we could replicate
  // them in our tables for a better performance

  // todo: Create the relation of Task Description x Task Category (not for the MVP, we'll register the Task Categories as Other
  // Plus we won't have a list of pre-defined Task Description, BUT we should design how to reply back to the user with the valid Task Description
}
