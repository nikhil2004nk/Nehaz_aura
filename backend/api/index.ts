import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';

let cachedServer: any;

export default async function handler(req: any, res: any) {
  try {
    if (!cachedServer) {
      const app = await NestFactory.create(AppModule);
      
      app.use(cookieParser());
      
      app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
      }));
      
      app.enableCors({
        origin: ['http://localhost:3000', 'https://nehaz-aura.vercel.app'],
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      });
      
      await app.init();
      cachedServer = app.getHttpAdapter().getInstance();
    }
    
    return cachedServer(req, res);
  } catch (error: any) {
    console.error('NestJS Serverless Error:', error);
    res.status(500).json({ 
      message: 'Internal Server Error during NestJS initialization', 
      error: error.message,
      stack: error.stack
    });
  }
}
