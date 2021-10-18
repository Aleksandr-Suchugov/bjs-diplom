'use strict'
const userForm = new UserForm();
const serverCall = new ApiConnector();
userForm.loginFromCallback = (data) => {
    try {
        serverCall.login(userForm.getData(data), userForm.loginFormAction());
        
    }
    catch (message) {
        console.alert(userForm.setLoginErrorMessage(message));
    }
    location.reload();
}
userForm.registerFormCallback = (addData) => {
    try {
        serverCall.register(userForm.getData(addData), userForm.registerFormAction());
        
    }
    catch (message) {
        console.alert(userForm.setRegisterErrorMessage(message));
    }
    location.reload();
}