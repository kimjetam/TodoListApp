import { AnnotationsMap, configure, makeAutoObservable, runInAction } from "mobx";
import { TodoItem, TodoList } from "../shared/models";
import { TodoService } from "../shared/services/todoService";

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

    private _setLoadingProp(val: boolean): void {
        runInAction(() => this._loading = val);
    }

    private async init() {
        this._setLoadingProp(true); 
        const todos = await this._todoService.getAllTodos();
        
        if (todos !== undefined) {
            runInAction(() => {
                this._todoLists = todos;
                this._todoLists?.forEach(todoList => todoList.todos.forEach(todo => todo.deadline = new Date(todo.deadline!)))
            });
        }
        this._setLoadingProp(false); 
    }

    public getTodoList(id: string) {
        return this._todoLists?.find(x => x.id === id);
    } 

    public async deleteTodoList(todoListId: string) {
        this._setLoadingProp(true); 
        const removeIdx = this._todoLists?.findIndex(todoList => todoList.id === todoListId);
        if(removeIdx !== undefined && removeIdx !== -1 ) {
            runInAction(() => {this._todoLists?.splice(removeIdx, 1)});
            await this._todoService.deleteTodoList(todoListId);
        }
        this._setLoadingProp(false); 
    }

    public async createNewTodoList(title: string): Promise<string> {
        this._setLoadingProp(true); 
        const res = await this._todoService.createEmptyTodoList(title);

        runInAction(() => {this._todoLists?.push(res.data)});
        this._setLoadingProp(false); 

        return res.data.id as string;
    }

    public async updateTodoTitle(title: string, id: string) : Promise<void>{
        
        runInAction(() => {
            const todoList = this.getTodoList(id);
            if (todoList) todoList.title = title;
        })
        this._setLoadingProp(true); 
        await this._todoService.updateTodoTitle(title, id);
        this._setLoadingProp(false); 
    }

    public async updateTodoItem(todoListId: string, todoItemIdx: number, todoItemNew: TodoItem): Promise<void> {
        this._setLoadingProp(true); 
        runInAction(() => this._todoLists!.find(x => x.id === todoListId)!.todos[todoItemIdx] = todoItemNew);

        await this._todoService.updateTodosForTodoList(todoListId, this.getTodoList(todoListId)?.todos!);
        this._setLoadingProp(false); 
    }

    public async addTodoItem(todoListId: string, todoItemNew: TodoItem): Promise<void> {
        this._setLoadingProp(true); 
        runInAction(() => this._todoLists!.find(x => x.id === todoListId)!.todos.push(todoItemNew));

        await this._todoService.updateTodosForTodoList(todoListId, this.getTodoList(todoListId)?.todos!);
        this._setLoadingProp(false); 
    }

    public async deleteTodoItem(todoListId: string, todoItemIdx: number): Promise<void> {
        this._setLoadingProp(true); 
        runInAction(() => this._todoLists!.find(x => x.id === todoListId)!.todos.splice(todoItemIdx, 1));
        await this._todoService.updateTodosForTodoList(todoListId, this.getTodoList(todoListId)?.todos || []);
        this._setLoadingProp(false); 
    }

    public async updateTodoItemStatus(todoListId: string, todoItemIdx: number, isDone: boolean): Promise<void> {
        this._setLoadingProp(true); 
        runInAction(() => this._todoLists!.find(x => x.id === todoListId)!.todos[todoItemIdx].isDone = isDone );
        await this._todoService.updateTodosForTodoList(todoListId, this.getTodoList(todoListId)?.todos!);
        this._setLoadingProp(false); 
    }


}