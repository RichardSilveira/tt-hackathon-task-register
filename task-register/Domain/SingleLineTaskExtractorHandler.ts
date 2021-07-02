import type { ITaskExtractorHandler } from './ITaskExtractorHandler';
import TaskEntry from './TaskEntry';

export default class SingleLineTaskExtractorHandler implements ITaskExtractorHandler {
  extract(rawText: string): TaskEntry[] {
    if (!rawText) {
      return [];
    }

    const result = [{
      date: new Date(),
      description: 'design check',
      time: 2,
    }];

    return result;
  }
}
// We could exchange by different Text extractors, e.g.: MultiLine | SpellCorrector (e.g. using ElasticSearch)
