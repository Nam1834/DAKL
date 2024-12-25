import { MenuDto } from '@/dto/menu/menu.dto';

export class MenuMapDto {
  name!: string;
  isCollapsed!: boolean;
  children: MenuMapDto[] | null = null;
  permissions!: string[];
  icon: string | null = null;
}
