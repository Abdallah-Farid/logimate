import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Put, 
  Delete, 
  Param, 
  UseGuards, 
  Logger, 
  BadRequestException, 
  Request 
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UserPayload } from '../auth/auth.service';
import { Inventory } from './inventory.entity';

interface RequestWithUser extends Request {
  user: UserPayload;
}

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  private readonly logger = new Logger(InventoryController.name);

  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @Roles('admin', 'user')
  async findAll(@Request() req: RequestWithUser): Promise<Inventory[]> {
    this.logger.debug('Finding all inventory items');
    return this.inventoryService.findAll();
  }

  @Post()
  @Roles('admin')
  async create(
    @Request() req: RequestWithUser,
    @Body() createInventoryDto: CreateInventoryDto
  ): Promise<Inventory> {
    this.logger.debug('Creating inventory item:', createInventoryDto);
    return this.inventoryService.create(createInventoryDto);
  }

  @Get(':id')
  @Roles('admin', 'user')
  async findOne(
    @Request() req: RequestWithUser,
    @Param('id') id: string
  ): Promise<Inventory> {
    if (!id) {
      throw new BadRequestException('Inventory ID is required');
    }
    this.logger.debug(`Finding inventory item with ID: ${id}`);
    return this.inventoryService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  async update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateData: Partial<CreateInventoryDto>
  ): Promise<Inventory> {
    if (!id) {
      throw new BadRequestException('Inventory ID is required');
    }
    this.logger.debug(`Updating inventory item ${id}:`, updateData);
    return this.inventoryService.update(id, updateData);
  }

  @Delete(':id')
  @Roles('admin')
  async delete(
    @Request() req: RequestWithUser,
    @Param('id') id: string
  ): Promise<void> {
    if (!id) {
      throw new BadRequestException('Inventory ID is required');
    }
    this.logger.debug(`Deleting inventory item with ID: ${id}`);
    await this.inventoryService.delete(id);
  }
}
