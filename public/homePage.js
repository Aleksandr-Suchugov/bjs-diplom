'use strict'
const logout = new LogoutButton();
logout.action = exit => ApiConnector.logout(response => location.reload());