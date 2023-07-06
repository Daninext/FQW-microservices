import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { UserService } from './user.service';
import { AuthGuard } from '../auth/strategy/auth.guard';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UserDto } from './entity/dto/user.dto';
import { Session } from '../auth/strategy/session.decorator';

@Controller('/user')
export class UserController {
  constructor(private usersService: UserService) {}

  @Post('/create')
  @UseGuards(new AuthGuard())
  async create(@Body() userDto: UserDto, @Session() session: SessionContainer) {
    const userId = session.getUserId();
    return await this.usersService.create(userDto, userId);
  }

  @UseGuards(new AuthGuard())
  @Get('/outerId/:id')
  async getByOuterId(@Param('id', ParseIntPipe) id: string) {
    return await this.usersService.findOneByOuterId(id);
  }
}
