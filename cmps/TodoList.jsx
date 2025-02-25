import { TodoPreview } from "./TodoPreview.jsx"
const { Link } = ReactRouterDOM

export function TodoList({ todos, onRemoveTodo, onToggleTodo ,isLoading }) {
    function getTodoClass(importance) {
        if (importance >= 8) return "high"
        if (importance >= 5) return "medium"
        return "low"
    }

    if (isLoading) return <p>Loading Todos...</p>
    if (!todos.length) return <p>No todos to show...</p>

    return (
        <ul className="todo-list">
            {todos.map(todo =>
                <li key={todo._id} className={getTodoClass(todo.importance)}>
                    <TodoPreview todo={todo} onToggleTodo={()=>onToggleTodo(todo)} />
                    <section>
                        <button onClick={() => onRemoveTodo(todo._id)}>Remove</button>
                        <button><Link to={`/todo/${todo._id}`}>Details</Link></button>
                        <button><Link to={`/todo/edit/${todo._id}`}>Edit</Link></button>
                    </section>
                </li>
            )}
        </ul>
    )
}