import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { saveTodo } from "../store/actions/todo.actions.js"
import { SET_TODO, UPDATE_TODO_FIELD } from "../store/reducers/todo.reducer.js"

const { useState, useEffect } = React
const { useNavigate, useParams } = ReactRouterDOM
const {useSelector,useDispatch} = ReactRedux

export function TodoEdit() {
    // const [todoToEdit, setTodoToEdit] = useState(todoService.getEmptyTodo())
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()

    const todos = useSelector(storeState => storeState.toDoModule.todos)
    const existingTodo = todos.find(todo => todo._id === params.todoId) || todoService.getEmptyTodo()
    const[todoToEdit,setTodoToEdit] = useState(existingTodo)


    useEffect(() => {
        if (params.todoId && !existingTodo) 
            loadTodo()
    }, [])

    function loadTodo() {
        todoService.get(params.todoId)
            .then(todo => {
                setTodoToEdit(todo)
                dispatch({type : SET_TODO ,todo})})
            .catch(err => console.log('err:', err))
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }
       console.log(`🔍 Debug: Changing field "${field}" to value`, value)

       setTodoToEdit(prevTodo => ({ ...prevTodo, [field]: value }))
       dispatch({type:UPDATE_TODO_FIELD , field,value})
    }

    function onSaveTodo(ev) {
        ev.preventDefault()
        console.log("📝 Saving todo:", todoToEdit)
        saveTodo(todoToEdit)
            .then((savedTodo) => {
                console.log("✅ Todo Saved:", savedTodo)
                navigate('/todo')
                showSuccessMsg(`Todo Saved (id: ${savedTodo._id})`)
            })
            .catch(err => {
                showErrorMsg('Cannot save todo')
                console.log('err:', err)
            })
    }
    if (!todoToEdit) return <div>Loading...</div>

    const { txt, importance, isDone } = todoToEdit

    return (
        <section className="todo-edit">
            <form onSubmit={onSaveTodo} >
                <label htmlFor="txt">Text:</label>
                <input onChange={handleChange} value={txt} type="text" name="txt" id="txt" />

                <label htmlFor="importance">Importance:</label>
                <input onChange={handleChange} value={importance} type="number" name="importance" id="importance" />

                <label htmlFor="isDone">isDone:</label>
                <input onChange={handleChange} value={isDone} type="checkbox" name="isDone" id="isDone" />


                <button>Save</button>
            </form>
        </section>
    )
}