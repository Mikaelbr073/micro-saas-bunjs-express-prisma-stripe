import express from 'express'
import { createUserController, listOneUserController, listUsersController } from './controllers/user.controller';
import { createTodoController } from './controllers/todo.controller';

const app = express()
const port = 3000;

app.use(express.json())


app.get('/users', listUsersController)
app.post('/users', createUserController)
app.get('/user/:userId', listOneUserController)


app.post('/todos', createTodoController)

app.listen(port, () => {
    console.log(`server is running on http//localhost: ${port}`);
});

