import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { ThirdPartyModule } from 'src/third-party/third-party.module';
import { UserModule } from 'src/user/user.module';
import { Profile } from './entities/profile.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), UserModule, ThirdPartyModule],
  controllers: [ProfileController],
  providers: [ProfileService, CaslAbilityFactory],
  exports: [ProfileService],
})
export class ProfileModule {}
