import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if(!process.env.SERVER_PORT){
    throw new BadRequestException('SERVER NO PORT')
  }else{
    console.log(`SERVER RUNNING ON PORT:${process.env.SERVER_PORT}`)
  }

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({origin:'http://54.252.183.128:3000'});/// http://localhost:3000
  await app.listen(process.env.SERVER_PORT || 4000);
}
bootstrap();
