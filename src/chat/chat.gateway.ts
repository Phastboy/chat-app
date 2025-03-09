import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
    this.server.emit('user-connected', { username });

    // Send the list of connected users to the new client
    client.emit('user-list', Object.values(this.users));
  }

  // Handle client disconnections
  handleDisconnect(client: Socket) {
    const username = this.users[client.id];
    delete this.users[client.id];

    // Notify all clients about the disconnected user
    this.server.emit('user-disconnected', { username });
  }

  // Handle incoming messages
  handleMessage(client: Socket, payload: any) {
    const username = this.users[client.id];
    this.server.emit('message', {
      message: payload.message,
      username,
    });
  }
}
