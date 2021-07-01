import {
  attribute,
  hashKey,
  rangeKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';

@table('Task')
export default class Task {
  @hashKey()
  employeeId:string;

  @rangeKey()
  registeredAt:Date;

  @attribute()
  employeeName:string;

  @attribute()
  taskCategory:string;

  @attribute()
  taskDescription:string;
}
