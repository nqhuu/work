
// document.addEventListener('DOMContentLoaded', function () {
//     // Hàm thêm một hàng mới để nhập liệu
//     document.getElementById('btnAdd').addEventListener('click', function () {
//         const errorTable = document.getElementById('errorTable');
//         const rowCount = errorTable.rows.length;
//         const row = errorTable.insertRow(rowCount);

//         for (let i = 0; i < 5; i++) {
//             const cell = row.insertCell(i);
//             if (i === 0) {
//                 cell.innerText = rowCount; // Cột STT
//             } else {
//                 const input = document.createElement('input');
//                 input.type = 'text';
//                 cell.appendChild(input);
//             }
//         }
//     });

//     // Hàm xác nhận và chuyển dữ liệu xuống bảng dưới
//     document.getElementById('btnConfirm').addEventListener('click', function () {
//         const errorTable = document.getElementById('errorTable');
//         const processingTable = document.getElementById('processingTable');

//         for (let i = 1; i < errorTable.rows.length; i++) {
//             const row = processingTable.insertRow(processingTable.rows.length);

//             for (let j = 0; j < 9; j++) {
//                 const cell = row.insertCell(j);
//                 if (j < 5) {
//                     cell.innerText = errorTable.rows[i].cells[j].children[0]?.value || errorTable.rows[i].cells[j].innerText;
//                 } else {
//                     cell.innerText = ''; // Các cột khác có thể được điền sau
//                 }
//             }
//         }

//         // Xóa bảng errorTable trừ hàng tiêu đề
//         for (let i = errorTable.rows.length - 1; i > 0; i--) {
//             errorTable.deleteRow(i);
//         }
//     });
// });


// localStorage.setItem('account', JSON.stringify(account)); // chuyển sang dạng JSON với key là account và value được chuyển sang dạng JSON bằng từ khóa setItem và lưu lại trong localStorage

// let deviceOptions = ['Máy tính', 'Máy quét mã vạch', 'Máy in/intem/photo', 'Tivi', 'Màn hình máy tính', 'bán phí/chuột', 'camera', 'internet'];
// let locationOptions = ['Văn phòng nhà ăn', 'Nhà ăn', 'VP kế toán', 'Lò mountain', 'Lò Fulltime', 'Lò Yuegao', 'Kho VT', 'Kho NL', 'Hộp', 'VP Hôp', 'EI', 'Mài cây tự động', 'Mài cây số 9', 'Mài cây số 10', 'Song cạnh 1-2', 'Song cạnh 3-4', 'Cắt Disai', 'Căt Intermac', 'Truyền dán 1', 'Truyền dán 2', 'Truyền dán 3'];
// let errorDevice = ['Không lên hình', 'Không quét được', 'In lỗi'];

// db
let account = 'http://localhost:3000/account';
let categoty = 'http://localhost:3000/category';
let handleError = 'http://localhost:3000/handleError'




// Hàm khởi động phần mềm
function start() {
    loginMain()
    getError(renderhandleError)
}

start();


// đăng nhập ***************************************************************


// hiển thị bảng đăng nhập
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
        <td>${handleError.department}</td>
        <td><button>sửa</button> <button>xóa</button></td>
        </tr>
        `
    })
    processingBody.innerHTML = htmls.join('');
}

// Nhập tài khoản


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


// end đăng nhập----------------------------------












