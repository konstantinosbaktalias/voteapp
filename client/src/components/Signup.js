import { useState } from 'react';

import API from '../axios';

const Signup = () => {
    const [username, setUsername] = useState({})
    const [password1, setPassword1] = useState({})
    const [password2, setPassword2] = useState({})
    const [error, setError] = useState("")

    const onSubmit = e => {
        e.preventDefault()
        if(username.length <= 5){
            setError('Please enter a longer username')
        }
        else if (password1.length < 6) {
            setError('Password should be at least 6 characters')    
        }
        else if(password1 == password2) {
            API.post('user/signup/', {
                username: username,
                password: password1
            }).then(res => {
                console.log(res)
                console.log(res.data)
                setError('')
                window.location.replace('/login')
            }).catch(err => {
                setError('Username is taken')
                console.log(err)
            });
            }
        else {
            setError('Passwords did not match')
            }
    }

    return(
        <>
            <div className="form-container">
                <h1>Sign up</h1>
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
                        <input type="password" name="password" onChange={e => setPassword1(e.target.value)}/>
                    </label><br/><br/>
                    <label>Confirm password:<br/>
                        <input type="password" name="password" onChange={e => setPassword2(e.target.value)}/>
                    </label><br/><br/>
                    <button className="btn" type="submit">Signup</button>
                </form>
            </div>
        </>
    )
}

export default Signup;