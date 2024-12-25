import { JwtClaimDto } from '@/dto/jwt-claim.dto';
import { MenuDto } from '@/dto/menu/menu.dto';

export interface IMenuService {
  getMyMenu(admin: JwtClaimDto): Promise<MenuDto[]>;
}
