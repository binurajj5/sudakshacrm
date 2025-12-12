import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
} from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./clients.dto";

@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async getAllClients() {
    return this.clientsService.getAllClients();
  }

  @Get(":id")
  async getClient(@Param("id") id: string) {
    // Basic UUID validation
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException("Invalid UUID format");
    }
    return this.clientsService.getClient(id);
  }

  @Post()
  async createClient(@Body() data: CreateClientDto) {
    // Basic validation
    if (!data.name || !data.email) {
      throw new BadRequestException("Name and email are required");
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new BadRequestException("Invalid email format");
    }
    return this.clientsService.createClient(data);
  }

  @Post("enable-claude-haiku")
  async enableClaudeHaikuForAll() {
    return this.clientsService.enableClaudeHaikuForAllClients();
  }
}

