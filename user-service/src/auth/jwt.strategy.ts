import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:    process.env.JWT_SECRET || 'change_this_secret',
    });
  }

  async validate(payload: any) {
    // повертаємо дані, які потім потраплять у req.user
    return { id: payload.sub, role: payload.role };
  }
}
