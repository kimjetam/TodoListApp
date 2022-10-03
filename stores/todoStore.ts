import { AnnotationsMap, configure, makeAutoObservable, runInAction } from "mobx";
import { TodoItem, TodoList } from "../models";
import { TodoService } from "../shared/services/todo-service";

export class TodoStore {

    private _todoLists: TodoList[] | undefined;

    private _loading: boolean = false;

    private _todoService: TodoService;

    private _baseUrl = "https://6335ec4d65d1e8ef266595b3.mockapi.io/api/";

    get todoLists() : TodoList[] | undefined {
        return this._todoLists;
    }

    get loading() : boolean{
        return this._loading;
    }

    constructor() {
        configure({ isolateGlobalState: true, observableRequiresReaction: true, enforceActions: 'observed' });
        makeAutoObservable(this, {_baseUrl : false} as AnnotationsMap<TodoStore, never>);

        this._todoService = new TodoService(this._baseUrl);

        this.init();
    }

    private async init(){
        this._loading = true; 
        const todos = await this._todoService.getAllTodos();
        this._loading = false; 
        if(todos !== undefined) {
            this._todoLists = todos;
            console.log("loaded");
            this._todoLists?.forEach(todoList => todoList.todos.forEach(todo => todo.deadline = new Date(todo.deadline!)))
        }
    }

    public getTodoList(id: string) {
        return this._todoLists?.find(x => x.id === id);
    } 

    public async deleteTodoList(id: string) {
        this._loading = true; 
        await this._todoService.deleteTodoList(id);
        this.init();
    }

    public async createNewTodoList(title: string): Promise<string> {
        this._loading = true; 
        const res = await this._todoService.createEmptyTodoList(title);
        this.init();
        return res.data.id as string;
    }

    public async updateTodoTitle(title: string, id: string){
        
        runInAction(() => {
            const todoList = this.getTodoList(id);
            todoList!.title = title;
        })
        this._loading = true; 
        await this._todoService.updateTodoTitle(title, id);
        this.init();
    }

    public async updateTodoItem(todoListId: string, todoItemIdx: number, todoItemNew: TodoItem) {
        this._loading = true; 
        runInAction(() => this._todoLists!.find(x => x.id === todoListId)!.todos[todoItemIdx] = todoItemNew);

        await this._todoService.updateTodosForTodoList(todoListId, this.getTodoList(todoListId)?.todos!);
        this.init();
    }

    public async addTodoItem(todoListId: string, todoItemNew: TodoItem) {
        this._loading = true; 
        runInAction(() => this._todoLists!.find(x => x.id === todoListId)!.todos.push(todoItemNew));

        await this._todoService.updateTodosForTodoList(todoListId, this.getTodoList(todoListId)?.todos!);
        this.init();
    }

    public async deleteTodoItem(todoListId: string, todoItemIdx: number) {
        this._loading = true; 
        runInAction(() => this._todoLists!.find(x => x.id === todoListId)!.todos.splice(todoItemIdx, 1));
        await this._todoService.updateTodosForTodoList(todoListId, this.getTodoList(todoListId)?.todos || []);
        this.init();
    }

    public async updateTodoItemStatus(todoListId: string, todoItemIdx: number, isDone: boolean) {
        this._loading = true; 
        runInAction(() => this._todoLists!.find(x => x.id === todoListId)!.todos[todoItemIdx].isDone = isDone );
        await this._todoService.updateTodosForTodoList(todoListId, this.getTodoList(todoListId)?.todos!);
        this.init();
    }


}