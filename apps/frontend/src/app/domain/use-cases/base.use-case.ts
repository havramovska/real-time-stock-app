import { Observable } from 'rxjs';

export abstract class BaseUseCase<TRequest, TResponse> {
  abstract execute(request: TRequest): Observable<TResponse>;
}

export abstract class BaseUseCaseWithoutRequest<TResponse> {
  abstract execute(): Observable<TResponse>;
} 