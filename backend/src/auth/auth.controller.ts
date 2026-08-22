import { Controller, Post, Body, Res, Req, UnauthorizedException, Get, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import type { Response, Request } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.register(registerDto);
    this.setCookies(res, tokens.access_token, tokens.refresh_token);
    return { success: true, message: 'Registration successful' };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.validateUser(loginDto.phone, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.authService.login(user);
    this.setCookies(res, tokens.access_token, tokens.refresh_token);
    return { success: true, message: 'Login successful' };
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }
    
    const tokens = await this.authService.refresh(refreshToken);
    this.setCookies(res, tokens.access_token, undefined); // keep existing refresh token
    return { success: true, message: 'Token refreshed' };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { success: true, message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: any) {
    const user = await this.usersService.findById(req.user.id);
    const { password, ...result } = user;
    return { success: true, data: result };
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(@Req() req: any, @Body() updateData: any) {
    const user = await this.usersService.update(req.user.id, {
      name: updateData.name,
      email: updateData.email,
      phone: updateData.phone,
    });
    const { password, ...result } = user;
    return { success: true, data: result, message: 'Profile updated successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req: any, @Body() body: any) {
    await this.authService.changePassword(req.user.id, body.oldPassword, body.newPassword);
    return { success: true, message: 'Password changed successfully' };
  }

  private setCookies(res: Response, accessToken: string, refreshToken?: string) {
    const cookieOptions = {
      httpOnly: true,
      secure: true, // Required for SameSite=None
      sameSite: 'none' as const, // Required for cross-origin cookies
      path: '/',
    };

    if (accessToken) {
      res.cookie('access_token', accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
    }

    if (refreshToken) {
      res.cookie('refresh_token', refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }
  }
}
