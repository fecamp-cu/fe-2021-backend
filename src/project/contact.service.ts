import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingException } from 'src/common/exceptions/settting.exception';
import { Repository } from 'typeorm';
import { ContactDto } from './dto/contact.dto';
import { Contact } from './entities/contact.entity';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';

export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private readonly projectService: ProjectService,
  ) {}

  async create(contactDto: ContactDto, projectid: number): Promise<ContactDto> {
    const contact: Contact = await this.contactRepository.create(contactDto);
    const project: Project = await this.projectService.findOne(projectid);
    contact.project = project;
    const createdcontact = await this.contactRepository.save(contact);

    return new ContactDto({
      id: createdcontact.id,
      name: createdcontact.name,
      email: createdcontact.email,
      tel: createdcontact.tel,
      isLeader: createdcontact.isLeader,
    });
  }
  async findAll(): Promise<ContactDto[]> {
    try {
      return await this.contactRepository.find();
    } catch (error) {
      throw new SettingException('Failed to find all contact', error.response.status);
    }
  }
  async findOne(id: number, relations: string[] = []): Promise<ContactDto> {
    const contact: Contact = await this.contactRepository.findOne(id, {
      relations,
    });
    if (!contact) {
      throw new NotFoundException({
        reason: 'NOT_FOUND_ENTITY',
        message: 'Not found contact',
      });
    }
    return new ContactDto({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      tel: contact.tel,
      isLeader: contact.isLeader,
    });
  }
  async update(id: number, contactDto: ContactDto, relations: string[] = []): Promise<ContactDto> {
    const contact: ContactDto = await this.findOne(id, relations);
    await this.contactRepository.update(id, contactDto);

    return contact;
  }

  async remove(id: number): Promise<ContactDto> {
    const contact: ContactDto = await this.findOne(id);
    await this.contactRepository.softDelete(id);

    return contact;
  }
}
