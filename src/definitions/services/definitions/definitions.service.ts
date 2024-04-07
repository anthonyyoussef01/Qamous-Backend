import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Definition } from '../../../typeorm/entities/definition';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { CreateDefinitionDto } from '../../dtos/create-definition.dto';
import { UpdateDefinitionDto } from '../../dtos/update-definition.dto';

@Injectable()
export class DefinitionsService {
  constructor(
    @InjectRepository(Definition)
    private definitionsRepository: Repository<Definition>,
  ) {}

  async getDefinitions(): Promise<Definition[]> {
    return this.definitionsRepository.find();
  }

  async getMostLikedDefinitions(): Promise<Definition[]> {
    return this.definitionsRepository
      .createQueryBuilder('definition')
      .leftJoinAndSelect('definition.word', 'word')
      .select('definition.wordId', 'wordId')
      .addSelect('definition.isArabic', 'isArabic')
      .addSelect(
        '(definition.likeCount - definition.dislikeCount)',
        'totalLikes',
      )
      .addSelect('word.arabicWord', 'arabicWord')
      .addSelect('word.francoArabicWord', 'francoArabicWord')
      .addSelect('MAX(definition.definition)', 'definition')
      .groupBy('definition.wordId')
      .addGroupBy('definition.isArabic')
      .orderBy('totalLikes', 'DESC')
      .getRawMany();
  }

  async getDefinitionById(id: number): Promise<Definition> {
    return this.definitionsRepository.findOne({
      where: { id },
    });
  }

  async createDefinition(
    createDefinitionDto: CreateDefinitionDto,
  ): Promise<Definition> {
    const newDefinition =
      this.definitionsRepository.create(createDefinitionDto);
    return this.definitionsRepository.save(newDefinition);
  }

  async updateDefinitionById(
    id: number,
    updateDefinitionDto: UpdateDefinitionDto,
  ): Promise<UpdateResult> {
    return this.definitionsRepository.update(id, updateDefinitionDto);
  }

  async deleteDefinitionById(id: number): Promise<DeleteResult> {
    return this.definitionsRepository.delete(id);
  }
}
