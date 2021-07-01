import Task from './Task';

export default interface ITaskExtractorHandler {

  extract(rawText: string): ReadonlyArray<Task>;
}
