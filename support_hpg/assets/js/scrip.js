

// db
let account = 'http://localhost:3000/account';
let categoty = 'http://localhost:3000/category';
let handleError = 'http://localhost:3000/handleError'

let loginBtn = document.querySelector('#login .login');
let alert = document.querySelector('#login .alert');
let userNameLogin = document.querySelector('#header .user-name')
let showUserName = document.querySelector('#header .user-name-login')
let headerLogin = document.querySelector('#header .header__login');
let login = document.querySelector('#login');
let loginBlock = document.querySelector('#login .login-block');
let close = document.querySelector('#login .close');
let errorTable = document.querySelector('#container .content .content-error');
let sidebars = Array.from(document.querySelectorAll('#container .sidebar'));
let departments = Array.from(document.querySelectorAll('#container .sidebar__heading'))

// Hàm khởi động phần mềm
function start() {
    loginMain(handleLogin)
    getError(renderhandleError)
}

start();


// đăng nhập ***************************************************************


// hiển thị bảng đăng nhập



// nhập liêu ********** thêm điều kiện sau khi đăng nhập thì click mới nhận// đã cho sau hàm login những vẫn nhận click vào chọn hạng mục, đăng nhập vào đã thấy có ngay
// chọn hạng mục báo lỗi 
function errorInput() {
    sidebars.forEach(sidebar => {
        let department = sidebar.querySelector('.sidebar__heading');
        let categorys = Array.from(sidebar.querySelectorAll('.sidebar__menu__list'));
        categorys.forEach(category => {
            category.onclick = function () {
                let categoryItem = category.innerHTML;
                let columDepartment = document.querySelector('#container .error-body .colum:nth-child(1)')
                let columCategory = document.querySelector('#container .error-body .colum:nth-child(2)')
                columDepartment.innerHTML = department.innerHTML;
                console.log(columDepartment);
                columCategory.innerHTML = categoryItem;
            }
        })
    })
}
// let category = Array.from(document.querySelectorAll('#container .sidebar__menu__list'))
// console.log(category);



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



// get data

function getError(callback) {
    fetch(handleError)
        .then(reponse => reponse.json())
        .then(callback)
}

//render data lên trình duyệt

function renderhandleError(handleErrors) {
    let processingBody = document.querySelector('#container .content-processing .processing-body')
    let htmls = "";

    htmls = handleErrors.map(handleError => {
        handleError.status
        return `
        <tr>
        <td>${handleError.stt}</td>
        <td>${handleError.department}</td>
        <td>${handleError.category}</td>
        <td>${handleError.deviceOptions}</td>
        <td>${handleError.location}</td>
        <td>${handleError.errorDevice}</td>
        <td>${handleError.errorNote}</td>
        <td>${handleError.img}</td>
        <td>${handleError.errorTime}</td>
        <td>${handleError.errorHandleTime}</td>
        <td>${handleError.completeTime}</td>
        <td>${handleError.errorUser}</td>
        <td>${handleError.HandleUser}</td>
        <td>${handleError.status}</td>
        <td class="colum-processing"><button style="min-width:50px;">sửa</button> <button style="min-width:50px;">xóa</button> <button style="min-width:50px;">Xử lý</button> <button>Hoàn Thành</button></td>
        </tr>
        `

    })
    processingBody.innerHTML = htmls.join('');
}



// Nhập tài khoản



// chức năng đăng nhập
function loginMain(callback, callback2) {
    fetch(account)
        .then(reponse => reponse.json())
        .then(callback)
    // .then(callback2)
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
                errorTable.style.display = 'block';
                login.style.display = 'none'
                headerLogin.style.display = 'none'
                userNameLogin.style.display = 'block'
                showUserName.innerHTML = account.user;
                flag = true;
                errorInput(); // đê hàm khởi động errorInput(); ở đây để khi đăng nhập xong ta mới chạy hàm errorInput();
            }
        });
        if (!flag) {
            alert.innerHTML = "bạn chưa nhập đúng tài khoản hoặc mật khẩu"
        }

    }
}


// end đăng nhập----------------------------------













