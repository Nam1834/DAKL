import { Type } from 'class-transformer';
import { ValidateNested, IsArray, IsOptional, IsString } from 'class-validator';
import { SearchDataDto } from './search-data.dto';

export class SearchMatchingTutor extends SearchDataDto {
  @IsArray()
  subjects!: string[];

  @IsString()
  mode!: 'ONLINE' | 'OFFLINE';

  @IsOptional()
  @IsString()
  location?: string;

  @IsArray()
  availableTimes!: string[];

  @IsOptional()
  @IsString()
  preferredGender?: 'MALE' | 'FEMALE';
}
