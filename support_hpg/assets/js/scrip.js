

// db
let account = 'http://localhost:3000/account';
let categoty = 'http://localhost:3000/category';
let handleErrors = 'http://localhost:3000/handleError'

let loginBtn = document.querySelector('#login .login');
let alertError = document.querySelector('#login .alert');
let userNameLogin = document.querySelector('#header .user-name');
let showUserName = document.querySelector('#header .user-name-login');
let fullName = document.querySelector('#header .full-name');
let logOut = document.querySelector('#header .log-out');
let headerLogin = document.querySelector('#header .header__login');
let login = document.querySelector('#login');
let loginBlock = document.querySelector('#login .login-block');
let close = document.querySelector('#login .close');
let errorTable = document.querySelector('#container .content .content-error');
let sidebars = Array.from(document.querySelectorAll('#container .sidebar'));
let departments = Array.from(document.querySelectorAll('#container .sidebar__heading'));
let btnConfirm = document.querySelector('#container .btn-error .btn-confirm');
// Hàm khởi động phần mềm
function start() {
    loginMain(handleLogin);
    getError(renderhandleError);
    handleCreateError();
}

start();

let accountLogin; // tài khoản đăng nhập

document.addEventListener('DOMContentLoaded', function () { //đảm vảo gọi xong DOM thì sau đó mới thực hiện các hàm bên trong
    init();
});

function init() {
    // handleDepartments();
    errorInput();
    // Các hàm khác nếu cần thiết
}

// đăng nhập ***************************************************************
// chức năng đăng nhập
function loginMain(callback) {
    fetch(account)
        .then(reponse => reponse.json())
        .then(callback)
        .then(() => {
            getError(renderhandleError);
        })
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
                showUserName.style.display = 'none'
                showUserName.innerHTML = account.user;
                fullName.innerHTML = account.fullname;
                logOut.innerHTML = 'Thoát';
                // logOut.style.display = 'none'
                flag = true;
                accountLogin = account;
                localStorage.setItem('user', JSON.stringify(userInp)) // lưu vào localstore để thực hiện việt logout đồng thời sử dụng để lưu thông tin đăng nhập khi reload lại trang
                errorInput(); // đê hàm khởi động errorInput(); ở đây để khi đăng nhập xong ta mới chạy hàm errorInput();
                getError(renderhandleError); // sau khi đăng nhập xong thì render lại
            }
        });
        if (!flag) {
            alertError.innerHTML = "bạn chưa nhập đúng tài khoản hoặc mật khẩu"
        }
    }
}



// end đăng nhập----------------------------------

// ĐĂNG XUẤT ..............................
logOut.onclick = function () {
    localStorage.removeItem('user');
    errorTable.style.display = 'none';
    login.style.display = 'block'
    userNameLogin.style.display = 'none'
}


// Reload lại trang sẽ kiểm tra user trong localStore nếu tồn tại thì sẽ tiếp tục phiên làm việc
// nếu không thì sẽ cần đăng nhập để có thể thực hiện thao tác tạo báo lỗi 
window.addEventListener('load', function () {
    const user = localStorage.getItem('user'); // gọi user lưu trong localStore
    if (user) { // nếu tồn tại user thì thực hiện các nội dung bên dưới
        fetch(account) // gọi lại API để lấy lại các account tương ứng với user trong localStore
            .then(response => response.json())
            .then(acc => {
                accountLogin = acc.find(element => `"${element.user}"` === user)
                errorTable.style.display = 'block';
                login.style.display = 'none'
                headerLogin.style.display = 'none'
                userNameLogin.style.display = 'block'
                showUserName.style.display = 'none'
                showUserName.innerHTML = accountLogin.user;
                fullName.innerHTML = accountLogin.fullname;
                logOut.innerHTML = 'Thoát';
            })
    } else {
        errorTable.style.display = 'none';
        // login.style.display = 'block'
        userNameLogin.style.display = 'none'
    }
});

// get data

function getError(callback) {
    fetch(handleErrors)
        .then(reponse => reponse.json())
        .then(callback) // cách viết khách là .then (data => callback(data))
        .catch(error => console.error('Error:', error));
}

//render data lên trình duyệt

function renderhandleError(errors) { // errors chính là data của hàm getError
    fetch(account)
        .then(response => response.json())
        .then(accounts => {
            let currentUser = showUserName.innerHTML; // user đang đăng nhập
            let currentAccount = accounts.find(acc => acc.user === currentUser); // tài khoản đang đăng nhập

            let processingBody = document.querySelector('#container .content-processing .processing-body')
            let htmls = "";
            htmls = errors.map((error, index) => {
                let accountRequest = accounts.find(acc => acc.user === error.errorUser)
                let fullNameRequest = accountRequest.fullname;

                /** hiển thị tên người xử lý lỗi -- chưa xong
                // let accountHandle = '';
                // let accountHandle = error.status === 1 ? '' : currentAccount.fullname;

                // if (currentAccount) {
                //     accountHandle = currentAccount.fullname;
                // }
                // if (!currentAccount) {
                //     accountHandle = '';
                // }
                */
                let statusAll = ["Chờ", "Đang xử lý", "Hoàn thành"]
                let resultStatus = statusAll.find((istatusItem, index) => error.status == index + 1)

                let buttons = '';
                let statusModify = error.status === 1 ? 'inline-block' : error.status === 2 ? 'none' : error.status === 3 ? 'none' : 'none';
                let statusCancel = error.status === 1 ? 'inline-block' : error.status === 2 ? 'none' : error.status === 3 ? 'none' : 'none';
                let statusHandle = error.status === 1 ? 'inline-block' : error.status === 2 ? 'none' : error.status === 3 ? 'none' : 'none';
                let statusLeave = error.status === 1 ? 'none' : error.status === 2 ? 'inline-block' : error.status === 3 ? 'none' : 'none';
                let statusComplete = error.status === 2 ? 'inline-block' : 'none';
                let statusIconComplete = error.status === 3 ? 'inline-block' : 'none';

                if (currentAccount) {
                    if (currentAccount.permission === 'administrator' || error.errorUser === currentUser) {
                        buttons += `<button class="btnModify" style="min-width:50px; display: ${statusModify};" onclick="btnModifyError('${error.id}')">Sửa</button> `;
                        buttons += `<button class="btnCancel" style="min-width:50px; display: ${statusCancel};" onclick="btnDeleteError('${error.id}')">Xóa</button> `;
                    }
                    if (currentAccount.permission === 'administrator' || currentAccount.department === error.departmentId) {
                        buttons += `<div style="display: inline-block">
                        <button class="btnHandle" style="min-width:50px; display: ${statusHandle};" onclick="confirmHandleError('${error.id}')">Xử lý</button> 
                        <button class="btnLeave" style="min-width:50px; display: ${statusLeave};" onclick="leaveError('${error.id}')">Để lại</button></div> `;
                        buttons += `<div>
                        <button class="btnComplete" style="display: ${statusComplete};" onclick="handleComplete('${error.id}')">Hoàn Thành</button> <p style="display: ${statusIconComplete};" class="iconComplete ti-check" style = "display: ${statusIconComplete}"></p>
                        </div>`
                    }
                }

                return `
                                <tr class="request-error-${error.id}">
                                    <td class="colum-processing" >${index + 1}</td>
                                    <td class="colum-processing" >${error.department}</td>
                                    <td class="colum-processing" >${error.category}</td>
                                    <td class="colum-processing" >${error.deviceOptions}</td>
                                    <td class="colum-processing" >${error.location}</td>
                                    <td class="colum-processing" >${error.errorDevice}</td>
                                    <td class="colum-processing" >${error.errorNote}</td>
                                    <td class="colum-processing" >${error.img}</td>
                                    <td class="colum-processing" >${error.errorTime}</td>
                                    <td class="colum-processing" >${error.errorHandleTime}</td>
                                    <td class="colum-processing" >${error.completeTime}</td>
                                    <td class="colum-processing" >${fullNameRequest}</td>
                                    <td class="colum-processing" >${error.handleUser}</td>
                                    <td class="colum-processing" >${resultStatus}</td>
                                    <td class="colum-processing">${buttons}</td>
                                </tr >
                                    `

            });
            processingBody.innerHTML = htmls.join('');
        });
}


// nhập liêu ********** thêm điều kiện sau khi đăng nhập thì click mới nhận// đã cho sau hàm login những vẫn nhận click vào chọn hạng mục, đăng nhập vào đã thấy có ngay
// chọn hạng mục báo lỗi 
function errorInput() {
    sidebars.forEach(sidebar => {
        let department = sidebar.querySelector('.sidebar__heading');
        let departmentId = department.id;
        let categorys = Array.from(sidebar.querySelectorAll('.sidebar__menu__list'));
        categorys.forEach(category => {
            category.onclick = function () {
                let categoryItem = category.innerHTML;
                let columDepartment = document.querySelector('#container .error-body .colum:nth-child(1)')
                let columCategory = document.querySelector('#container .error-body .colum:nth-child(2)')
                columDepartment.innerHTML = department.innerHTML;
                columDepartment.setAttribute('id', `${departmentId}`);
                columCategory.innerHTML = categoryItem;
                console.log(columDepartment.innerHTML);
                console.log(columCategory.innerHTML);
            }
        })
    })
}

// POST data ***************************
// Hàm POST
function CreateError(errorDb, callback, callback2) {
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(errorDb)
    };
    fetch(handleErrors, options)
        .then(response => response.json())
        .then(callback)
        .then(callback2)
};


// Hàm xử lý POST

function handleCreateError() {
    btnConfirm.onclick = function (event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của nút
        let date = new Date();
        let errorTimeClick = `${date.getHours()}:${date.getMinutes()}-${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        let errorInputColums = Array.from(document.querySelectorAll('#container .error-body td'))
        let errorInputs = Array.from(document.querySelectorAll('#container .error-body input'))
        let result = false
        // không nên dùng vòng lặp để tránh bị add dữ liệu nhiều hơn 1 lần cho mỗi 1 click vào btn
        if (// && errorInputColums[0] && errorInputColums[1] 
            // && errorInputs[0] && errorInputs[1] 
            // && errorInputs[2] && errorInputs[3] &&
            errorInputColums[0].innerHTML.trim() !== ''
            && errorInputColums[1].innerHTML.trim() !== ''
            && errorInputs[0].value.trim() !== ''
            && errorInputs[1].value.trim() !== ''
            && errorInputs[2].value.trim() !== '') {
            let departmentId = errorInputColums[0].id;
            let errorDb = {
                department: errorInputColums[0].innerHTML,
                category: errorInputColums[1].innerHTML,
                deviceOptions: errorInputs[0].value,
                location: errorInputs[1].value,
                errorDevice: errorInputs[2].value,
                errorNote: errorInputs[3].value,
                img: errorInputs[4].value,
                errorTime: errorTimeClick,
                errorHandleTime: '',
                completeTime: '',
                errorUser: showUserName.innerHTML,
                handleUser: '',
                departmentId: departmentId,
                status: 1
            };
            result = true;
            CreateError(errorDb, () => {
                removeCreateError()
            }, () => {
                getError(renderhandleError)
            });
        };
        if (!result) {
            alert('Bạn cần nhập đủ thông tin yêu cầu');
        };
    };
};

// Đưa input về rỗng sau khi click button
function removeCreateError() {
    let removeErrorInputColums = Array.from(document.querySelectorAll('#container .error-body td'))
    let removeErrorInputs = Array.from(document.querySelectorAll('#container .error-body input'))
    removeErrorInputColums.forEach((removeErrorInputColum, index) => {
        if (index < 2) {
            removeErrorInputColum.innerHTML = '';
        }
    })
    removeErrorInputs.forEach(removeErrorInput => {
        removeErrorInput.value = '';
    })
}


headerLogin.onclick = function (e) {
    login.style.display = 'block';
}

loginBlock.onclick = function (e) {
    e.stopPropagation(); // loại bỏ tiến trình nổi bọt
}

login.onclick = function (e) {
    login.style.display = 'none';
}

close.onclick = function () {
    login.style.display = 'none';
}

// showUserName.onmouseenter = function () {
//di chuột vào phần tử
// }




// Sửa báo lỗi *********************************************

// hàm sửa
function btnModifyError(id) { //id của lỗi
    fetch(handleErrors + '/' + id)
        .then(response => response.json())
        .then(handleError => handleModify(handleError))
}

// hàm xử lý sửa đổi 
function handleModify(handleError) {
    let save = document.querySelector('#container .content .btn-save');
    let cancel = document.querySelector('#container .content .btn-cancel');
    let btnConfirm = document.querySelector('#container .btn-error .btn-confirm');
    save.style.display = 'inline-block';
    cancel.style.display = 'inline-block';
    btnConfirm.style.display = 'none';
    let errorInputColums = Array.from(document.querySelectorAll('#container .error-body td'));
    let errorInputs = Array.from(document.querySelectorAll('#container .error-body input'))


    //đẩy dữ liệu trở ngược lại bảng error-body
    errorInputColums[0].innerHTML = handleError.department;
    errorInputColums[1].innerHTML = handleError.category;

    errorInputs[0].value = handleError.deviceOptions;
    errorInputs[1].value = handleError.location;
    errorInputs[2].value = handleError.errorDevice;
    errorInputs[3].value = handleError.errorNote;
    errorInputs[4].value = handleError.img;


    cancel.onclick = function () {
        save.style.display = 'none';
        cancel.style.display = 'none';
        btnConfirm.style.display = 'inline-block';
        removeCreateError()
        // getError(renderhandleError);
    }


    save.onclick = function () {
        let confirmMessage = 'bạn có thực sự muốn sửa dữ liệu';
        // lấy dữ liệu từ các ô input, td để đưa vào dataUpdate
        let department = document.querySelector('#container .error-body td:nth-child(1)').innerHTML;
        let category = document.querySelector('#container .error-body td:nth-child(2)').innerHTML;
        let deviceOptions = document.querySelector('input[name="deviceOptions"]').value;
        let location = document.querySelector('input[name="location"]').value;
        let errorDevice = document.querySelector('input[name="errorDevice"]').value;
        let errorNote = document.querySelector('input[name="errorNote"]').value;
        let img = document.querySelector('input[name="img"]').value;

        let result = false;

        // nếu các biến này không phải là giá trị falsy (false 0 , "" (chuỗi rỗng), null, undefined, NaN (Not-a-Number))
        if (department && category && deviceOptions && location && errorDevice) {
            let date = new Date();
            let errorTimeClick = `${date.getHours()}:${date.getMinutes()}-${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
            let dataUpdate = {
                department: department,
                category: category,
                deviceOptions: deviceOptions,
                location: location,
                errorDevice: errorDevice,
                errorNote: errorNote,
                img: img.value,
                errorTime: `${errorTimeClick} (Ud)`
            }

            if (window.confirm(confirmMessage)) {
                let options = {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataUpdate), // body data type must match "Content-Type" header
                }
                fetch(handleErrors + '/' + handleError.id, options)
                    .then(course => course.json())
                    .then(function () {
                        removeCreateError()
                        getError(renderhandleError);
                    })
                    .then(function () {
                        save.style.display = 'none';
                        cancel.style.display = 'none';
                        btnConfirm.style.display = 'block';
                    })
            }
            result = true;
        }
        //         })
        //     }
        // })
        if (!result) {
            alert('Bạn cần nhập đủ thông tin yêu cầu');
        }
    }
}


//End Sửa báo lỗi *********************************************



// xóa lỗi ************************************************

function btnDeleteError(id) {
    let confirmMessage = 'Bạn có muốn thực sự muôn xóa yêu cầu này'
    if (window.confirm(confirmMessage)) {
        let options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }
        fetch(handleErrors + '/' + id, options)
            .then(reponse => reponse.json())
            .then(() => {
                let removeRequest = document.querySelector('.request-error-' + id)
                if (removeRequest) {
                    removeRequest.remove();
                };
            });
    };
};

// End Hàm xóa**********************




// xác nhận xử lý yêu cầu*****************
// hàm xác nhận xử lý
function confirmHandleError(id) {
    fetch(handleErrors + '/' + id)
        .then(reponse => reponse.json())
        .then(error => handleConfirmError(error))

};

// hàm xử lý nút xử lý ******************

function handleConfirmError(error) {
    let confirmMessage = 'Xác nhận xử lý yêu cầu này'
    let date = new Date();
    let errorTimeClick = `${date.getHours()}:${date.getMinutes()}-${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    let btnModify = document.querySelector('#container .processing-body .btnModify'); // nút sửa
    let btnCancel = document.querySelector('#container .processing-body .btnCancel'); // nút xóa
    let btnHandle = document.querySelector('#container .processing-body .btnHandle'); // nút xử lý
    let btnComplete = document.querySelector('#container .processing-body .btnComplete'); // nút hoàn thành
    let btnLeave = document.querySelector('#container .processing-body .btnLeave'); // nút để lại

    let errorHandleTime = errorTimeClick; // thời gian bắt đầu xác nhận xử lý
    let userHandle = showUserName.innerHTML;
    let dataUpdate = {
        errorHandleTime: errorHandleTime,
        handleUser: userHandle,
        status: 2
    }

    if (window.confirm(confirmMessage)) {
        btnHandle.style.display = 'none'; //////////////////////////////////////
        btnLeave.style.display = 'inline-block';///////////////////////////////////////chưa hiển thị lên
        let options = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataUpdate), // body data type must match "Content-Type" header
        }
        fetch(handleErrors + '/' + error.id, options)
            .then(response => response.json())
            .then(function () {
                // removeCreateError()
                getError(renderhandleError);
            })
    }
}

// End hàm xử lý nút xác nhận ************************

//Nút để lại ************************
function leaveError(id) {
    fetch(handleErrors + '/' + id)
        .then(reponse => reponse.json())
        .then(error => handleLeaveError(error))
}

//Hàm xử lý nút để lại
function handleLeaveError(error) {
    let confirmMessage = 'Bạn có thực sự muốn để lại yêu cầu này'
    let userNameHandle = error.handleUser;
    let departmentId = error.departmentId;
    let userRequest = {};
    fetch(account)
        .then(reponse => reponse.json())
        .then(acc => {
            acc.forEach(element => {
                if (element.user === error.handleUser) {
                    userRequest = element
                }
            })
            let dataUpdate = {
                errorHandleTime: "",
                handleUser: "",
                status: 1
            }
            if (accountLogin.user === userNameHandle || (accountLogin.department === departmentId && accountLogin.permission === 'admin') || accountLogin.permission === 'administrator') {
                if (window.confirm(confirmMessage)) {
                    let options = {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(dataUpdate), // body data type must match "Content-Type" header
                    }
                    fetch(handleErrors + '/' + error.id, options)
                        .then(course => course.json())
                        .then(function () {
                            // removeCreateError()
                            getError(renderhandleError);
                        })
                }
            } else {
                alert(`Bạn không có quyền để lại yêu cầu này, hãy tìm ${userRequest.fullname}, trưởng bộ phận của bạn hoặc administrator`)
            }
        })

}

// END nút để lại



//hàm xử lý nút hoàn thành **********************
// hàm xác nhận hoàn Thành
function handleComplete(id) {
    fetch(handleErrors + '/' + id)
        .then(reponse => reponse.json())
        .then(error => handleBtnComplete(error))
}

//Hàm xử lý nút hoàn thành
function handleBtnComplete(error) {
    let confirmMessage = 'Xác nhận hoàn thành'
    let userNameHandle = error.handleUser;
    let departmentId = error.departmentId;
    let userRequest = {};
    fetch(account)
        .then(reponse => reponse.json())
        .then(acc => {
            acc.forEach(element => {
                if (element.user === error.handleUser) {
                    userRequest = element
                }
            })
            let date = new Date();
            let errorTimeClick = `${date.getHours()}:${date.getMinutes()}-${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            let dataUpdate = {
                completeTime: errorTimeClick,
                status: 3
            }
            if (accountLogin.user === userNameHandle || (accountLogin.department === departmentId && accountLogin.permission === 'admin') || accountLogin.permission === 'administrator') {
                if (window.confirm(confirmMessage)) {
                    let options = {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(dataUpdate), // body data type must match "Content-Type" header
                    }
                    fetch(handleErrors + '/' + error.id, options)
                        .then(response => response.json())
                        .then(function () {
                            // removeCreateError()
                            getError(renderhandleError);
                        })
                }
            } else {
                alert(`Bạn không có quyền để lại yêu cầu này, hãy tìm ${userRequest.fullname}, trưởng bộ phận của bạn hoặc administrator`)
            }
        })


}

// End hàm xử lý nút hoàn thành **********************



//Lọc thông tin theo từng bộ phận
// Hàm render theo bộ phận


let handledepartmens = departments.forEach(department => {
    department.onclick = function () {
        let departmentIdrender = department.getAttribute('id');
        getError(errors => renderDepartments(departmentIdrender, errors)); //
    };
});

function renderDepartments(departmentIdrender, errors) {

    fetch(account)
        .then(response => response.json())
        .then(accounts => {
            let currentUser = showUserName.innerHTML; // user đang đăng nhập
            let currentAccount = accounts.find(acc => acc.user === currentUser); // tài khoản đang đăng nhập

            let processingBody = document.querySelector('#container .content-processing .processing-body')
            let htmls = "";
            let departmentError = errors.filter(element => {
                return element.departmentId === departmentIdrender
            })

            htmls = departmentError.map((error, index) => {
                let accountRequest = accounts.find(acc => acc.user === error.errorUser)
                let fullNameRequest = accountRequest.fullname;

                let statusAll = ["Chờ", "Đang xử lý", "Hoàn thành"]
                let resultStatus = statusAll.find((istatusItem, index) => error.status == index + 1)

                let buttons = '';
                let statusModify = error.status === 1 ? 'inline-block' : error.status === 2 ? 'none' : error.status === 3 ? 'none' : 'none';
                let statusCancel = error.status === 1 ? 'inline-block' : error.status === 2 ? 'none' : error.status === 3 ? 'none' : 'none';
                let statusHandle = error.status === 1 ? 'inline-block' : error.status === 2 ? 'none' : error.status === 3 ? 'none' : 'none';
                let statusLeave = error.status === 1 ? 'none' : error.status === 2 ? 'inline-block' : error.status === 3 ? 'none' : 'none';
                let statusComplete = error.status === 2 ? 'inline-block' : 'none';
                let statusIconComplete = error.status === 3 ? 'inline-block' : 'none';

                if (currentAccount) {
                    if (currentAccount.permission === 'administrator' || error.errorUser === currentUser) {
                        buttons += `<button class="btnModify" style="min-width:50px; display: ${statusModify};" onclick="btnModifyError('${error.id}')">Sửa</button> `;
                        buttons += `<button class="btnCancel" style="min-width:50px; display: ${statusCancel};" onclick="btnDeleteError('${error.id}')">Xóa</button> `;
                    }
                    if (currentAccount.permission === 'administrator' || currentAccount.department === error.departmentId) {
                        buttons += `<div style="display: inline-block">
                        <button class="btnHandle" style="min-width:50px; display: ${statusHandle};" onclick="confirmHandleError('${error.id}')">Xử lý</button>
                        <button class="btnLeave" style="min-width:50px; display: ${statusLeave};" onclick="leaveError('${error.id}')">Để lại</button></div> `;
                        buttons += `<div>
                        <button class="btnComplete" style="display: ${statusComplete};" onclick="handleComplete('${error.id}')">Hoàn Thành</button> <p style="display: ${statusIconComplete};" class="iconComplete ti-check" style = "display: ${statusIconComplete}"></p>
                        </div>`
                    }
                }

                return `
                            <tr class="request-error-${error.id}">
                                <td class="colum-processing" >${index + 1}</td>
                                <td class="colum-processing" >${error.department}</td>
                                <td class="colum-processing" >${error.category}</td>
                                <td class="colum-processing" >${error.deviceOptions}</td>
                                <td class="colum-processing" >${error.location}</td>
                                <td class="colum-processing" >${error.errorDevice}</td>
                                <td class="colum-processing" >${error.errorNote}</td>
                                <td class="colum-processing" >${error.img}</td>
                                <td class="colum-processing" >${error.errorTime}</td>
                                <td class="colum-processing" >${error.errorHandleTime}</td>
                                <td class="colum-processing" >${error.completeTime}</td>
                                <td class="colum-processing" >${fullNameRequest}</td>
                                <td class="colum-processing" >${error.handleUser}</td>
                                <td class="colum-processing" >${resultStatus}</td>
                                <td class="colum-processing">${buttons}</td>
                            </tr >
                                `
            });
            processingBody.innerHTML = htmls.join('');
        });
}

