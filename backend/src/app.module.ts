import { Module, Controller, Get } from "@nestjs/common";
import { ClientsController } from "./clients.controller";
import { ClientsService } from "./clients.service";
import { PrismaService } from "./prisma.service";

@Controller()
class HealthController {
  @Get("/health")
  health() {
    return { status: "ok" };
  }
}

@Module({
  controllers: [HealthController, ClientsController],
  providers: [ClientsService, PrismaService],
})
export class AppModule {}
