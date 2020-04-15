import dataFetch from "../../utils/dataFetch";


async function getTopics()
{
    const query = `query {
      getTopics
      {
          id
          name
      }
    }`;
    return await dataFetch({ query }).then(res => res);
}

async function getTopicsAPI()
{
    return await getTopics().then(response => {
        if (response.errors) {
            console.error("We have an error in authenticating you.");
            return { errors: response.errors };
        } else if(response.data) {
            return response.data.getTopics
        } else {
            console.error("We are facing technical issues in authenticating you.");
            return { errors: [
                    {message: "We tried our best, but we got no response from our servers. Please try refreshing the page or coming back later."}
                ]};
        }
    });
}

export default getTopicsAPI;