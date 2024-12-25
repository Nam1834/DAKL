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
      name: 'Quản lý danh mục',
      isCollapsed: true,
      icon: null,
      permissions: [
        Permissions.QUAN_LY_TINH_TP,
        Permissions.QUAN_LY_LOAI_TAI_SAN,
        Permissions.QUAN_LY_TAI_SAN,
        Permissions.QUAN_LY_GOI_VAY
      ],
      children: [
        {
          name: 'Quản lý tỉnh thành phố',
          isCollapsed: false,
          permissions: [Permissions.QUAN_LY_TINH_TP],
          children: null,
          icon: null
        },
        {
          name: 'Quản lý loại tài sản',
          isCollapsed: false,
          permissions: [Permissions.QUAN_LY_LOAI_TAI_SAN],
          children: null,
          icon: null
        },
        {
          name: 'Quản lý tài sản',
          isCollapsed: false,
          permissions: [Permissions.QUAN_LY_TAI_SAN],
          children: null,
          icon: null
        },
        {
          name: 'Quản lý gói vay',
          isCollapsed: false,
          permissions: [Permissions.QUAN_LY_GOI_VAY],
          children: null,
          icon: null
        }
      ]
    }
  ];

  /**
   * * Check menu
   */
  async checkAndAddMenu(menu: MenuMapDto, permissionIds: string[]): Promise<MenuDto | null> {
    //Check if the menu have one of the permissions in the permissionIds?
    if (menu.permissions.some((permission) => permissionIds.includes(permission))) {
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
  async getMyMenu(admin: JwtClaimDto): Promise<MenuDto[]> {
    const permissionIds = admin.permissionIds;

    const result: MenuDto[] = [];

    for (const menu of this.MENU_MAP) {
      //Check if the menu have one of the permissions in the permissionIds?
      const getMenu = await this.checkAndAddMenu(menu, permissionIds);

      // console.log('getMenu', getMenu);

      if (getMenu) {
        result.push(getMenu);
      }
    }

    return result;
  }
}
