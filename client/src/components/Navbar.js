import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import API from '../axios';

const Navbar = () => {
    const [user, setUser] = useState("")

    const getUser = () => {
        API.get('user/').then(res => {
            setUser(res.data.username)
        })
    }

    const logOut = () => {
        API.post('user/logout/').then(res => {
            window.location.reload();
        })
    }

    useEffect(() => {
        getUser()
    }, []);
    

    return (
        <div className="navbar">
            <ul className="logo">
                <li>
                    <Link to="/">VoteApp</Link>
                </li>
            </ul>
            {user == "" ?
                <ul className="nav">
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/signup">Signup</Link>
                    </li>
                </ul>
                :
                <ul className="nav">
                    <li className="user-link">
                        <Link to="/dashboard">{user}</Link>
                    </li>
                    <li>
                        <form onSubmit={logOut}>
                            <button className="btn-logout" type="submit">Logout</button>
                        </form>
                    </li>
                </ul>
            }
        </div>
    )
}

export default Navbar;