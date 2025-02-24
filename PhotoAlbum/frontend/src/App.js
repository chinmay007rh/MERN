import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [photos, setPhotos] = useState([]);
    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/photos")
            .then(res => setPhotos(res.data))
            .catch(err => console.error(err));
    }, []);

    const uploadPhoto = () => {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("image", image);

        axios.post("http://localhost:5000/photos", formData)
            .then(res => setPhotos([...photos, res.data]))
            .catch(err => console.error(err));

        setTitle("");
        setImage(null);
    };

    const deletePhoto = (id) => {
        axios.delete(`http://localhost:5000/photos/${id}`)
            .then(() => {
                setPhotos(photos.filter(photo => photo.id !== id));
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="container">
            <h1>Photo Album</h1>
            <input type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            <button onClick={uploadPhoto}>Upload</button>

            <div className="gallery">
                {photos.map(photo => (
                    <div key={photo.id} className="photo-card">
                        <img src={photo.image_url} alt={photo.title} />
                        <p>{photo.title}</p>
                        <button className="delete-btn" onClick={() => deletePhoto(photo.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
