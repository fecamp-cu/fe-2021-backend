import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Body() projectDto: ProjectDto) {
    return this.projectService.create(projectDto);
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() projectDto: ProjectDto) {
    return this.projectService.update(+id, projectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
