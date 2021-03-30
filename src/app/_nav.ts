import { INavData } from '@coreui/angular';

// const isActive: any = localStorage.getItem('is_active');
const isActive: any = 0;
export let navItems: INavData[] = [];

if(isActive == 1) {
  navItems = [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      attributes: { disabled: isActive == 1 ? false : true },
    },
    {
      name: 'Upload Document',
      url: '/upload-document',
      icon: 'fa fa-file-text-o',
    },
  ];
}
else{
  navItems = [
    {
      name: 'Upload Document',
      url: '/upload-document',
      icon: 'fa fa-file-text-o',
    },
  ];
}
