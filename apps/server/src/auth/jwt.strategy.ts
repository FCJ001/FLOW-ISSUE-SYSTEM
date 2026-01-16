import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'FLOW_SECRET_KEY',
    });
  }

  async validate(payload: any) {
    const user = await this.authService.validateUser(payload.userId);

    return {
      id: user?.id,
      roles: payload.roles,
    };
  }
}
