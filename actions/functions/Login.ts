import dataFetch from "../../utils/dataFetch";
// @ts-ignore
import {setUsername, setToken, setRefreshToken, setUserData} from '../states/Auth.ts';

interface tokenAuthParams { username: string, password: string }

async function getAuthToken(username: string, password: string)
{
    const query = `mutation TokenAuth($username: String!, $password: String!) {
      tokenAuth(input: { username: $username, password: $password}){
        token
        refreshToken
        user
        {
          firstName
          lastName
          username
        }
      }
    }`;
    const variables = { username, password };
    return await dataFetch({ query, variables }).then(res => res);
}

async function Login({username, password}: tokenAuthParams)
{
    return await getAuthToken(username, password).then(response => {
        if (response.errors) {
            console.error("We have an error in authenticating you.");
            return { errors: response.errors };
        } else if(response.data) {
            setToken(response.data.tokenAuth.token);
            setUsername(response.data.tokenAuth.user.username);
            setRefreshToken(response.data.tokenAuth.refreshToken);
            setUserData(response.data.tokenAuth.user);
            return response.data.tokenAuth;
        } else {
            console.error("We are facing technical issues in authenticating you.");
            return { errors: [
                {message: "We tried our best, but we got no response from our servers. Please try refreshing the page or coming back later."}
            ]};
        }
    });
}

export default Login;