import { Injectable } from '@nestjs/common';

@Injectable()
export class WsNotifyService {
  resolver: { [id: string]: (x: any) => void } = {};

  addListener(id: string, timeout: number) {
    return new Promise<any>((resolve, reject) => {
      this.resolver[id] = resolve;
      setTimeout(() => {
        delete this.resolver[id];
        reject('websocket timeout');
      }, timeout);
    });
  }

  notify(id: string, output: any) {
    if (this.resolver[id] !== null && this.resolver[id] !== undefined) {
      this.resolver[id](output);
      delete this.resolver[id];
    }
  }
}
