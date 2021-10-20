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
        return pNt.setMessage(response.success, 'Ошибка пополнения счета');
    }
});

pNt.conversionMoneyCallback = exchange => ApiConnector.convertMoney(exchange, response => {
    if (response.success) {
        pNt.conversionMoneyAction();
        ProfileWidget.showProfile(response.data);
        return pNt.setMessage(response.success, 'Успешная конвертация');
    }
    else {
        return pNt.setMessage(response.success, 'Ошибка конвертации');
    }
});

pNt.sendMoneyCallback = debit => ApiConnector.transferMoney(debit, response => {
    if (response.success) {
        pNt.sendMoneyAction();
        ProfileWidget.showProfile(response.data);
        return pNt.setMessage(response.success, 'Успешный перевод средств');
    }
    else {
        return pNt.setMessage(response.success, 'Ошибка перевода средств');
    }
});