import axios from 'axios'

const brewApi = axios.create({
    baseURL: 'https://api.openbrewerydb.org/v1',
})

export default brewApi;