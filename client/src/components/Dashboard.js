import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import API from '../axios';

const Dashboard = () => {
    const [data, setData] = useState([])
    const [user, setUser] = useState("")
    const [surveyTitle, setSurveyTitle] = useState({})
    const [error, setError] = useState("") 

    const fetchData = () => {
        API.get('dashboard/').then(res => {
            console.log(res.data)
            setUser(res.data.user)
            setData(res.data.surveys)
        })
    }

    const createSurvey = e => {
        e.preventDefault()
        if(surveyTitle != "") {
            API.post('create/survey/', {
                title: surveyTitle
            }).then(res => {
                console.log(res.data)
                window.location.reload()
            }).catch(err => {
                setError("An error acquired")
            })
        }else {
            setError("Please fill all fields")
        } 
    }

    useEffect(() => {
        fetchData()
    }, [])

    return(
        <>
            {user == "" ?
                <div>
                    <h4>Please <Link to="/login">login</Link> first</h4>
                </div>
                :
                <div className="container">
                    <h3>Dashboard</h3>
                    <div>{error}</div>
                    <form onSubmit={createSurvey}>
                        <label>Title:
                            <input type="text" name="title" onChange={e => setSurveyTitle(e.target.value)} />
                            <button className="btn" type="submit">Create</button>
                        </label>
                    </form>
                    {data.length == 0 ?
                        <h4>You don't have any surveys yet</h4>
                    :
                        <div>
                            {data.map(survey => {
                            return(
                                <div className="card">
                                    <Link to={`survey/${survey.id}`}><h3>{survey.title}</h3></Link>
                                    <Link to={`edit/${survey.id}`}>edit</Link><hr/>
                                </div>
                            );
                            })}
                        </div>
                    }
                </div>
            }
        </>
    );
}

export default Dashboard;