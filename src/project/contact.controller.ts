import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeaders, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies, ManagePolicyHandler } from 'src/casl/policyhandler';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';

@ApiTags('Contact')
@ApiHeaders([{ name: 'XSRF-TOKEN', description: 'CSRF Token' }])
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PoliciesGuard)
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post(':projectid')
  @CheckPolicies(new ManagePolicyHandler())
  create(@Body() contactDto: ContactDto, @Param('projectid') projectid: string) {
    return this.contactService.create(contactDto, +projectid);
  }

  @Get()
  @CheckPolicies(new ManagePolicyHandler())
  findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  @CheckPolicies(new ManagePolicyHandler())
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(+id);
  }

  @Patch(':id')
  @CheckPolicies(new ManagePolicyHandler())
  update(@Param('id') id: string, @Body() contactDto: ContactDto) {
    return this.contactService.update(+id, contactDto);
  }

  @Delete(':id')
  @CheckPolicies(new ManagePolicyHandler())
  remove(@Param('id') id: string) {
    return this.contactService.remove(+id);
  }
}
