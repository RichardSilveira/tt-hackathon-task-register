import type { ITaskExtractorHandler } from './ITaskExtractorHandler';
import TaskEntry from './TaskEntry';

export class SingleLineTaskExtractorHandler implements ITaskExtractorHandler {
  // TODO: code should be refactored later. Plus, we could inject another TaskExtractorHandler class (e.g. a smarter one)
  extract(rawText: string): TaskEntry[] {
    try {
      if (!rawText) {
        return [];
      }

      let searchText = rawText.toLowerCase();
      const date = this.extractDate(searchText);

      searchText = searchText.substr(searchText.indexOf(':') + 1);
      // design check 2hs, meetings 1h, code review 3hs

      const result = searchText.split(',').map((t) => {
      // ' design check 2hs'

        let time: number;
        let idx: number;
        for (let i = t.length - 1; i >= 0; i--) {
          if (!isNaN(+t[i]) && t[i] !== ' ') {
            time = +t[i];
            idx = i;
            break;
          }
        }

        const description = t.substr(0, idx).trim();

        return new TaskEntry(date, description, time);
      });

      return result;
    } catch (e) {
      throw new Error(SingleLineTaskExtractorHandler.extractErrorMessage);
    }
  }

  private extractDate = (rawText: string): Date => {
    /*
    Valid Formats for the MVP

    design check 2hs, meetings 1h, code review 3hs (not informed, its today)
    today: design check 2hs, meetings 1h code review 3 hs
    1995-12-17: design check 2hs, meetings 1h code review, 3 hs
    */

    let date:Date;

    const days = { today: new Date(), yesterday: new Date(new Date().setDate(new Date().getDate() - 1)) };

    if (rawText.startsWith('today') || !rawText.includes(':')) {
      date = days.today;
    } else if (rawText.startsWith('yesterday')) {
      date = days.yesterday;
    } else {
      // 1995-12-17 (for the MVP only US date format)

      const informedDate = new Date(rawText.substr(0, rawText.indexOf(':')));

      if (informedDate.toString() !== 'Invalid Date') {
        date = informedDate;
      } else {
        throw new Error('Invalid Date');
      }
    }

    return date;
  };

  static extractErrorMessage = 'Unable to extract the tasks, make sure you are entering a valid format, e.g. Today: design check 2hs, meetings 1h, code review 3 hs';
}
// We could exchange by different Text extractors, e.g.: MultiLine | SpellCorrector (e.g. using ElasticSearch)
