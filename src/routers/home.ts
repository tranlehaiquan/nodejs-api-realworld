import { Request, Response, Router } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Realworld</title>
    <link rel="icon" type="image/png" href="/images/favicon.png" />
  </head>
  <body>
    <h1>Hello the world</h1>
  </body>
  </html>
  `);
});

export default router;
