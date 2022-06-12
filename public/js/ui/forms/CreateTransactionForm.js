/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const accountsSelect = this.element.querySelector('.accounts-select');
    Account.list({ user_id: User.current().id }, (err, response) => { 
      for (let i = 0; i < response.data.length; i++) {
        const option = document.createElement('option');
        option.value = response.data[i].id;
        option.textContent = response.data[i].name;
        accountsSelect.append(option);
      };
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response.success) {
        if (this.element.id == 'new-income-form') {
          this.element.reset();
          App.getModal('newIncome').close();
          App.update();
        }
      
        if (this.element.id == 'new-expense-form') {
          this.element.reset();
          App.getModal('newExpense').close();
          App.update();
        }
      }
    });
  }
}