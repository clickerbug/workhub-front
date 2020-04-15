import dataFetch from "../../utils/dataFetch";


async function addTopic(id)
{
    const query = `mutation add_topic{
      addUserTopics(topicID: ${id})
    }`;
    return await dataFetch({ query }).then(res => res);
}

async function addTopicAPI(id)
{
    return await addTopic(id).then(response => {
        if (response.errors) {
            console.error("We have an error in authenticating you.");
            return { errors: response.errors };
        } else if(response.data) {
            return response.data.addUserTopics
        } else {
            console.error("We are facing technical issues in authenticating you.");
            return { errors: [
                    {message: "We tried our best, but we got no response from our servers. Please try refreshing the page or coming back later."}
                ]};
        }
    });
}

export default addTopicAPI;