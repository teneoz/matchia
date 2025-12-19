import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(userId: string, createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      userId,
    });

    return this.projectsRepository.save(project);
  }

  async findAll(userId: string, paginationDto: PaginationDto): Promise<[Project[], number]> {
    return this.projectsRepository.findAndCount({
      where: { userId },
      skip: paginationDto.skip,
      take: paginationDto.limit,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['predictions'],
    });

    if (!project) {
      throw new NotFoundException(`Projet avec l'ID ${id} non trouvé`);
    }

    if (project.userId !== userId) {
      throw new ForbiddenException('Vous n\'avez pas accès à ce projet');
    }

    return project;
  }

  async update(id: string, userId: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id, userId);
    Object.assign(project, updateProjectDto);
    return this.projectsRepository.save(project);
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOne(id, userId);
    await this.projectsRepository.remove(project);
  }
}
