import { Request, Response } from 'express';
//import { CreateProductDto } from '../dto/CreateProductDto';
//import CreateProductService from '../services/CreateProductService';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    return response.json({ teste: 'teste' });
  }
}
