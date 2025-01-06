import { Permissions } from '@/constants/permission.constants';
import { JwtClaimDto } from '@/dto/jwt-claim.dto';
import { MenuMapDto } from '@/dto/menu/menu-map.dto';
import { MenuDto } from '@/dto/menu/menu.dto';
import { IMenuService } from '@/service/interface/i.menu.service';
import { convertToDto } from '@/utils/dto-convert/convert-to-dto.util';
import { inject, injectable } from 'inversify';
import { get } from 'lodash';

@injectable()
export class MenuService implements IMenuService {
  public MENU_MAP: MenuMapDto[] = [
    {
      name: 'QUẢN LÝ ADMIN',
      isCollapsed: false,
      permissions: [Permissions.QUAN_LY_ADMIN],
      children: null,
      icon: null
    },
    {
      name: 'QUẢN LÝ BÀI ĐĂNG',
      isCollapsed: false,
      permissions: [Permissions.QUAN_LY_BAI_DANG],
      children: null,
      icon: null
    },
    {
      name: 'QUẢN LÝ NGƯỜI DÙNG',
      isCollapsed: false,
      permissions: [Permissions.QUAN_LY_NGUOI_DUNG],
      children: null,
      icon: null
    },
    {
      name: 'QUẢN LÝ YÊU CẦU',
      isCollapsed: false,
      permissions: [Permissions.QUAN_LY_YEU_CAU],
      children: null,
      icon: null
    },
    {
      name: 'QUẢN LÝ NGÀNH',
      isCollapsed: false,
      permissions: [Permissions.QUAN_LY_NGANH],
      children: null,
      icon: null
    },
    {
      name: 'TRẢ LỜI TIN NHẮN',
      isCollapsed: false,
      permissions: [Permissions.REPLY_MESSAGE],
      children: null,
      icon: null
    },
    {
      name: 'GỬI TIN NHẮN',
      isCollapsed: false,
      permissions: [Permissions.SEND_MESSAGE],
      children: null,
      icon: null
    }
  ];

  /**
   * * Check menu
   */
  async checkAndAddMenu(menu: MenuMapDto, permissionIds: string[]): Promise<MenuDto | null> {
    //Check if the menu have one of the permissions in the permissionIds?

    if (menu.permissions.some((permission) => permissionIds.includes(permission))) {
      console.log('menu.permissions', menu.permissions);
      let getMenu = new MenuDto();
      getMenu = { ...menu };
      getMenu.children = null;
      getMenu.isCollapsed = false;
      getMenu = convertToDto(MenuDto, getMenu);

      //Recursively check the children
      if (menu.children) {
        console.log('menu.children', menu.children);

        for (const child of menu.children) {
          const childMenu = await this.checkAndAddMenu(child, permissionIds);
          if (childMenu) {
            if (!getMenu.children) {
              getMenu.children = [];
            }
            getMenu.children.push(childMenu);
            getMenu.isCollapsed = true;
          }
        }
      }

      return getMenu;
    }

    return null;
  }

  /**
   * * Get the menu of the current user
   */
  async getMyMenu(user: JwtClaimDto): Promise<MenuDto[]> {
    const permissionIds = user.permissionIds;

    const result: MenuDto[] = [];

    for (const menu of this.MENU_MAP) {
      //Check if the menu have one of the permissions in the permissionIds?
      const getMenu = await this.checkAndAddMenu(menu, permissionIds);

      //console.log('getMenu', getMenu);

      if (getMenu) {
        result.push(getMenu);
      }
    }

    return result;
  }
}
