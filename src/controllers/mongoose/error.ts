export const get404 = (_req: any, res: any) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/404',
    linkIndex: -1,
  });
};
