import { Controller } from '@nestjs/common';
import { TokenService } from '../services/token.service';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
}
