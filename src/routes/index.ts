import { Router } from 'express';
import PollController from '../controllers';

const router = Router();
const pollController = new PollController();

export function setRoutes(app) {
    app.use('/api/polls', router);
    router.get('/', pollController.getPolls.bind(pollController));
    router.post('/', pollController.createPoll.bind(pollController));
}