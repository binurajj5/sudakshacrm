import { Module, Controller, Get } from "@nestjs/common";

@Controller()
class HealthController {
  @Get("/health")
  health() {
    return { status: "ok" };
  }
}

@Module({
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
