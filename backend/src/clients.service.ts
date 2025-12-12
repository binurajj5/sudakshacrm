import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class ClientsService {
  private prisma = new PrismaClient();

  async getAllClients() {
    return this.prisma.client.findMany();
  }

  async getClient(id: string) {
    return this.prisma.client.findUnique({
      where: { id },
    });
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
