import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import API from '../axios';

const Home = () => {
    const [page, setPage] = useState()
    const [totalpages, setTotal] = useState()
    const [data, setData] = useState([]);

    const fetchData = (num) => {
            API.get(`/survey/page/${num}`).then(res => {
            console.log(res.data);
            setData(res.data.surveys)
            setPage(res.data.page_number)
            setTotal(res.data.total_pages)
        })
    }

    useEffect(() => {
        fetchData(1)
    }, []);

    const pages = [];
    for(let x = 1; x<=totalpages; x++) {
        pages.push(x)
    }

    return(
        <>
            <div className="container">
                <h1>Surveys</h1>
                {data.map(survey => {
                    return(
                        <div className="card">
                            <Link to={`survey/${survey.id}`}><h3>{survey.title}</h3></Link>
                            <span>@{survey.user}</span>
                            <hr/>
                        </div>
                    )
                })}
                <div>
                    {pages.map(num => {
                        let classes = page == num ? 'active-pg-btn' : 'pg-btn';
                        return(
                            <button className={classes} onClick={() => fetchData(num)}>{num}</button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default Home;