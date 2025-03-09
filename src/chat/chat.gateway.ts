import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { log } from 'console';

@WebSocketGateway()
export class ChatGateway {
  private logger = new Logger(ChatGateway.name);
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: any,
    @MessageBody() payload: any,
  ): string {
    const clientID = client.id;
    log(payload);
    this.logger.log(`message received from: ${clientID}`);
    return 'Hello world!';
  }
}
