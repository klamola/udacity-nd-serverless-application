import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../storageLayer/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const logger = createLogger('todos')

const todosAccess = new TodosAccess();
const attachmentUtils = new AttachmentUtils();

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    logger.info('Getting all todo items')
    return todosAccess.getTodosForUser(userId);
}

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    logger.info('Creating todo items')
    const todoId = uuid.v4()

    return await todosAccess.createTodo({
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false,
        attachmentUrl: `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`,
        ...createTodoRequest
    })
}

export async function updateTodo(updateTodoRequest: UpdateTodoRequest, todoId: string, userId: string): Promise<void> {
    logger.info('Updating todo items')
    return await todosAccess.updateTodo(updateTodoRequest, todoId, userId)
}
  
export async function deleteTodo(todoId: string, userId: string): Promise<void> {
    logger.info('Deleting todo items')
    return todosAccess.deleteTodo(todoId, userId)
}

export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
    logger.info('Creating attachement presigned url')
    await todosAccess.updateTodoUrl(todoId, userId)
    return attachmentUtils.createAttachmentPresignedUrl(todoId)
  }
