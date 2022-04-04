import { Injectable } from '@nestjs/common';
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
      return await this.projectRepository.find();
    } catch (err) {
      throw new SettingException('Project Query Error', err.response);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, projectDto: ProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
