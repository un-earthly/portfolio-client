var baseURL;
if (process.env.NODE_ENV !== 'production') {
    baseURL = 'http://localhost'
} else {
    baseURL = process.env.URL
}


export { baseURL };