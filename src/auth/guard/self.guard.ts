import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException, // Importa o erro 403
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SelfGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const userIdFromToken = request.user.id;

    const userIdFromParams = +request.params.id;

    if (userIdFromToken === userIdFromParams) {
      return true;
    }

    throw new ForbiddenException(
      'Você não tem permissão para acessar este recurso.',
    );
  }
}
