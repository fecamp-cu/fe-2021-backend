import { Injectable } from '@nestjs/common';
import { ProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
  create(projectDto: ProjectDto) {
    return 'This action adds a new project';
  }

  findAll() {
    return `This action returns all project`;
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
