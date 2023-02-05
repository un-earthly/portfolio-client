var baseURL;
if (process.env.NODE_ENV !== 'production') {
    baseURL = 'http://localhost/api/v1'
} else {
    // baseURL = process.env.URL
    baseURL = "https://portfolio-hb2w.onrender.com/api/v1"

}


export { baseURL };