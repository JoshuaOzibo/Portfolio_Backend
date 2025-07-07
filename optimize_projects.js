import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Project from "./models/project_model.js";

const optimizeProjects = async () => {
    try {
        // Connect to database with simplified options
        await mongoose.connect(process.env.DB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log('Connected to MongoDB');
        
        // Get all projects
        const projects = await Project.find({});
        console.log(`Found ${projects.length} projects to optimize`);
        
        // Update each project with image size
        for (const project of projects) {
            if (project.image && project.image.startsWith('data:image')) {
                const base64String = project.image.split(',')[1];
                const imageSize = Buffer.byteLength(base64String, 'base64');
                
                await Project.findByIdAndUpdate(project._id, {
                    imageSize: imageSize
                });
                
                console.log(`Updated project "${project.title}" with image size: ${(imageSize / 1024).toFixed(2)} KB`);
            }
        }
        
        // Create indexes
        console.log('Creating database indexes...');
        await Project.collection.createIndex({ title: 1 });
        await Project.collection.createIndex({ skills: 1 });
        await Project.collection.createIndex({ status: 1 });
        await Project.collection.createIndex({ featured: 1 });
        await Project.collection.createIndex({ createdAt: -1 });
        await Project.collection.createIndex({ status: 1, featured: 1 });
        
        console.log('Optimization completed successfully!');
        
    } catch (error) {
        console.error('Error during optimization:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

// Run optimization
optimizeProjects(); 