import ITaskExtractorHandler from './ITaskExtractorHandler';
import Task from './Task';

export default class SingleLineTaskExtractorHandler implements ITaskExtractorHandler {
  extract(rawText: string): Task[] {
    if (!rawText) return [];

    return [new Task()];
  }
}
// We could exchange by different Text extractors, e.g.: MultiLine | SpellCorrector (e.g. using ElasticSearch)
