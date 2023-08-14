import { React, useState } from 'react'
import axios from 'axios'

const CheckId = function () {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const findUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/accounts/check/id/', { name, email })
            console.log(response.data)
        }
        catch (error) {
            console.error('not match')
        }
    }

    return (
        <div>
            <form onSubmit={findUser}>
                <input type='text' className="rounded text-pink-500 border-solid border-2 border-indigo-200" value={name} onChange={(e) => setName(e.target.value)}></input>
                <br></br>
                <input type='text' className="rounded text-pink-500 border-solid border-2 border-indigo-200" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <button type='submit'>전송</button>
            </form>
        </div>
    )
}
export default CheckId