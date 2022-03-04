
import * as grpc from '@grpc/grpc-js';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { IServer, Client } from './types/server';
import { UserName, User } from './proto';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid'




export class UsersServer implements IServer, Client<PrismaClient> {
    client: PrismaClient;

    constructor(){
        this.client = new PrismaClient();
    }

    async getUser(call: grpc.ServerDuplexStream<UserName, User>): Promise<void> {

        call.on('data', async (userName: UserName) => {

            const request = await userName.toObject();
            const foundUser = await this.client.user.findUnique({
                where: {
                    name: request.name
                }
            });
            
            const user = new User();
            await user.setId(foundUser?.id as string);
            await user.setName(foundUser?.name as string);
            await user.setTokensList(foundUser?.tokens as string[]);
            
            call.write(user);
        });

        call.on('end', () => call.end());
    }

    async createOrUpdateUser(call: grpc.ServerDuplexStream<User, UserName>): Promise<void>{

        call.on('data', async (user: User) => {
            const request = await user.toObject();
            const createdUser = await this.client.user.upsert({
                where: {
                    name: request.name
                },
                create: {
                    id: uuidv4(),
                    name: request.name,
                    tokens: []
                },
                update: {
                    tokens: request.tokensList
                }
            });

            const userName = new UserName();
            await userName.setName(createdUser.name);

            call.write(userName);
        });

        call.on('end', () => call.end());
    }

    async deleteUser(call: grpc.ServerDuplexStream<UserName, Empty>): Promise<void> {
        call.on('data', async (userName: UserName) => {
            const request = await userName.toObject();
            await this.client.user.delete({
                where: {
                    name: request.name
                }
            });

            const empty = new Empty();
            call.write(empty);

        });

        call.on('end', () => call.end());
    }

};