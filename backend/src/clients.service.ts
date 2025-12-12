import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllClients() {
    return this.prisma.client.findMany();
  }

  async getClient(id: string) {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async createClient(data: { name: string; email: string; aiModel?: string }) {
    return this.prisma.client.create({
      data: {
        name: data.name,
        email: data.email,
        aiModel: data.aiModel || "claude-haiku-4.5",
      },
    });
  }

  async enableClaudeHaikuForAllClients() {
    const result = await this.prisma.client.updateMany({
      data: {
        aiModel: "claude-haiku-4.5",
      },
    });
    return {
      message: `Claude Haiku 4.5 enabled for ${result.count} clients`,
      count: result.count,
    };
  }
}
