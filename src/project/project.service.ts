import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingException } from 'src/common/exceptions/settting.exception';
import { Repository } from 'typeorm';
import { ProjectDto } from './dto/project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(@InjectRepository(Project) private projectRepository: Repository<Project>) {}

  async create(projectDto: ProjectDto): Promise<ProjectDto> {
    const project: Project = this.projectRepository.create(projectDto);

    const createdProject = await this.projectRepository.save(project);
    return new ProjectDto({
      id: createdProject.id,
      name: createdProject.name,
      publishDate: createdProject.publishDate,
      endDate: createdProject.endDate,
    });
  }

  async findAll(): Promise<ProjectDto[]> {
    try {
      return await this.findAll();
    } catch (err) {
      throw new SettingException('Project Query Error', err.response);
    }
  }

  async findOne(id: number): Promise<Project> {
    try {
      const project: Project = await this.findOne(id);

      if (!project) {
        throw new NotFoundException({ reason: 'NOT_FOUND_ENTITY', message: 'Not found project' });
      }
      return project;
    } catch (err) {
      throw new SettingException('Project Query Error', err.response);
    }
  }

  async update(id: number, projectDto: ProjectDto): Promise<ProjectDto> {
    const project = await this.findOne(id);
    await this.projectRepository.update(id, projectDto);

    return new ProjectDto({
      id: project.id,
      name: project.name,
      publishDate: project.publishDate,
      endDate: project.endDate,
    });
  }

  async remove(id: number): Promise<ProjectDto> {
    const project = await this.findOne(id);
    await this.projectRepository.softDelete(id);

    return new ProjectDto({
      id: project.id,
      name: project.name,
      publishDate: project.publishDate,
      endDate: project.endDate,
    });
  }
}
