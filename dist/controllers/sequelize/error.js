"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get404 = void 0;
const get404 = (req, res) => {
    res.status(404).render('404', { pageTitle: '404', linkIndex: -1 });
};
exports.get404 = get404;
