import { NextFunction, Response } from "express";

export default (req: any, res: Response, next: NextFunction) => {
  if (req.session.isLoggedIn) {
    return res.redirect('/');
  }

  return next();
};
