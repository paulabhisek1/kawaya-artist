import { INavData } from '@coreui/angular';

const isActive: any = localStorage.getItem('active_status');
console.log(isActive)
export let navItems: INavData[] = [];

  navItems = [
     {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'fa fa-file-text-o',
      attributes: { disabled: isActive == 1 ? false : true }
    },
    {
      name: 'Upload Document',
      url: '/upload-document',
      icon: 'fa fa-file-text-o',
    },
    {
      name: 'Albums',
      url: '/album',
      icon: 'fa fa-file-text-o',
      attributes: { disabled: isActive == 1 ? false : true },
    },
    {
      name: 'Songs',
      url: '/song',
      icon: 'fa fa-file-text-o',
      attributes: { disabled: isActive == 1 ? false : true },
    },
    {
      name: 'Podcast',
      url: '/podcast',
      icon: 'fa fa-podcast',
      attributes: { disabled: isActive == 1 ? false : true },
    },
  ];
