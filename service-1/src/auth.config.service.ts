import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthConfigService {
  createOptions() {
    return {
      connectionURI: process.env.CONNECTION_URI,
      apiKey: process.env.API_KEY,
      appInfo: {
        appName: 'service-1',
        apiDomain: 'http://localhost:201/api',
        websiteDomain: 'http://localhost:201',
        apiBasePath: '/auth',
        websiteBasePath: '/auth',
      },
    };
  }
}
