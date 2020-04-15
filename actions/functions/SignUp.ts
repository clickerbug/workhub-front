import dataFetch from "../../utils/dataFetch";
// @ts-ignore

interface UserRegisterParams { email: string, password: string }

async function registerUser(email: string, password: string)
{
    const query = `mutation registerUser($email: String!, $password: String!){
      registerUser(email: $email, password: $password)
      {
        returning
        {
            username
        }
        status
      }
    }`;
    const variables = { email, password };
    return await dataFetch({ query, variables }).then(res => res);
}

async function SignUp({email, password}: UserRegisterParams)
{
    return await registerUser(email, password).then(response => {
        if (response.errors) {
            console.error("We have an error in creating an account for you.");
            return { errors: response.errors };
        } else if(response.data) {
            return response.data.registerUser;
        } else {
            console.error("We have an error in creating an account for you.");
            return { errors: [
                {message: "We tried our best, but we got no response from our servers. Please try refreshing the page or coming back later."}
            ]};
        }
    });
}

export default SignUp;