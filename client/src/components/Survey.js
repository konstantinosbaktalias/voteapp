import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';

import API from '../axios';

const Survey = () => {
    const {id} = useParams();
    const [survey, setSurvey] = useState({});
    const [labels, setLabels] = useState();
    const [data, setData] = useState();
    const [choices, setChoices] = useState([]);
    const [voted, setVoted] = useState("")
    const [votedId, setVotedId] = useState({})
    const [error, setError] = useState("");

    const fetchData = () => {
        API.get(`survey/${id}`).then(res => {
            console.log(res.data)
            setSurvey(res.data)
            setLabels(res.data.results.labels)
            setChoices(res.data.choices)
            setData(res.data.results.votes)
            setError("")
        }).catch(() => {
            setError("404 not found")
        })
    }

    const getVoted = () => {
        API.get(`survey/vote/${id}`).then(res => {
            console.log(res.data)
            setVotedId(res.data.id)
            setVoted(res.data.choice)
        })
    }

    const createVote = v => {
        API.post(`/survey/choice/create/vote/${id}`, {
            choice: v
        }).then(res => {
            window.location.reload();
            console.log(res.data);
        })
    }

    const deleteVote = vote_id => {
        API.delete(`survey/choice/delete/vote/${vote_id}`).then(() => {
            window.location.reload()
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
        getVoted()
    }, [])

    return(
        <>{error != "" ?
            <div>
                <h1>{error}</h1>
            </div>
            :
            <div className="container">
                <h2>{survey.title}</h2>
                <span>@{survey.user}</span>
                {voted !== "" ? 
                    <>
                        <h4>You voted {voted}</h4>
                        <button className="btn-delete" onClick={() => deleteVote(votedId)}>Remove vote</button><br/>
                    </>
                    :
                    <ul className="votes">
                        {choices.map(choice => {
                            return(
                                <li>
                                    <h5>{choice.title}</h5>
                                    <button className="btn-vote" onClick={() => createVote(choice.id)}>Vote</button>
                                </li>
                            );
                        })}
                    </ul>
                }
                <div>
                    <Bar data={chart_data} options={options}/>
                </div>
                </div>
            }
        </>
    )
}

export default Survey;