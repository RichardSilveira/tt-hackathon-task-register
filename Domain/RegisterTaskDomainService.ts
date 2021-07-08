import type { ITaskExtractorHandler } from './ITaskExtractorHandler';
import Task from './Task';

export class RegisterTaskDomainService {
  // todo: For the demo only
  public static readonly sampleFocalPoint = {
    focalPointId: 'baec79ec-876b-45d7-bb33-eed3611184d6',
    focalPointName: 'André Young',
  };

  // todo: For the demo only
  public static readonly sampleTaskCategory = 'Software Development';

  constructor(private readonly taskExtractorHandler: ITaskExtractorHandler) {
  }

  generateTasksFrom(rawText: string, employeeId: string, employeeName: string) : Task[] {
    /* archnote: for the MVP Demo we'll the slack' userId as the employeeId, but for the arch design we should consider
     a integration with the BairesDev IdP that should deliver to us a "subject" - a BairesDev org unique user identifier.
     Even if they don't implement any OpenId/OAuth/SAML protocol, they should deliver that unique user id somehow that we can use it.
     */

    const taksEntries = this.taskExtractorHandler.extract(rawText);

    const tasks = taksEntries.map((t) => Object.assign(new Task(), {
      employeeId,
      employeeName,
      ...RegisterTaskDomainService.sampleFocalPoint,
      taskCategory: RegisterTaskDomainService.sampleTaskCategory,
      taskDescription: t.description,
      registeredAt: t.date,
      taskTime: t.time,
    }));

    return tasks;
  }

  // archnote:
  // A EmployeeTaskSettings is better for that - DynamoDb on itself can be considered a good caching datasourcing for that scenario.
  // Projects | FocalPoints -> same table? Those information will came from the current Baires system' integration (that we could replicate
  // them in our tables for a better performance (Douglas: what about Absense?)

  // todo: Create the relation of Task Description x Task Category (not for the MVP, we'll register the Task Categories as Other
  // Plus we won't have a list of pre-defined Task Description, BUT we should design how to reply back to the user with the valid Task Description
}
