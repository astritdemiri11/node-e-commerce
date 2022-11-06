import { Request, Response } from "express";

export const get404 = (_req: Request, res: Response) => {
  res.status(404).render('404', { pageTitle: '404', linkIndex: -1 });
};
