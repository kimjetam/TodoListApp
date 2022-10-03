export interface TodoItem {
    title: string;
    description: string;
    deadline: Date | null;
    isDone: boolean;
}

export interface TodoList {
    id: string;
    title: string;
    todos: TodoItem[];
}