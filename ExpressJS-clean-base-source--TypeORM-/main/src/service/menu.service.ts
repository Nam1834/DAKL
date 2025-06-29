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
      icon: 'fa-solid fa-user-pen'
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
      permissions: [Permissions.QUAN_LY_YEU_CAU, Permissions.RUT_TIEN],
      children: [
        {
          name: 'TÀI KHOẢN GIA SƯ',
          isCollapsed: false,
          permissions: [Permissions.QUAN_LY_YEU_CAU],
          children: null,
          icon: null
        },
        {
          name: 'RÚT TIỀN',
          isCollapsed: false,
          permissions: [Permissions.RUT_TIEN],
          children: null,
          icon: null
        }
      ],
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
          icon: null
        }
      ],
      icon: 'fa-solid fa-list'
    },
    {
      name: 'GIÁO TRÌNH',
      isCollapsed: false,
      permissions: [Permissions.QUAN_LY_GIAO_TRINH],
      children: null,
      icon: 'fa-solid fa-book'
    },
    {
      name: 'NẠP VÍ NGƯỜI DÙNG',
      isCollapsed: false,
      permissions: [Permissions.QUAN_LY_VI_NGUOI_DUNG],
      children: null,
      icon: 'fa-solid fa-wallet'
    },
    {
      name: 'THU NHẬP GIA SƯ',
      isCollapsed: false,
      permissions: [Permissions.QUAN_LY_THANH_TOAN_CHO_GIA_SU],
      children: null,
      icon: 'fa-solid fa-money-check-dollar'
    },
    {
      name: 'ĐÁNH GIÁ',
      isCollapsed: false,
      permissions: [Permissions.QUAN_LY_DANH_GIA],
      children: null,
      icon: 'fa-solid fa-star'
    },
    {
      name: 'THỐNG KÊ',
      isCollapsed: false,
      permissions: [
        Permissions.THONG_KE_LUOT_THUE,
        Permissions.THONG_KE_DOANH_THU_GIA_SU,
        Permissions.THONG_KE_DOANH_THU,
        Permissions.THONG_KE_DANH_GIA_GIA_SU
      ],
      children: [
        {
          name: 'DOANH THU GIASUVLU',
          isCollapsed: false,
          permissions: [Permissions.THONG_KE_DOANH_THU],
          children: null,
          icon: null
        },
        {
          name: 'LƯỢT THUÊ GIA SƯ',
          isCollapsed: false,
          permissions: [Permissions.THONG_KE_LUOT_THUE],
          children: null,
          icon: null
        },
        {
          name: 'DOANH THU GIA SƯ',
          isCollapsed: false,
          permissions: [Permissions.THONG_KE_DOANH_THU_GIA_SU],
          children: null,
          icon: null
        },
        {
          name: 'ĐÁNH GIÁ GIA SƯ',
          isCollapsed: false,
          permissions: [Permissions.THONG_KE_DANH_GIA_GIA_SU],
          children: null,
          icon: null
        }
      ],
      icon: 'fa-solid fa-chart-simple'
    },

    // User
    {
      name: 'HEADER MENU',
      isCollapsed: false,
      permissions: [Permissions.HEADER_MENU],
      children: [
        {
          name: 'TRANG CHỦ',
          isCollapsed: false,
          permissions: [Permissions.TRANG_CHU],
          children: null,
          icon: null
        },
        {
          name: 'VỀ CHÚNG TÔI',
          isCollapsed: false,
          permissions: [Permissions.VE_CHUNG_TOI],
          children: null,
          icon: null
        },
        {
          name: 'QUY ĐỊNH',
          isCollapsed: false,
          permissions: [Permissions.QUY_DINH],
          children: null,
          icon: null
        },
        {
          name: 'TÌM KIẾM GIA SƯ',
          isCollapsed: false,
          permissions: [Permissions.TIM_KIEM_GIA_SU],
          children: null,
          icon: null
        },
        {
          name: 'ĐĂNG KÝ LÀM GIA SƯ',
          isCollapsed: false,
          permissions: [Permissions.DANG_KY_LAM_GIA_SU],
          children: null,
          icon: null
        }
      ],
      icon: 'fa-solid fa-list'
    },
    {
      name: 'SETTING MENU',
      isCollapsed: false,
      permissions: [Permissions.SETTING_MENU],
      children: [
        {
          name: 'HỒ SƠ HỌC VIÊN',
          isCollapsed: false,
          permissions: [Permissions.HO_SO_HOC_VIEN],
          children: null,
          icon: null
        },
        {
          name: 'GIA SƯ YÊU THÍCH',
          isCollapsed: false,
          permissions: [Permissions.GIA_SU_YEU_THICH],
          children: null,
          icon: null
        },
        {
          name: 'HỒ SƠ GIA SƯ',
          isCollapsed: false,
          permissions: [Permissions.HO_SO_GIA_SU],
          children: null,
          icon: null
        },
        {
          name: 'VÍ CÁ NHÂN',
          isCollapsed: false,
          permissions: [Permissions.VI_CA_NHAN],
          children: null,
          icon: null
        },
        {
          name: 'YÊU CẦU THUÊ',
          isCollapsed: false,
          permissions: [Permissions.YEU_CAU_THUE],
          children: null,
          icon: null
        },
        {
          name: 'GIÁO TRÌNH CÁ NHÂN',
          isCollapsed: false,
          permissions: [Permissions.GIAO_TRINH_CA_NHAN],
          children: null,
          icon: null
        }
      ],
      icon: 'fa-solid fa-list'
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
