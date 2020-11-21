import { useState } from 'react';

import API from '../axios';

const Login = () => {
    const [username, setUsername] = useState({})
    const [password, setPassword] = useState({})
    const [error, setError] = useState("")

    const onSubmit = e => {
        e.preventDefault()
            API.post('user/login/',  {
                username: username,
                password: password
            }).then(res => {
                console.log(res)
                console.log(res.data)
                setError('')
                window.location.replace('/')
            }).catch(err => {
                setError('Incorrect username or password')
                console.log(err)
            });
    }

    return(
        <>
            <div className="form-container">
                <h1>Login</h1>
                {error.length == 0 ? 
                <div></div>
                :
                <div className="error">
                    <span>{error}</span>
                </div>
                }
                <form onSubmit={onSubmit}>
                    <label>Username:<br/>
                        <input type="text" name="username" onChange={e => setUsername(e.target.value)}/>
                    </label><br/><br/>
                    <label>Password:<br/>
                        <input type="password" name="password" onChange={e => setPassword(e.target.value)}/>
                    </label><br/><br/>

                    <button className="btn" type="submit">Login</button>
                </form>
            </div>
        </>
    )
}

export default Login;