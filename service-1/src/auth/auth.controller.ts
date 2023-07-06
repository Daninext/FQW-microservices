import {
  Controller,
  Get,
  Post,
  Redirect,
  Render,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './strategy/auth.guard';
import { Session } from './strategy/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import { UserService } from '../user/user.service';

@Controller('/auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Get('')
  @Render('auth')
  root() {
    return;
  }

  @Post('/compare')
  @UseGuards(new AuthGuard())
  async compare(@Session() session: SessionContainer) {
    const userId = session.getUserId();

    const username = await this.userService
      .findOneByOuterId(userId)
      .then((user) => user.username);
    await session.mergeIntoAccessTokenPayload({
      username: username,
    });

    return;
  }

  @Get('/logout')
  @Redirect('/auth')
  @UseGuards(new AuthGuard())
  async logout(@Session() session: SessionContainer) {
    await session.revokeSession();
    return;
  }
}
