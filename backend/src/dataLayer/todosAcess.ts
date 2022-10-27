import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')
const bucketName = process.env.ATTACHMENT_S3_BUCKET

export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE) {
    }

    async getTodosForUser(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all todo items')

        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },


        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        logger.info('Creating todo items')
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()
        return todo as TodoItem;
    }

    async updateTodo(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<void> {
        logger.info('Updating todo items')
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeNames: {
              '#name': 'name'
            },
            ExpressionAttributeValues: {
              ':name': todoUpdate.name,
              ':dueDate': todoUpdate.dueDate,
              ':done': todoUpdate.done
            },
        }).promise()
    }

    async deleteTodo(todoId: string, userId: string): Promise<void> {
        logger.info('Deleting todo items')
        await this.docClient
            .delete({
                TableName: this.todosTable,
                Key: {
                    userId: userId,
                    todoId: todoId
                }
            }).promise()
    }

    async updateTodoUrl(todoId: string, userId: string): Promise<void> {
        logger.info('Updating todo URL')
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                userId: userId,
                todoId: todoId
            },
            UpdateExpression: 'set attachmentUrl = :URL',
            ExpressionAttributeValues: {
                ':URL': `https://${bucketName}.s3.amazonaws.com/${todoId}`
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise()
    }
}
