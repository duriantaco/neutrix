// App.tsx
import { TodoList } from './TodoList'
import { TodoForm } from './TodoForm'
import { StoreProvider } from 'spyn'
import { store } from './toDoStore'
import './App.css'

function App() {
  return (
    <StoreProvider store={store}>
      <div className="todo-app">
        <h1 style={{ marginBottom: '1.5rem', color: '#1f2937' }}>Todo App</h1>
        <TodoForm />
        <TodoList />
      </div>
    </StoreProvider>
  )
}

export default App