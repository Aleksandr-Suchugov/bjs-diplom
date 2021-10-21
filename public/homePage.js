'use strict'
const logout = new LogoutButton();
logout.action = exit => ApiConnector.logout(response => location.reload());

ApiConnector.current(current => {
    if (current.success) {
        ProfileWidget.showProfile(current.data)
    }
});

const rates = new RatesBoard();
function ratesUpdate() {
    ApiConnector.getStocks(response => {
        rates.clearTable();
        rates.fillTable(response.data);
    });
}
setInterval(ratesUpdate(), 60000);

const pNt = new MoneyManager();
pNt.addMoneyCallback = credit => ApiConnector.addMoney(credit, response => {
    if (response.success) {
        pNt.addMoneyAction();
        ProfileWidget.showProfile(response.data);
        return pNt.setMessage(response.success, 'Успешное пополнение счета');
    }
    else {
        return pNt.setMessage(response.success, 'Ошибка: ' + response.error);
    }
});

pNt.conversionMoneyCallback = exchange => ApiConnector.convertMoney(exchange, response => {
    if (response.success) {
        pNt.conversionMoneyAction();
        ProfileWidget.showProfile(response.data);
        return pNt.setMessage(response.success, 'Успешная конвертация');
    }
    else {
        return pNt.setMessage(response.success, 'Ошибка: ' + response.error);
    }
});

pNt.sendMoneyCallback = debit => ApiConnector.transferMoney(debit, response => {
    if (response.success) {
        pNt.sendMoneyAction();
        ProfileWidget.showProfile(response.data);
        return pNt.setMessage(response.success, 'Успешный перевод средств');
    }
    else {
        return pNt.setMessage(response.success, 'Ошибка: ' + response.error);
    }
});

const favorite = new FavoritesWidget();
ApiConnector.getFavorites(response => {
    if (response.success) {
        favorite.clearTable();
        favorite.fillTable(response.data);
        pNt.updateUsersList(response.data);
    }
 });

 favorite.addUserCallback = addUser => ApiConnector.addUserToFavorites(addUser, response => {
    if (response.success) {
        favorite.clearTable();
        favorite.fillTable(response.data);
        pNt.updateUsersList(response.data);
        pNt.setMessage(response.success, 'Добавлен новый пользователь');
    }
    else pNt.setMessage(response.success, 'Ошибка: ' + response.error);
});

favorite.removeUserCallback = deleteUser => ApiConnector.removeUserFromFavorites(deleteUser, response => {
    if (response.success) {
        favorite.clearTable();
        favorite.fillTable(response.data);
        pNt.updateUsersList(response.data);
        pNt.setMessage(response.success, 'Пользователь удален');
    }
    else pNt.setMessage(response.success, 'Ошибка: ' + response.error);
});