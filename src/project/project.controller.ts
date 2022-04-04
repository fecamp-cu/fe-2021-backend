import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { ProjectDto } from './dto/project.dto';
import { ProjectService } from './project.service';

@ApiTags('Project')
@ApiHeaders([{ name: 'XSRF-TOKEN', description: 'CSRF Token' }])
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @CheckPolicies(new ManagePolicyHandler())
  create(@Body() projectDto: ProjectDto) {
    return this.projectService.create(projectDto);
  }

  @Get()
  @CheckPolicies(new ManagePolicyHandler())
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  @CheckPolicies(new ManagePolicyHandler())
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies(new ManagePolicyHandler())
  update(@Param('id') id: string, @Body() projectDto: ProjectDto) {
    return this.projectService.update(+id, projectDto);
  }

  @Delete(':id')
  @CheckPolicies(new ManagePolicyHandler())
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
