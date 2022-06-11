/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {

    const sidebar = document.querySelector('.sidebar-mini');
    const sidebarToggle = document.querySelector('.sidebar-toggle');

    sidebarToggle.addEventListener('click', (e) => {
      
      e.preventDefault();
      
      if (sidebar.classList.contains("sidebar-open")) {
        sidebar.classList.remove('sidebar-open');
        sidebar.classList.remove('sidebar-collapse');
        return
      }

      sidebar.classList.add('sidebar-open');
      sidebar.classList.add('sidebar-collapse');
    })
    
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const entryBtn = document.querySelector('.menu-item_login');
    const logoutBtn = document.querySelector('.menu-item_logout')
    const registerBtn = document.querySelector('.menu-item_register');
    
    entryBtn.addEventListener('click', () => {
      App.getModal('login').open();
    });

    logoutBtn.addEventListener('click', () => {
      User.logout((err, response) => {
        if (response.success) {
          App.setState('init');
        };
      });
    })

    registerBtn.addEventListener('click', () => {
      App.getModal('register').open();
    });
  }
}