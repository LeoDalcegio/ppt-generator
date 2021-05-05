import slidesRouter from '@modules/slides/routes/slides.routes';
import { Router } from 'express';

const routes = Router();

routes.use('/slides', slidesRouter);

export default routes;
