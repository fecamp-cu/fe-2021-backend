import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Setting } from 'src/setting/entities/setting.entity';
import { UserModule } from 'src/user/user.module';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Contact } from './entities/contact.entity';
import { Project } from './entities/project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setting, Project, Contact]), UserModule],
  controllers: [ProjectController, ContactController],
  providers: [ProjectService, CaslAbilityFactory, ContactService],
})
export class ProjectModule {}
