'use strict'
const logout = new LogoutButton();
logout.action = exit => ApiConnector.logout(response => {
    if (response.success) {
        location.reload();
        return;
    }
});

ApiConnector.current(current => {
    if (current.success) {
        ProfileWidget.showProfile(current.data);
        return;
    }
});

const rates = new RatesBoard();
function ratesUpdate() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            rates.clearTable();
            rates.fillTable(response.data);
            return;
        }
    });
}
setInterval(ratesUpdate(), 60000);

const pNt = new MoneyManager();
pNt.addMoneyCallback = credit => ApiConnector.addMoney(credit, response => {
    if (response.success) {
        pNt.addMoneyAction();
        ProfileWidget.showProfile(response.data);
        return pNt.setMessage(true, 'Успешное пополнение счета на' + credit.currency + credit.amount);;
    }
    return pNt.setMessage(false, 'Ошибка: ' + response.error);
});

pNt.conversionMoneyCallback = exchange => ApiConnector.convertMoney(exchange, response => {
    if (response.success) {
        pNt.conversionMoneyAction();
        ProfileWidget.showProfile(response.data);
        return pNt.setMessage(true, 'Успешная конвертация суммы ' + exchange.fromCurrency + exchange.fromAmount);
    }
    return pNt.setMessage(false, 'Ошибка: ' + response.error);
});

pNt.sendMoneyCallback = debit => ApiConnector.transferMoney(debit, response => {
    if (response.success) {
        pNt.sendMoneyAction();
        ProfileWidget.showProfile(response.data);
        return pNt.setMessage(true, 'Успешный перевод ' + debit.currency + debit.amount + ' получателю ' + debit.to);
    }
    return pNt.setMessage(false, 'Ошибка: ' + response.error);
});

const favorite = new FavoritesWidget();
ApiConnector.getFavorites(response => {
    if (response.success) {
        favorite.clearTable();
        favorite.fillTable(response.data);
        pNt.updateUsersList(response.data);
        return;
    }
 });

 favorite.addUserCallback = addUser => ApiConnector.addUserToFavorites(addUser, response => {
    if (response.success) {
        favorite.clearTable();
        favorite.fillTable(response.data);
        pNt.updateUsersList(response.data);
        return pNt.setMessage(true, 'Добавлен новый пользователь #' + addUser.id + ': ' + addUser.name);
    }
    return pNt.setMessage(false, 'Ошибка: ' + response.error);
});

favorite.removeUserCallback = deletedUser => ApiConnector.removeUserFromFavorites(deletedUser, response => {
    if (response.success) {
        favorite.clearTable();
        favorite.fillTable(response.data);
        pNt.updateUsersList(response.data);
        return pNt.setMessage(true, 'Пользователь ' + deletedUser + ' удален');
    }
    return pNt.setMessage(false, 'Ошибка: ' + response.error);
});