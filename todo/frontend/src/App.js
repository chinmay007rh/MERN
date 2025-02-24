import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

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

  const toggleTodo = (id, completed) => {
      axios.put(`http://localhost:5000/todos/${id}`, { completed: !completed })
          .then(() => {
              setTodos(todos.map(todo => 
                  todo.id === id ? { ...todo, completed: !completed } : todo
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

  return (
      <div className="container">
          <h1>MySQL To-Do List</h1>
          <input 
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task"
          />
          <button onClick={addTodo}>Add</button>

          <ul>
              {todos.map(todo => (
                  <li key={todo.id} className={todo.completed ? "completed" : ""}>
                      <span onClick={() => toggleTodo(todo.id, todo.completed)}>
                          {todo.title}
                      </span>
                      <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>❌</button>
                  </li>
              ))}
          </ul>
      </div>
  );
}

export default App;