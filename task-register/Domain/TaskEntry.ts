export default class TaskEntry {
  date: Date;

  description: string;

  time: number;

  constructor(date: Date, description: string, time: number) {
    if (date == null) throw new Error(`${date} is not defined`);
    if (description == null) throw new Error(`${description} is not defined`);
    if (time == null) throw new Error(`${time} is not defined`);

    this.date = date;
    this.description = description;
    this.time = time;
  }
}
