// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportCustomError from '../../../app/middleware/customError';
import ExportDelete from '../../../app/middleware/delete';
import ExportMyLogger from '../../../app/middleware/myLogger';

declare module 'egg' {
  interface IMiddleware {
    customError: typeof ExportCustomError;
    delete: typeof ExportDelete;
    myLogger: typeof ExportMyLogger;
  }
}
