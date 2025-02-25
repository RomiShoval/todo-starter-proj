import { TodoFilter } from "../cmps/TodoFilter.jsx"
import { TodoList } from "../cmps/TodoList.jsx"
import { DataTable } from "../cmps/data-table/DataTable.jsx"
import { todoService } from "../services/todo.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { removeTodo,saveTodo ,loadTodos} from "../store/actions/todo.actions.js"
import {SET_FILTER_BY} from "../store/reducers/todo.reducer.js"

const { useEffect } = React
const { Link, useSearchParams } = ReactRouterDOM
const {useSelector,useDispatch} = ReactRedux

export function TodoIndex() {

    // const [todos, setTodos] = useState(null)
    const todos = useSelector(storeState => storeState.toDoModule.todos)
    const isLoading = useSelector(storeState => storeState.toDoModule.isLoading)
    const filterBy = useSelector(storeState => storeState.toDoModule.filterBy)
    const dispatch = useDispatch()

    // Special hook for accessing search-params:
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(() =>{
        const defaultFilter = todoService.getFilterFromSearchParams(searchParams)
        dispatch({type:SET_FILTER_BY, filterBy:defaultFilter})
    },[])

   

    useEffect(() => {
        setSearchParams(filterBy)
        loadTodos()
        .catch(() =>showErrorMsg('Cannot load todos'))
    }, [filterBy])

    function onRemoveTodo(todoId) {
        const isConfirmed = confirm("Are you sure you want to delete?")
        if(!isConfirmed) return

       removeTodo(todoId)
            .then(() => {showSuccessMsg(`Todo removed`)})
            .catch(() => {showErrorMsg('Cannot remove todo ' + todoId)})
    }

    function onToggleTodo(todo) {
        const todoToSave = { ...todo, isDone: !todo.isDone }
        saveTodo(todoToSave)
            .then((savedTodo) => {
                showSuccessMsg(`Todo is ${(savedTodo.isDone)? 'done' : 'back on your list'}`)
            })
            .catch(() => {
                showErrorMsg('Cannot toggle todo ' + todoToSave._id)
            })
    }

    function onSetFilter(newFilter) {
        dispatch({ type: SET_FILTER_BY, filterBy :newFilter })
    }


    // if (!todos) return <div>Loading...</div>
    return (
        <section className="todo-index">
            <TodoFilter filterBy={filterBy} onSetFilterBy={onSetFilter} />
            <div>
                <Link to="/todo/edit" className="btn" >Add Todo</Link>
            </div>
            <h2>Todos List</h2>
            {!isLoading ?
                <TodoList 
                    todos={todos} 
                    onRemoveTodo={onRemoveTodo} 
                    onToggleTodo={onToggleTodo} 
                    isLoading = {isLoading}/>
                : <div>Loading..</div>
            }

            <hr />
            <h2>Todos Table</h2>
            <div style={{ width: '60%', margin: 'auto' }}>
                <DataTable todos={todos} onRemoveTodo={onRemoveTodo} />
            </div>
        </section>
    )
}