// todoStore.ts
import { createStore } from 'neutrix'
import type { State } from 'neutrix'

export interface Todo {
  id: number
  text: string
  completed: boolean
}

export interface TodoState extends State {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
}

const initialState: TodoState = {
  todos: [],
  filter: 'all'
}

export const store = createStore<TodoState>(initialState, {
  persist: true,
  name: 'todo-store'
})

export const addTodo = (text: string) => {
    const todos = store.get('todos')
    store.set('todos', [
      ...todos,
      {
        id: Date.now(),
        text,
        completed: false
      }
    ])
  }
  
  export const toggleTodo = (id: number) => {
    const todos = store.get('todos')
    store.set('todos', todos.map((todo: Todo) => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }
  
  export const setFilter = (filter: 'all' | 'active' | 'completed') => {
    store.set('filter', filter)
  }
  
  export const filteredTodos = store.computed('filteredTodos', (state: TodoState) => {
    switch (state.filter) {
      case 'active':
        return state.todos.filter(todo => !todo.completed)
      case 'completed':
        return state.todos.filter(todo => todo.completed)
      default:
        return state.todos
    }
  })