import React, { useEffect, useState } from 'react';
import { useGlobalState } from '../actions/states/Auth.ts';
import Base from "../components/core/Base";
import {Logout} from "../actions/states/Auth.ts";
import getRecommendedWorkshopsAPI from "../actions/functions/getRecommendedWorkshops.ts";
import getWorkshopsAPI from "../actions/functions/getWorkshops.ts";
import myTopicsAPI from "../actions/functions/myTopics.ts";
import getTopicsAPI from "../actions/functions/getTopics.ts";
import addTopicAPI from "../actions/functions/addTopic.ts";

const IndexPage = () => {
    const [data] = useGlobalState('userData');
    const [token] = useGlobalState('token');
    const isLoggedIn = typeof token === 'string' && token.length>0;

    const [isQueried, setQueried] = useState(false);
    const [workshops, setWorkshops] = useState([]);
    const [myTopics, setMyTopics] = useState([]);
    const [topics, setTopics] = useState([]);
    useEffect(() => {
        const isLoggedIn = typeof token === 'string' && token.length>0;
        if(!isQueried)
        {
            getTopicsAPI().then(t => {
                setTopics(t);
                if (isLoggedIn) {
                    getRecommendedWorkshopsAPI().then(r => {
                        setWorkshops(r);
                        myTopicsAPI().then(i => {
                            setMyTopics(i);
                        });
                        setQueried(true);
                    })
                } else {
                    getWorkshopsAPI().then(r => {
                        setQueried(true);
                        setWorkshops(r);
                    })
                }
            });
        }
    });

    const handleTopicAdd = (e) => {
          e.preventDefault();
          const topic = e.currentTarget['topic'];
          addTopicAPI(topic.value).then(r => setQueried(false))
    };

    const renderAuthenticatedView = () =>
    <Base
        meta={{
            title: "Dashboard Page"
        }}
    >
        <div className="container p-2">
            <div className="bg-white my-4 p-2">
                <h3>Hello {data.firstName} {data.lastName}!</h3>
                <button onClick={Logout} className="btn btn-primary">Logout</button>
            </div>

            <div className="card p-4 shadow-lg my-4">
                <h4>Your Interest Topics</h4>
                <div>
                    {
                        myTopics && myTopics.length > 0 ?
                            myTopics.map(i =>
                                <span className="badge badge-success mr-2 d-inline-block p-2">{i.name}</span>
                            ) : <div>No topics selected</div>
                    }
                </div>
            </div>

            <div className="card p-4 shadow-lg my-4">
                <h4>Add Topics to your Interest</h4>
                <form onSubmit={handleTopicAdd}>
                    <div>Select Topic</div>
                    <select name="topic" className="form-control my-2">
                        {
                            topics && topics.length > 0 ?
                                topics.map(t => <option value={t.id}>{t.name}</option>) : null
                        }
                    </select>
                    <button type="submit" className="btn btn-primary py-2 px-4">Add Topic</button>
                </form>
            </div>

            <h4>Recommended Workshops for You</h4>
            { isQueried && isLoggedIn ? renderWorkshops() : null }
        </div>
    </Base>;

    const renderUnauthenticatedView = () =>
    <Base
        meta={{
            title: "Home Page"
        }}
    >
        <div className="container p-2">
            <div className="bg-white my-4 p-2">
                <h3>Welcome!</h3>
                <a href="/login"><button className="btn btn-primary">Login</button></a>
            </div>
            <h1>Workshops</h1>
            { isQueried ? renderWorkshops() : null }
        </div>
    </Base>;

    const renderWorkshops = () => workshops && workshops.length > 0 ?
        workshops.map(i =>
            <div className="card my-2 shadow-lg p-4">
                <h3 className="text-primary">{i.name}</h3>
                <p>{i.description}</p>
                <div>
                    {
                        i.topics && i.topics.length > 0 ?
                            i.topics.map( t => <span className="badge badge-info mr-2 d-inline-block p-2">{t.name}</span>)
                            : null
                    }
                </div>
            </div>
        ) : <div><h3>No Workshops Found</h3></div>;

    return <div>
        { isLoggedIn ? renderAuthenticatedView() : renderUnauthenticatedView() }
    </div>
};

export default IndexPage;