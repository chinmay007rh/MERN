import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [editingTodo, setEditingTodo] = useState(null);
    const [editText, setEditText] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/todos")
            .then(res => setTodos(res.data))
            .catch(err => console.error(err));
    }, []);

    const addTodo = () => {
        if (!newTodo.trim()) return;
        axios.post("http://localhost:5000/todos", { title: newTodo })
            .then(res => setTodos([...todos, res.data]))
            .catch(err => console.error(err));
        setNewTodo("");
    };

    const toggleTodo = (id) => {
        axios.put(`http://localhost:5000/todos/${id}/toggle`)
            .then(() => {
                setTodos(todos.map(todo => 
                    todo.id === id ? { ...todo, completed: !todo.completed } : todo
                ));
            })
            .catch(err => console.error(err));
    };

    const deleteTodo = (id) => {
        axios.delete(`http://localhost:5000/todos/${id}`)
            .then(() => {
                setTodos(todos.filter(todo => todo.id !== id));
            })
            .catch(err => console.error(err));
    };

    const startEditing = (todo) => {
        setEditingTodo(todo.id);
        setEditText(todo.title);
    };

    const saveEdit = (id) => {
        if (!editText.trim()) return;
        axios.put(`http://localhost:5000/todos/${id}`, { title: editText })
            .then(() => {
                setTodos(todos.map(todo => 
                    todo.id === id ? { ...todo, title: editText } : todo
                ));
                setEditingTodo(null);
                setEditText("");
            })
            .catch(err => console.error(err));
    };

    const cancelEdit = () => {
        setEditingTodo(null);
        setEditText("");
    };

    return (
        <div className="container">
            <h1>MySQL To-Do List</h1>
            <div className="input-container">
                <input 
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new task"
                />
                <button onClick={addTodo}>Add</button>
            </div>

            <ul>
                {todos.map(todo => (
                    <li key={todo.id} className={todo.completed ? "completed" : ""}>
                        {editingTodo === todo.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && saveEdit(todo.id)}
                                />
                                <button onClick={() => saveEdit(todo.id)}>Save</button>
                                <button onClick={cancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span onClick={() => toggleTodo(todo.id)} className="clickable">
                                    {todo.title}
                                </span>
                                <button className="edit-btn" onClick={() => startEditing(todo)}>📝</button>
                                <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>❌</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
