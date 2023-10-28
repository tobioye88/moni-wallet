import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './controllers/users.controller';
import { User, UserSchema } from './entities/user.entity';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: User.name, useFactory: () => UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
