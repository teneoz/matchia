import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiResponse as ApiResponseInterface } from '../../common/interfaces/api-response.interface';

@ApiTags('projects')
@ApiBearerAuth('JWT-auth')
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau projet' })
  @ApiResponse({ status: 201, description: 'Projet créé', type: ProjectResponseDto })
  async create(
    @CurrentUser() user: any,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.create(user.id, createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister mes projets' })
  @ApiResponse({ status: 200, description: 'Liste des projets', type: [ProjectResponseDto] })
  async findAll(
    @CurrentUser() user: any,
    @Query() paginationDto: PaginationDto,
  ): Promise<ApiResponseInterface<ProjectResponseDto[]>> {
    const [data, total] = await this.projectsService.findAll(user.id, paginationDto);
    return {
      success: true,
      data,
      meta: {
        page: paginationDto.page,
        limit: paginationDto.limit,
        total,
        totalPages: Math.ceil(total / paginationDto.limit),
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un projet par ID' })
  @ApiResponse({ status: 200, description: 'Projet trouvé', type: ProjectResponseDto })
  async findOne(@Param('id') id: string, @CurrentUser() user: any): Promise<ProjectResponseDto> {
    return this.projectsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un projet' })
  @ApiResponse({ status: 200, description: 'Projet mis à jour', type: ProjectResponseDto })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.update(id, user.id, updateProjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un projet' })
  @ApiResponse({ status: 204, description: 'Projet supprimé' })
  async remove(@Param('id') id: string, @CurrentUser() user: any): Promise<void> {
    return this.projectsService.remove(id, user.id);
  }
}
