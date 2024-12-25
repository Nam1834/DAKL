import { Expose } from 'class-transformer';

export class MenuDto {
  @Expose()
  name!: string;
  @Expose()
  isCollapsed!: boolean;
  @Expose()
  children: MenuDto[] | null = null;
  @Expose()
  icon: string | null = null;
}
