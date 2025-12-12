import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ClientsService } from "./clients.service";

@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async getAllClients() {
    return this.clientsService.getAllClients();
  }

  @Get(":id")
  async getClient(@Param("id") id: string) {
    return this.clientsService.getClient(id);
  }

  @Post()
  async createClient(
    @Body() data: { name: string; email: string; aiModel?: string }
  ) {
    return this.clientsService.createClient(data);
  }

  @Post("enable-claude-haiku")
  async enableClaudeHaikuForAll() {
    return this.clientsService.enableClaudeHaikuForAllClients();
  }
}
