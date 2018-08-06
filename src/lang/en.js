module.exports = {
  buttom: {
    cancel: 'cancel',
    determine: 'ok',
    login: 'login',
    signOut: 'signOut',
    registered: 'registered',
    search: 'search',
    submit: 'submit',
    save: 'save',
    rememberPW: 'Remember password'
  },
  optionMessage: {
    systemName: 'Back office management system',
    admin: 'ADMIN',
    pushButton: 'Accept push',
    hints: 'Switch skin',
    skin1: 'Dark Forest',
    skin2: 'Ivory',
    lang: 'Lang',
    zh: 'SChinese',
    zhCHT: 'TChinese',
    en: 'English'
  },
  message: {
    name: 'name',
    sex: 'sex',
    address: 'address',
    career: 'Career',
    date: 'date',
    accout: 'accout',
    password: 'passWord'
  },
  routers: [
    {path: 'user', router: true, title: 'User Management', icon: 'folder_shared', color: 'white', id: '1000'},
    {path: 'role', router: true, title: 'role management', icon: 'security', color: 'white', id: '2000'}
  ]
}
