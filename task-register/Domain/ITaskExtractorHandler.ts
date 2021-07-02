import type TaskEntry from './TaskEntry';

export interface ITaskExtractorHandler {
  extract(rawText: string): TaskEntry[] // todo: ReadOnlyArray
}
