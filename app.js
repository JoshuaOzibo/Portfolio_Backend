import dotenv from 'dotenv';
dotenv.config();
import express from 'express'; 
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRouter from './route/auth_Router.js';
import projectRoute from './route/project_Router.js';
import connectDb from './DataBase/mongo_db.js';
import { errorHandler, notFound} from './middleware/errorHandler.js';
import skillRoute from './route/skill_Route.js';
import socialRoute from './route/social_Router.js';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', projectRoute);
app.use('/api/v1/skills', skillRoute);
app.use('/api/v1/socials', socialRoute);
// Handle undefined routes
app.use(notFound);

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5050;

// Start server after database connection
const startServer = async () => {
    try {
        await connectDb();
        
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();