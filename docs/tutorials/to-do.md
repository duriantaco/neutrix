# Building a Todo App with neutrix

## Introduction

In this tutorial, we'll build a simple but functional Todo app that showcases neutrix's key features:

* Simple state management with `get/set`
* Automatic store updates and re-rendering
* Computed values
* Built-in persistence

## Prerequisites

* Basic knowledge of React and TypeScript
* Node.js installed on your machine
* An IDE

## Project Setup

We do have a full working example inside /examples so you can clone it into your repo and try it for yourself. Alternatively if you want to follow along, you can proceed on below. 

```
npm create vite@latest todo-app -- --template react-ts
cd todo-app
npm install neutrix react-router-dom
```
## Tutorial

### Setting up the store

1. First, we define our Todo type and store structure. Every todo item has an ID, text content, and completed status. The store tracks both our todos and the current filter state. 

```
export interface Todo {
  id: number
  text: string
  completed: boolean
}

export interface TodoState extends State {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
}
```

2. For managing todos, we create functions using neutrix's `store.get()` and `store.set()`. The addTodo function adds a new todo to the array.  ToggleTodo will update a todo's completed status. neutrix will automatically notify any components using todos data that they need to update.

```
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
  store.set('todos', todos.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  ))
}
```

Full code below: 
```
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
```

### Form component

The TodoForm component is a simple form for adding new todos. Here we can see how components interact with neutrix's store through direct function calls (as you seen earlier with addToDo). No need for dispatching actions or using context. Trying to keep it simple.

```
import { useState } from 'react'
import { addTodo } from './todoStore'

export function TodoForm() {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      addTodo(text)      //<--- directly call your store function
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a todo"
      />
      <button type="submit">Add</button>
    </form>
  )
}
```

### Form List

The TodoList component shows how neutrix handles computed values and automatic updates. When we use `useStore` with our filteredTodos computed value, the component automatically re-renders whenever the todos or filter changes.

```
import { useStore } from 'neutrix'
import { filteredTodos, toggleTodo, setFilter } from './todoStore'
import type { TodoState, Todo } from './todoStore'

export function TodoList() {
  const filteredList = useStore<TodoState, Todo[]>(() => filteredTodos())  // <--- subscribe to computed value

  return (
    <div>
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>

      {filteredList.map(todo => (
        <div 
          key={todo.id} 
          className={`todo-item ${todo.completed ? 'completed' : ''}`}
        >
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}   // <--- Direct store update
          />
          {todo.text}
        </div>
      ))}
    </div>
  )
}
```

### App

import { StoreProvider } from 'neutrix'
import { store } from './todoStore'
import './App.css'

function App() {
  return (
    <StoreProvider store={store}>
      <div className="todo-app">
        <h1>Todo App</h1>
        <TodoForm />
        <TodoList />
      </div>
    </StoreProvider>
  )
}

## Summary

### Simple store setup

```
const store = createStore<TodoState>(initialState, {
  persist: true,  // auto persistence 
  name: 'todo-store'
})
```

### Direct store operations
```
const addTodo = (text: string) => {
  const todos = store.get('todos')
  store.set('todos', [...todos, newTodo])
}
```

No need for reducers, action creators etc. 

