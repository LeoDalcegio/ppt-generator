import { Router } from 'express';
import SlidesController from '../controllers/SlidesController';
import { celebrate, Joi, Segments } from 'celebrate';

const slidesRouter = Router();
const slidesController = new SlidesController();

slidesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      text: Joi.string().required(),
      language: Joi.string().required(),
    },
  }),
  slidesController.create,
);

export default slidesRouter;
