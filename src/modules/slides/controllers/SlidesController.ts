import { Request, Response } from 'express';
import { CreateSlideDto } from '../dto/CreateSlideDto';
import createSlideService from '../services/CreateSlideService';

export default class SlidesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { text, language, searchTerm } = request.body;

    const createSlideDto: CreateSlideDto = {
      text,
      language,
      searchTerm,
    };

    const content = createSlideService.execute(createSlideDto);

    return response.json(content);
  }
}
