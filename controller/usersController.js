const getUsers = (req, res, next) => {
    res.render("users", {
        title: "users - md alamin"
    })
    // next()
}
module.exports = { getUsers, }