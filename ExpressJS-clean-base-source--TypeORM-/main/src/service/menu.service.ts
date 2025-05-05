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
      name: 'TÀI KHOẢN',
      isCollapsed: false,
      permissions: [Permissions.QUAN_LY_ADMIN, Permissions.QUAN_LY_NGUOI_HOC, Permissions.QUAN_LY_GIA_SU],
      children: [
        {
          name: 'NHÂN VIÊN',
          isCollapsed: false,
          permissions: [Permissions.QUAN_LY_ADMIN],
          children: null,
          icon: null
        },
        {
          name: 'NGƯỜI HỌC',
          isCollapsed: false,
          permissions: [Permissions.QUAN_LY_NGUOI_HOC],
          children: null,
          icon: null
        },
        {
          name: 'GIA SƯ',
          isCollapsed: false,
          permissions: [Permissions.QUAN_LY_GIA_SU],
          children: null,
          icon: null
        }
      ],
      icon: 'fa-solid fa-user-tie'
    },

    // {
    //   name: 'BÀI ĐĂNG',
    //   isCollapsed: false,
    //   permissions: [Permissions.QUAN_LY_BAI_DANG],
    //   children: null,
    //   icon: 'fa-regular fa-newspaper'
    // },

    {
      name: 'YÊU CẦU',
      isCollapsed: false,
      permissions: [Permissions.QUAN_LY_YEU_CAU],
      children: null,
      icon: 'fa-regular fa-paper-plane'
    },
    {
      name: 'DANH MỤC',
      isCollapsed: false,
      permissions: [Permissions.QUAN_LY_NGANH],
      children: [
        {
          name: 'NGÀNH',
          isCollapsed: false,
          permissions: [Permissions.QUAN_LY_NGANH],
          children: null,
          icon: null
        },
        {
          name: 'MÔN HỌC',
          isCollapsed: false,
          permissions: [Permissions.QUAN_LY_MON_HOC],
          children: null,
          icon: null
        },
        {
          name: 'HẠNG GIA SƯ',
          isCollapsed: false,
          permissions: [Permissions.QUAN_LY_HANG_GIA_SU],
          children: null,
          icon: null
        },
        {
          name: 'GÓI THANH TOÁN',
          isCollapsed: false,
          permissions: [Permissions.QUAN_LY_GOI_THANH_TOAN],
          children: null,
          icon: 'fa-solid fa-hand-holding-dollar'
        }
      ],
      icon: 'fa-solid fa-list'
    },
    {
      name: 'GIÁO TRÌNH',
      isCollapsed: false,
      permissions: [Permissions.QUAN_LY_GIAO_TRINH],
      children: null,
      icon: null
    },
    {
      name: 'NẠP VÍ NGƯỜI DÙNG',
      isCollapsed: false,
      permissions: [Permissions.QUAN_LY_VI_NGUOI_DUNG],
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
