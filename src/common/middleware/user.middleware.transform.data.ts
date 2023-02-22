import { Injectable, NestMiddleware } from "@nestjs/common";

@Injectable()

export class UserMiddlewareTransformData implements NestMiddleware{
    use(req: Request, res: Response, next: (error?: any) => void) {
        next()
    }
}