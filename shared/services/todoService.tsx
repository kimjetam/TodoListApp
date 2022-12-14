import axios from 'axios';
import { runInAction } from 'mobx';
import { TodoItem } from '../models';

export class TodoService {
  private baseUrl: string = '';

  constructor(baseUrl: string) {
    runInAction(() => (this.baseUrl = baseUrl));
  }

  public async getAllTodos() {
    const response = await axios.get(`${this.baseUrl}/todos`);
    return response.data;
  }

  public async createEmptyTodoList(title: string) {
    return axios.post(`${this.baseUrl}/todos`, { title });
  }

  public async deleteTodoList(id: string) {
    return axios.delete(`${this.baseUrl}/todos/${id}`);
  }

  public async updateTodoTitle(title: string, id: string) {
    return axios.put(`${this.baseUrl}/todos/${id}`, { title });
  }

  public async updateTodosForTodoList(id: string, todos: TodoItem[]) {
    return axios.put(`${this.baseUrl}/todos/${id}`, { todos });
  }
}
