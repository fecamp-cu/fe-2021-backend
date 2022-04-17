import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WsNotifyService } from './ws-notify.service';

@WebSocketGateway()
export class WsGateway {
  constructor(private wsNotifyService: WsNotifyService) {}

  @SubscribeMessage('payment')
  handleMessage(@MessageBody('id') id: string): Promise<void> {
    return this.wsNotifyService.addListener(
      id,
      10 * 60 * 1000, // 10 min timeout
    );
  }

}
