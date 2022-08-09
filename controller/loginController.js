const getLogin = (req, res, next) => {
    res.render("index", {
        title: "login - md alamin"
    })
    // next()
}
module.exports = { getLogin, }