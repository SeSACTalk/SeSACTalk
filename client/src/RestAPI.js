import React, { useState } from 'react';
import axios from 'axios';

function RestAPI() {
    const [text, setText] = useState([]);

    return (
        <>
            <h1>RestAPI Demo</h1>
            <div className='btn-primary'>
                <button onClick={() => {
                    axios.post('http://127.0.0.1:8000/review/', {
                        title: 'API Title',
                        content: 'API Contents'
                    })
                        .then((response) => {
                            console.log(response)
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }}>POST</button>
                <button onClick={() => {
                    axios.get('http://127.0.0.1:8000/review/')
                        .then((response) => {
                            setText([...response.data])
                            console.log(response.data)
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }}>GET</button>
            </div>
            {text.map((e) => {
                <div>
                    {" "}
                    <div className='list'>
                        <span>
                            {e.id}번, {e.title}, {e.content}, {e.update_at}
                        </span>
                        <button className='btn-delete' onClick={() => {
                            axios.delete(`http://127.0.0.1:8000/review/${e.id}`);
                            setText(text.filter((text) => text.id !== e.id))
                        }}>DELETE</button>{" "}
                    </div>
                </div>
            })}
        </>
    )
}

export default RestAPI