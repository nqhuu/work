let account = 'http://localhost:3000/account';
let categoty = 'http://localhost:3000/category';
let handleError = 'http://localhost:3000/handleError'

let headerLogin = document.querySelector('#header .header__login')
let login = document.querySelector('#login');
let loginBlock = document.querySelector('#login .login-block');
let close = document.querySelector('#login .close');
let errorTable = document.querySelector('#container .content .content-error')

headerLogin.onclick = function (e) {
    login.style.display = 'block';
}

loginBlock.onclick = function (e) {
    e.stopPropagation();
}

login.onclick = function (e) {
    login.style.display = 'none';
}

close.onclick = function () {
    login.style.display = 'none';
}

let loginBtn = document.querySelector('#login .login');
let alert = document.querySelector('#login .alert');
let userNameLogin = document.querySelector('#header .user-name')
console.log(userNameLogin);

// chức năng đăng nhập
function loginMain() {
    fetch(account)
        .then(reponse => reponse.json())
        .then(handleLogin)
}
// handleLogin - xử lý đăng nhập
function handleLogin(accounts) {
    loginBtn.onclick = function (e) {
        e.preventDefault();
        let flag = false
        accounts.forEach(account => {
            let username = document.querySelector('#username');
            let password = document.querySelector('#password');
            let userInp = username.value;
            let passwordInp = password.value;
            if (account.user === userInp && account.password === passwordInp) {
                headerLogin.innerHTML = account.user;
                errorTable.style.display = 'block';
                login.style.display = 'none'
                headerLogin.style.display = 'none'
                userNameLogin.style.display = 'block'
                flag = true;
            }
        });
        if (!flag) {
            alert.innerHTML = "bạn chưa nhập đúng tài khoản hoặc mật khẩu"
        }

    }
}

loginMain()
// end đăng nhập----------------------------------