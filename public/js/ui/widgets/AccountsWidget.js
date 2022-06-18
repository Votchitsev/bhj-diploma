/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) throw new Error('Get empty element');
    this.element = element;
    this.update();
    this.registerEvents();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccountBtn = this.element.querySelector('.create-account');
    createAccountBtn.addEventListener('click', () => {
      App.getModal('createAccount').open();
    });

    const accounts = document.querySelectorAll('.account');
    for (let i = 0; i < accounts.length; i++) {
      accounts.item(i).addEventListener('click', () => {
        this.onSelectAccount(accounts.item(i));
      });
    }
  }
  
  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      Account.list({ user_id: User.current().id }, (err, response) => {
        if (response.success) {
          this.clear();
          this.renderItem(response.data);
          this.registerEvents();
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const deleteElement = this.element.querySelectorAll('.account');
    if (deleteElement.length > 0) {
      for (let i = 0; i < deleteElement.length; i++) {
        deleteElement.item(i).remove();
      }
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const active = this.element.querySelector('.active');
    
    if (active) {
      active.className = 'account';
    }
    
    element.classList.add('active');
    App.showPage('transactions', { account_id: element.getAttribute('data-id') });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    let li = document.createElement('li');
    li.className = 'account';
    li.setAttribute('data-id', item.id);

    let a = document.createElement('a');
    a.href = "#";
    li.append(a);

    let accountName = document.createElement('span');
    accountName.textContent = item.name;
    a.append(accountName);

    a.append(' / ');
  
    let accountSum = document.createElement('span');
    accountSum.textContent = item.sum + ' ₽';
    a.append(accountSum);

    return li
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    for (let i = 0; i < data.length; i++) {
      this.element.append(this.getAccountHTML(data[i]));
    }
  }
}
