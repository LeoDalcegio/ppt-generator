import slidesRouter from '@modules/slides/routes/slides.routes';
import { Router } from 'express';

const routes = Router();

routes.use('/products', slidesRouter);

export default routes;
