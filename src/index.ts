import * as grpc from '@grpc/grpc-js';
import yargs from 'yargs';
import { UsersService } from './proto';
import { UsersServer } from "./server";

function serve(): void {
    const server = new grpc.Server();
    // @ts-ignore
    server.addService(UsersService, new UsersServer());
    server.bindAsync(`localhost:${process.env.SERVER_PORT ?? 5050}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            throw err;
        }
        console.log(`Listening on ${port}`);
        server.start();
    });
}

yargs
    .command({
        command: 'serve',
        describe: 'Start the gRPC server',
        builder: {
            
        },
        handler: serve,
    })
    .help().argv