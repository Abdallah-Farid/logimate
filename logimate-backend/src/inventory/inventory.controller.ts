import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreateInventoryDto } from './dto/create-inventory.dto';

@Controller('inventory')
@UseGuards(JwtAuthGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @UseGuards(new RolesGuard(['admin', 'manager']))
  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @UseGuards(new RolesGuard(['admin']))
  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @UseGuards(new RolesGuard(['admin']))
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInventoryDto: CreateInventoryDto,
  ) {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @UseGuards(new RolesGuard(['admin']))
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.inventoryService.delete(id);
  }
}
