import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { log } from 'console';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  private logger = new Logger(ChatGateway.name);
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const clientID = client.id;
    log(payload);
    this.logger.log(`message received from: ${clientID}`);
    client.emit('response', 'i dey with you');
  }
}
