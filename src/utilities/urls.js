let BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// if (process.env.BASE_URL) {
//     BASE_URL = "https://portfolio-hb2w.onrender.com/api/v1"
// }
// else {
//     BASE_URL = "http://localhost/api/v1"
// }

// project url


export const PROJECT_URL = BASE_URL + "/project"
export const GET_PROJECT_LIST_URL = PROJECT_URL + "/list"
export const INSERT_PROJECT_LIST_URL = PROJECT_URL + "/insert"



// message url


export const MASSAGE_URL = BASE_URL + "/message"
export const GET_MASSAGE_LIST_URL = MASSAGE_URL + "/list"
export const INSERT_MASSAGE_URL = MASSAGE_URL + "/insert"