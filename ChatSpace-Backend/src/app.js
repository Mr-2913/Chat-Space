import express from 'express';
import userRoutes from './routes/user.route.js';
import conversationRoutes from './routes/conversation.routes.js';
import messageRoutes from './routes/message.route.js'

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes)
export default app;