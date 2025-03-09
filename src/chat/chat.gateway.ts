import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users: { [socketId: string]: string } = {};

  // Handle new client connections
  handleConnection(client: Socket) {
    const username = `User${client.id.slice(0, 4)}`;
    this.users[client.id] = username;

    // Notify all clients about the new user
    client.broadcast.emit('user-connected', { username });

    // Send the list of connected users to the new client
    client.emit('user-list', Object.values(this.users));
  }

  // Handle client disconnections
  handleDisconnect(client: Socket) {
    const username = this.users[client.id];
    delete this.users[client.id];

    // Notify all clients about the disconnected user
    client.broadcast.emit('user-disconnected', { username });
  }

  // Handle incoming messages
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ) {
    const username = this.users[client.id];
    this.server.emit('message', {
      message: payload.message,
      username,
    });
  }
}
