import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';

const app = express();
app.use(cors({ origin: true }));
app.use(helmet());

app.get('/', async (request, response) => {
  return response.status(200).send('iae!');
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const api = functions.https.onRequest(app);
