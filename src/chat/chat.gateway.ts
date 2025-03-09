import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
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

  private users: { [socketId: string]: string } = {}; // Store connected users

  // Handle new client connections
  handleConnection(client: Socket) {
    const username = `User${client.id.slice(0, 4)}`; // Generate a simple username
    this.users[client.id] = username;

    // Notify all clients about the new user
    this.server.emit('userConnected', { userId: client.id, username });

    // Send the list of connected users to the new client
    client.emit('userList', Object.values(this.users));
  }

  // Handle client disconnections
  handleDisconnect(client: Socket) {
    const username = this.users[client.id];
    delete this.users[client.id];

    // Notify all clients about the disconnected user
    this.server.emit('userDisconnected', { userId: client.id, username });
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): void {
    const username = this.users[client.id];
    // Broadcast the message to all connected clients
    this.server.emit('message', { message: data, userId: client.id, username });
  }
}
