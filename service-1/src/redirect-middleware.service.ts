import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

@Injectable()
export class RedirectMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    if (
      (!req.cookies.sAccessToken || !req.cookies.sFrontToken) &&
      !res.req.baseUrl.includes('/auth')
    ) {
      res.clearCookie('sAccessToken');
      res.clearCookie('sFrontToken');
      res.redirect('/auth');
    } else next();
  }
}
