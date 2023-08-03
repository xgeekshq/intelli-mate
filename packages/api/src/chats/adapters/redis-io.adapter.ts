import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { ServerOptions } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  constructor(
    app,
    private readonly configService: ConfigService,
    private readonly cacheClient
  ) {
    super(app);
  }
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = this.cacheClient;
    const subClient = pubClient.duplicate();

    await subClient.connect();

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    options.cors = { origin: this.configService.get('FRONTEND_ORIGIN_URL') };
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
