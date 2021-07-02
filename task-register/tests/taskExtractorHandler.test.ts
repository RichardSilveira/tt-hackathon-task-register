// const singleLineTaskExtractorHandler = require('../Domain/SingleLineTaskExtractorHandler');
import SingleLineTaskExtractorHandler from '../Domain/SingleLineTaskExtractorHandler';
import Task from '../Domain/Task';

/*
    Valid Formats for the MVP

    design check 2hs, meetings 1h, code review 3hs (not informed, its today)
    Today: design check 2hs, meetings 1h code review 3 hs
    1995-12-17: design check 2hs, meetings 1h code review, 3 hs
*/
describe('extracting tasks user inputs: single line patterns', () => {
  const taskExtractorHandler = new SingleLineTaskExtractorHandler();
  // it('Today: design check (2h) meetings (3hs) code review (5h)', ()=>{

  const dateToShortStr = (date) => date.toISOString().substr(0, 10);

  it('Today: design check 2hs', () => {
    const expected = [{
      date: dateToShortStr(new Date()),
      description: 'design check',
      time: 2,
    }];

    expect(taskExtractorHandler.extract('Today: design check (2h)')
      .map((t) => ({ ...t, date: dateToShortStr(t.date) }))).toStrictEqual(expected);
  });
});
