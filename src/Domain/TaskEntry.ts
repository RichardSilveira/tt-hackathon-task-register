export default class TaskEntry {
  constructor(readonly date: Date, readonly description: string, readonly time: number) {

  }
}
// todo: Update this Value Object to not allow create an invalid Task entry,
//  e.g. a single task can't have more than 9 hs | can't have a future date
