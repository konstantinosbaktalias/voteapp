import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';

import API from '../axios';

const EditSurvey = () => {
    const {id} = useParams();
    const [survey, setSurvey] = useState({});
    const [choice, setChoice] = useState();
    const [labels, setLabels] = useState();
    const [data, setData] = useState();
    const [user, setUser] = useState();
    const [error, setError] = useState();
    const [formError, setFormError] = useState();

    const fetchData = () => {
        API.get('user/').then(res => {
            setUser(res.data.username)
            API.get(`survey/${id}`).then(res => {
                console.log(res.data)
                setSurvey(res.data)
                setLabels(res.data.results.labels)
                setData(res.data.results.votes)
                setError("")
                if(user !== survey.user) {
                    setError("401 unautherized action")
                }
            }).catch(err => {
                setError("404 not found")
            })
        }).catch(err => {
            setError("401 unautherized action")
        });
    }

    const createChoice = () => {
            API.post(`survey/choice/create/${id}`, {
                survey: id,
                title: choice
            }).then(res => {
                setFormError("")
                //console.log(res.data)
            })
    }

    const deleteChoice = (choice_id) => {
        API.delete(`survey/choice/delete/${choice_id}`).then(res => {
            //console.log(res.data)
        })
    }

    const deleteSurvey = () => {
        API.delete(`survey/delete/${id}`).then(res => {
        })
    }

    const chart_data = {
        labels: labels,
        borderWidth: 1,
        datasets: [{
            label: 'Votes',
            data: data,
            backgroundColor: '#083045',
            hoverBackgroundColor: ' #19e680'
        }]
    }

    const options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }

    useEffect(() => {
        fetchData()
    }, []);
    
    return (
        <>
            {error != "" ?
                <div>
                    <h1>{error}</h1>
                </div>
                :
                <div className="container">
                    <h3>{survey.title}</h3>
                    <div>{formError}</div>
                    <form onSubmit={createChoice}>
                        <label>Choice:
                            <input type="text" name="title" onChange={e => setChoice(e.target.value)}/>
                        </label>
                        <button className="btn" type="submit">Create</button>
                    </form>
                    {survey.choices.map(choice => {
                        return (
                            <>
                                <h5>{choice.title}</h5>
                                <form onSubmit={() => deleteChoice(choice.id)}>
                                    <button className="btn-delete" type="submit">Remove</button>
                                </form>
                            </>
                        );
                    })}
                    <div>
                        <Bar data={chart_data} options={options}/>
                    </div>
                    <div>
                        <form onSubmit={deleteSurvey}>
                            <button className="btn-delete" type="submit">Delete</button>
                        </form>
                    </div>
                </div>
            }
        </>
    );
}

export default EditSurvey;