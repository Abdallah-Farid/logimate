import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepository.find();
  }

  async findOne(id: string): Promise<Inventory> {
    const item = await this.inventoryRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Inventory item with ID ${id} not found`);
    }
    return item;
  }

  async create(item: Partial<Inventory>): Promise<Inventory> {
    const newItem = this.inventoryRepository.create(item);
    return this.inventoryRepository.save(newItem);
  }

  async update(id: string, item: Partial<Inventory>): Promise<Inventory> {
    await this.findOne(id); // Check if item exists
    await this.inventoryRepository.update(id, item);
    return this.findOne(id); // Return the updated item
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id); // Check if item exists
    await this.inventoryRepository.delete(id);
  }
}
