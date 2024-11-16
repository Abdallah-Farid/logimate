import { Injectable, NestMiddleware } from '@nestjs/common';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';

@Injectable()
export class I18nMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    i18next
      .use(Backend)
      .use(middleware.LanguageDetector)
      .init({
        preload: ['en', 'ar'],
        backend: {
          loadPath: 'locales/{{lng}}/translation.json',
        },
        fallbackLng: 'en',
      });

    middleware.handle(i18next)(req, res, next);
  }
}
