import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from 'src/setting/entities/setting.entity';
import { Contact } from './entities/contact.entity';
import { Project } from './entities/project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setting, Project, Contact])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
