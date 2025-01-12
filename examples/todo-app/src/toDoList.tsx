// toDoList.tsx
import { useStore } from 'spyn'
import { filteredTodos, toggleTodo, setFilter } from './toDoStore'
import type { TodoState, Todo } from './toDoStore'

export function TodoList() {
  const filteredList = useStore<TodoState, Todo[]>(() => filteredTodos())

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
            onChange={() => toggleTodo(todo.id)}
          />
          {todo.text}
        </div>
      ))}
    </div>
  )
}