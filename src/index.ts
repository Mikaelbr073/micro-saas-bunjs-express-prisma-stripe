import express from 'express'
import { createUserController, listOneUserController, listUsersController } from './controllers/user.controller';
import { createTodoController } from './controllers/todo.controller';
import { createCheckoutSession } from './lib/stripe';
import { craeteCheckoutController } from './controllers/checkout.controller';
import { stripeWebhookController } from './controllers/stripe.controller';

const app = express()
const port = 3000;

app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhookController)

app.use(express.json())


app.get('/users', listUsersController)
app.post('/users', createUserController)
app.get('/user/:userId', listOneUserController)
app.post('/todos', createTodoController)
app.post('/checkout', craeteCheckoutController)

app.listen(port, () => {
    console.log(`server is running on http//localhost: ${port}`);
});

