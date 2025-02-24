import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/posts")
            .then(res => setPosts(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleSubmit = () => {
        if (editingPost) {
            axios.put(`http://localhost:5000/posts/${editingPost.id}`, { title, content })
                .then(() => {
                    setPosts(posts.map(post => post.id === editingPost.id ? { ...post, title, content } : post));
                    setEditingPost(null);
                });
        } else {
            axios.post("http://localhost:5000/posts", { title, content })
                .then(res => setPosts([...posts, res.data]));
        }
        setTitle("");
        setContent("");
    };

    const deletePost = (id) => {
        axios.delete(`http://localhost:5000/posts/${id}`)
            .then(() => setPosts(posts.filter(post => post.id !== id)))
            .catch(err => console.error(err));
    };

    return (
        <div className="container">
            <h1>MySQL Blog</h1>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
            <button onClick={handleSubmit}>{editingPost ? "Update Post" : "Create Post"}</button>

            <div className="blog-list">
                {posts.map(post => (
                    <div key={post.id} className="blog-card">
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        <button onClick={() => { setTitle(post.title); setContent(post.content); setEditingPost(post); }}>Edit</button>
                        <button className="delete-btn" onClick={() => deletePost(post.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
