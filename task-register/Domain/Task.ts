import {
  attribute,
  hashKey,
  rangeKey,
  table,
} from '@aws/dynamodb-data-mapper-annotations';
import { DynamoDB } from 'aws-sdk';

@table('Task')
export default class Task {
  @hashKey()
  employeeId:string;

  @rangeKey()
  registeredAt:string;

  @attribute()
  employeeName:string;

  /* @attribute()
  employeeEmail:string; */

  @attribute()
  focalPointId:string;

  @attribute()
  focalPointName:string;

  @attribute()
  taskCategory:string; // 'Other' always for simplicity

  @attribute()
  taskDescription:string;

  @attribute()
  taskTime:number;
}
