/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error('Get empty element.');
    }
    this.element = element;
    this.lastOptions = null;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      
      if (e.target.closest('.remove-account')) {
        this.removeAccount();
      };

      if (e.target.closest('.transaction__remove')) {
        this.removeTransaction(e.target.closest('.transaction__remove').getAttribute('data-id'));
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (confirm('Вы действительно хотите удалить счёт?')) {
      Account.remove({ id: this.lastOptions.account_id }, (err, response) => {
        if (response.success) {
        App.updateWidgets();
        App.updateForms();
        this.clear();
        }
      });
    }
  }
  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if (confirm('Вы действительно хотите удалить транзакцию?')) {
      Transaction.remove({ id }, (err, response) => {
        if (response.success) {
          App.update();
        }
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (options) {
      this.lastOptions = options;
      this.clear();
      Account.get(options.account_id, (err, response) => {
        if (response.success) {
          this.renderTitle(response.data.name);
          
        }
      });
      Transaction.list({ account_id: options.account_id }, (err, response) => {
        if (response.success) {
          this.renderTransactions(response.data);
        } 
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    const content = this.element.querySelector('.content');
    while (content.firstChild) {
      content.removeChild(content.firstChild);
    }
    const title = this.element.querySelector('.content-title');
    title.textContent = 'Название счёта';
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    this.element.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const parsedDate = new Date(date);
    const months = [
      'января', 'февраля', 'марта',
      'апреля', 'мая', 'июня', 
      'июля', 'августа', 'сентября',
      'октября', 'ноября', 'декабря'
    ];
    return `${parsedDate.getDate()} ${months[parsedDate.getMonth()]} ${parsedDate.getFullYear()} г.
    в ${parsedDate.getHours()}:${parsedDate.getMinutes()}`
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const transaction = document.createElement('div');
    transaction.className = 'transaction row';

    if (item.type == 'income') {
      transaction.classList.add('transaction_income');
    }

    if (item.type == 'expense') {
      transaction.classList.add('transaction_expense');
    }

    const transactionDetails = document.createElement('div');
    transactionDetails.className = 'col-md-7 transaction__details';

    const transactionIcon = document.createElement('div');
    transactionIcon.className = 'transaction__icon';

    const faMoney = document.createElement('span');
    faMoney.className = 'fa fa-money fa-2x';
    transactionIcon.append(faMoney);

    const transactionInfo = document.createElement('div');
    transactionInfo.className = 'transaction__info';

    const transactionTitle = document.createElement('h4');
    transactionTitle.className = 'transaction__title';
    transactionTitle.textContent = item.name;
    transactionInfo.append(transactionTitle);

    const transactionDate = document.createElement('div');
    transactionDate.className = 'transaction__date';
    transactionDate.textContent = this.formatDate(item.created_at);
    transactionInfo.append(transactionDate);

    transactionDetails.append(transactionIcon);
    transactionDetails.append(transactionInfo);

    transaction.append(transactionDetails);

    const colMd3 = document.createElement('div');
    colMd3.className = 'col-md-3';

    const transactionSumm = document.createElement('div');
    transactionSumm.className = 'transaction__summ';
    transactionSumm.textContent = item.sum;

    const currency = document.createElement('span');
    currency.className = 'currency';
    currency.textContent = '₽';
    transactionSumm.append(currency);
    colMd3.append(transactionSumm);

    transaction.append(colMd3);

    const transactionControls = document.createElement('div');
    transactionControls.className = 'col-md-2 transaction__controls';

    const transactionRemove = document.createElement('button');
    transactionRemove.className = 'btn btn-danger transaction__remove';
    transactionRemove.setAttribute('data-id', item.id);

    const faTrash = document.createElement('i');
    faTrash.className = 'fa fa-trash';
    transactionRemove.append(faTrash);

    transactionControls.append(transactionRemove);

    transaction.append(transactionControls);

    return transaction;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const content = this.element.querySelector('.content');
    for (let i = 0; i < data.length; i++) {
      content.append(this.getTransactionHTML(data[i]));
    }
  }
}
