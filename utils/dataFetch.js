import fetch from 'isomorphic-fetch';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
import { API } from '../constants';

export default ({ query, variables }) => {

    //@todo support custom/multiple providers, currently uses the 0 index provider
    const API_URL = API.providers[0].endpoint;

    const token = cookies.get('token');
    const apiConfig = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `JWT ${token}` : null,
        },
        body: JSON.stringify({ query, variables }),
    };

    return fetch(API_URL, apiConfig).then((response) => {
        const contentType = response.headers.get('content-type');
        if (response.ok) {
            if (contentType && contentType.indexOf('application/json') !== -1) {
                return response.json().then(json => json);
            }
            if (contentType && contentType.indexOf('text') !== -1) {
                return response.text().then(text => text);
            }
            return response;
        }
        console.error(`Response status ${response.status} during dataFetch for url ${response.url}.`);
        throw response;
    }).catch((reason) => {
        return reason
    });
};