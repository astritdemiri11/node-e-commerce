import { NextFunction, Response } from "express";

export default (req: any, res: Response, next: NextFunction) => {
  if (!req.session.isLoggedIn) {
    return res.status(401).redirect('/login');
  }

  return next();
};
