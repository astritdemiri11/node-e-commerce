module.exports.get404 = (_req, res) => {
    res.status(404).render('404', { pageTitle: '404', linkIndex: -1 });
};