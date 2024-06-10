

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
let btnConfirm = document.querySelector('#container .btn-error .btn-confirm')
// Hàm khởi động phần mềm
function start() {
    loginMain(handleLogin);
    getError(renderhandleError);
    handleCreateError();
}

start();


// đăng nhập ***************************************************************


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

// POST data ***************************
// Hàm POST
function CreateError(data, callback) {
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    };
    fetch(handleError, options)
        .then(reponse => reponse.json())
        .then(callback)
};


// Hàm xử lý POST

function handleCreateError() {
    btnConfirm.onclick = function (event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của nút
        let date = new Date();
        // let hours = date.getHours();
        let errorTimeClick = `${date.getHours()}:${date.getMinutes()}-${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
        console.log(errorTimeClick);
        let errorInputColums = Array.from(document.querySelectorAll('#container .error-body td'))
        console.log(errorInputColums);
        let errorInput = Array.from(document.querySelectorAll('#container .error-body input'))
        console.log(errorInputColums);
        let ErrorDb = {
            department: errorInputColums[0].innerHTML,
            category: errorInputColums[1].innerHTML,
            deviceOptions: errorInput[0].value,
            location: errorInput[1].value,
            errorDevice: errorInput[2].value,
            errorNote: errorInput[3].value,
            img: errorInput[4].value,
            errorTime: errorTimeClick,
            errorHandleTime: '',
            completeTime: '',
            errorUser: showUserName.innerHTML,
            HandleUser: '',
            status: 1
        };
        CreateError(ErrorDb, () => {
            getError(renderhandleError)
        })
    };
    // errorInputColums.map(errorInputColum => {
    //     let inputItem = errorInputColum.querySelector('.error-body-inp').innerHTML
    //     let data = {

    //     }
    // })

}




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
    htmls = handleErrors.map((handleError, index) => {
        let statusAll = ["Chờ", "Đang xử lý", "Hoàn thành"]
        let resultStatus = statusAll.find((istatusItem, index) => handleError.status == index + 1)
        return `
        <tr>
        <td class="colum-processing" >${index + 1}</td>
        <td class="colum-processing" >${handleError.department}</td>
        <td class="colum-processing" >${handleError.category}</td>
        <td class="colum-processing" >${handleError.deviceOptions}</td>
        <td class="colum-processing" >${handleError.location}</td>
        <td class="colum-processing" >${handleError.errorDevice}</td>
        <td class="colum-processing" >${handleError.errorNote}</td>
        <td class="colum-processing" >${handleError.img}</td>
        <td class="colum-processing" >${handleError.errorTime}</td>
        <td class="colum-processing" >${handleError.errorHandleTime}</td>
        <td class="colum-processing" >${handleError.completeTime}</td>
        <td class="colum-processing" >${handleError.errorUser}</td>
        <td class="colum-processing" >${handleError.HandleUser}</td>
        <td class="colum-processing" >${resultStatus}</td >
    <td class="colum-processing"><button style="min-width:50px;">sửa</button> <button style="min-width:50px;">xóa</button> <button style="min-width:50px;">Xử lý</button> <button>Hoàn Thành</button></td>
        </tr >
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
        .then(callback2)
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













