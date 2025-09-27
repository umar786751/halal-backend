import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      console.error('❌ JWT Guard Error:', err);
      console.error('❌ JWT Guard User:', user);
      console.error('❌ JWT Guard Info:', info);
      throw new UnauthorizedException('Invalid or missing token');
    }
    return user;
  }
}
