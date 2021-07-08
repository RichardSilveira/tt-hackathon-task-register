import { SingleLineTaskExtractorHandler } from '../Domain/SingleLineTaskExtractorHandler';

describe('Extracting task entries from a single line raw text user input', () => {
  describe('Considering the valid formats for the MVP:', () => {
    console.log(`Valid Formats for the MVP:
    design check 2hs, meetings 1h, code review 3hs (if it's not informed, today will be used)
    Today: design check 2hs, meetings 1h, code review 3 hs
    Yesterday: design check 2hs, meetings 1h code review 3 hs
    1995-12-17: design check 2hs, meetings 1h code review, 3 hs`);

    const dateToShortStr = (date) => date.toISOString().substr(0, 10);

    it('When today is informed as expected, should return task entries using the current datetime', () => {
      // Arrange
      const taskExtractorHandler = new SingleLineTaskExtractorHandler();

      const expectedTaskEntries = [{
        date: dateToShortStr(new Date()),
        description: 'design check',
        time: 2,
      }];

      // Act
      const receivedTaskEntries = taskExtractorHandler.extract('Today: design check 2hs')
        .map((t) => ({ ...t, date: dateToShortStr(t.date) }));

      // Assert
      expect(receivedTaskEntries).toStrictEqual(expectedTaskEntries);
    });

    it('When a date in not informed should return task entries using the current datetime (today)', () => {
      // Arrange
      const taskExtractorHandler = new SingleLineTaskExtractorHandler();

      const expectedTaskEntries = [{
        date: dateToShortStr(new Date()),
        description: 'design check',
        time: 2,
      }];

      // Act
      const receivedTaskEntries = taskExtractorHandler.extract(' design check 2hs')
        .map((t) => ({ ...t, date: dateToShortStr(t.date) }));

      // Assert
      expect(receivedTaskEntries).toStrictEqual(expectedTaskEntries);
    });

    it('When yesterday is informed as expected, should return task entries using the current datetime - 1 day', () => {
      // Arrange
      const taskExtractorHandler = new SingleLineTaskExtractorHandler();

      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

      const expectedTaskEntries = [{
        date: dateToShortStr(yesterday),
        description: 'design check',
        time: 2,
      }];

      // Act
      const receivedTaskEntries = taskExtractorHandler.extract('Yesterday: design check 2hs')
        .map((t) => ({ ...t, date: dateToShortStr(t.date) }));

      // Assert
      expect(receivedTaskEntries).toStrictEqual(expectedTaskEntries);
    });

    it('When a american format date is informed as expected, should return task entries using the informed date', () => {
      // Arrange
      const taskExtractorHandler = new SingleLineTaskExtractorHandler();

      const expectedTaskEntries = [{
        date: dateToShortStr(new Date('2021-07-15')),
        description: 'design check',
        time: 2,
      }];

      // Act
      const receivedTaskEntries = taskExtractorHandler.extract('2021-07-15: design check 2hs')
        .map((t) => ({ ...t, date: dateToShortStr(t.date) }));

      // Assert
      expect(receivedTaskEntries).toStrictEqual(expectedTaskEntries);
    });

    it('When a list of tasks are informed, should return a task entry list with the same date', () => {
      // Arrange
      const rawTasksInput = '2021-07-15: design check 2hs, meetings 1h, code review 3 hs';

      const taskExtractorHandler = new SingleLineTaskExtractorHandler();

      const expectedTaskEntries = [{
        date: dateToShortStr(new Date('2021-07-15')),
        description: 'design check',
        time: 2,
      },
      {
        date: dateToShortStr(new Date('2021-07-15')),
        description: 'meetings',
        time: 1,
      },
      {
        date: dateToShortStr(new Date('2021-07-15')),
        description: 'code review',
        time: 3,
      }];

      // Act
      const receivedTaskEntries = taskExtractorHandler.extract(rawTasksInput)
        .map((t) => ({ ...t, date: dateToShortStr(t.date) }));

      // Assert
      expect(receivedTaskEntries).toStrictEqual(expectedTaskEntries);
    });

    it('When a invalid american format date is informed, should throws a generic informative error', () => {
      // Arrange
      const taskExtractorHandler = new SingleLineTaskExtractorHandler();

      // Assert
      expect(() => taskExtractorHandler.extract('2021-33-15: design check 2hs')).toThrow(SingleLineTaskExtractorHandler.extractErrorMessage);
    });
  });
});
