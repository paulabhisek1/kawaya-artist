import { INavData } from '@coreui/angular';

export let navItems: INavData[] = [];

  navItems = [
     {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'fa fa-tachometer',
      attributes: { disabled: false }
    },
    {
      name: 'Upload Document',
      url: '/upload-document',
      icon: 'fa fa-file-text-o',
    },
    {
      name: 'Albums',
      url: '/album',
      icon: 'fa fa-folder',
      attributes: { disabled: false },
    },
    {
      name: 'Songs',
      url: '/song',
      icon: 'fa fa-music',
      attributes: {  disabled: false },
    },
    {
      name: 'Podcast',
      url: '/podcast',
      icon: 'fa fa-podcast',
      attributes: { disabled: false },
    },
  ];
