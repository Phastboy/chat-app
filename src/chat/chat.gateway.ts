import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { log } from 'console';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger(ChatGateway.name);

  handleConnection(client: any, ...args: any[]) {
    this.logger.log('new user connected');
  }
  handleDisconnect(client: any) {
    this.logger.log('user left');
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const clientID = client.id;
    const message = 'yo! fans';
    log(payload);
    this.logger.log(`message received from: ${clientID}`);
    client.emit('response', 'i dey with you');
    this.server.emit('message', { message, userId: clientID });
  }
}
