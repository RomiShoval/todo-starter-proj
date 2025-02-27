const { useState, useEffect } = React

export function TodoFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ 
        txt: filterBy.txt || "",
        importance: filterBy.importance || "",
        isDone: filterBy.isDone || "All"})



    function onSubmitFilter(){
        onSetFilterBy(filterByToEdit)
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        if(field === "isDone"){
            if(value==="All") value=null
            else value = value ==="Done"
        }

        switch (target.type) {
            // case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default: break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    
    // function onSubmitFilter(ev) {
    //     ev.preventDefault()
    //     onSetFilterBy(filterByToEdit)
    // }

    const { txt, importance } = filterByToEdit
    return (
        <section className="todo-filter">
            <h2>Filter Todos</h2>
            <form onSubmit={onSubmitFilter}>
                <input 
                    value={txt} 
                    onChange={handleChange}
                    type="search" 
                    placeholder="By Txt" 
                    id="txt" 
                    name="txt"
                />
                <label htmlFor="importance">Importance: </label>
                <input 
                    value={importance} 
                    onChange={handleChange}
                    type="number" 
                    placeholder="By Importance" 
                    id="importance" 
                    name="importance"
                />
                 <label htmlFor="isDone">Status: </label>
                <select
                    id="isDone"
                    name="isDone"
                    value={filterByToEdit.isDone === null ? "All" : filterByToEdit.isDone ? "Done" :"Active"}
                    onChange={handleChange}>
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Done">Done</option>
                </select>
                <button hidden onClick={onSubmitFilter} >Set Filter</button>
            </form>
        </section>
    )
}