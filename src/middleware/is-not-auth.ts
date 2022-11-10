import { NextFunction, Response } from "express";

export default (req: any, res: Response, next: NextFunction) => {
  if (req.session.isLoggedIn) {
    return res.status(402).redirect('/');
  }

  return next();
};
