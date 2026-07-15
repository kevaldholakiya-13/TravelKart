import { Router } from 'express';
import { sendSuccess } from '../utils/helpers';

// Cart Routes
const cartRouter = Router();
cartRouter.get('/', (req, res) => sendSuccess(res, 200, 'Cart retrieved'));
cartRouter.post('/', (req, res) => sendSuccess(res, 201, 'Item added to cart'));
cartRouter.put('/:id', (req, res) => sendSuccess(res, 200, 'Cart item updated'));
cartRouter.delete('/:id', (req, res) => sendSuccess(res, 200, 'Item removed from cart'));

export default cartRouter;
