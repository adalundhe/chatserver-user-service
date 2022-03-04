import { IUsersServer} from '../proto';

export interface Client<T>{
    client: T;
}

export interface IServer extends IUsersServer {
    [key: string]: any;
}