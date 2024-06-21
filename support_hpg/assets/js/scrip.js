

// db
let account = 'http://localhost:3000/account';
let categoty = 'http://localhost:3000/category';
let handleErrors = 'http://localhost:3000/handleError'
let countCodeRequest = 'http://localhost:3000/countCodeRequest'
// let notifications = 'http://localhost:3000/notifications'

let home = document.querySelector('#header .header__logo');
let loginBtn = document.querySelector('#login .login');
let alertError = document.querySelector('#login .alert');
let userNameLogin = document.querySelector('#header .user-name');
let showUserName = document.querySelector('#header .user-name .user-name-login');
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
let notifications = document.querySelector('#header .notification-block')
let notificationsIcon = document.querySelector('#header .notification-icon')
let notificationItem = document.querySelector('#header .notification-block .notification-item')
let notiQuantity = document.querySelector('#header .notification .quality-noti');
let notificationChild = document.querySelectorAll('#header .notification-item .noti-child')
let date = new Date();
// Hàm khởi động phần mềm

function start() {
    getError(renderhandleError);
    loginMain(handleLogin);
    handleCreateError();
}

start();


let accountLogin; // tài khoản đăng nhập - đăng nhập hiện tại


function getStatusText(status) {
    switch (status) {
        case 1:
        case 11:
            return "Chờ";
        case 2:
        case 22:
            return "Đang xử lý";
        case 3:
        case 33:
            return "Hoàn thành";
        default:
            return "Unknown status";
    }
}

document.addEventListener('DOMContentLoaded', function () { //đảm vảo gọi xong DOM thì sau đó mới thực hiện các hàm bên trong
    init();
});

function init() {
    // handleDepartments();
    errorInput();
    // notificationItemQuantity()
    // renderNotifications();
    // Các hàm khác nếu cần thiết
}

// đăng nhập ***************************************************************
// chức năng đăng nhập
function loginMain(callback) {
    fetch(account)
        .then(reponse => reponse.json())
        .then(callback)
    // .then(() => {
    //     getError(renderNotifications());
    // })
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
                getError(renderhandleErrorUser); // sau khi đăng nhập xong thì render lại
                // renderNotifications(accountLogin); 
                getError(renderNotifications);
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
    login.style.display = 'block';
    userNameLogin.style.display = 'none';
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
                login.style.display = 'none';
                headerLogin.style.display = 'none';
                userNameLogin.style.display = 'block';
                showUserName.style.display = 'none';
                showUserName.innerHTML = accountLogin.user;
                fullName.innerHTML = accountLogin.fullname;
                logOut.innerHTML = 'Thoát';
                getError(renderhandleError);
                getError(renderNotifications);
            })
    } else {
        errorTable.style.display = 'none';
        // login.style.display = 'block'
        userNameLogin.style.display = 'none';
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

            let processingBody = document.querySelector('#container .content-processing .processing-body');
            function getStatusText(status) {
                switch (status) {
                    case 1:
                    case 11:
                        return "Chờ";
                    case 2:
                    case 22:
                        return "Đang xử lý";
                    case 3:
                    case 33:
                        return "Hoàn thành";
                    default:
                        return "Unknown status";
                }
            }
            let htmls = "";
            htmls = errors.reverse().map((error, index) => { //sử dụng reverse() đẻ đảo lại vị trí của mảng mụcđích để đưa mã tạo sau lên trên cùng
                let accountRequest = accounts.find(acc => acc.user === error.errorUser);
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
                // let statusAll = ["Chờ", "Đang xử lý", "Hoàn thành"];

                let resultStatus = getStatusText(error.status)

                let buttons = '';
                let statusModify = (error.status === 1 || error.status === 11) ? 'inline-block' : (error.status === 2 || error.status === 22) ? 'none' : (error.status === 3 || error.status === 33) ? 'none' : 'none';
                let statusCancel = (error.status === 1 || error.status === 11) ? 'inline-block' : (error.status === 2 || error.status === 22) ? 'none' : (error.status === 3 || error.status === 33) ? 'none' : 'none';
                let statusHandle = (error.status === 1 || error.status === 11) ? 'inline-block' : (error.status === 2 || error.status === 22) ? 'none' : (error.status === 3 || error.status === 33) ? 'none' : 'none';
                let statusLeave = (error.status === 1 || error.status === 11) ? 'none' : (error.status === 2 || error.status === 22) ? 'inline-block' : (error.status === 3 || error.status === 33) ? 'none' : 'none';
                let statusComplete = (error.status === 2 || error.status === 22) ? 'inline-block' : 'none';
                let statusIconComplete = (error.status === 3 || error.status === 33) ? 'inline-block' : 'none';

                if (currentAccount) {
                    if (currentAccount.permission === 'administrator' || error.errorUser === currentUser) {
                        buttons += `<button class="btnModify btn-Handle" style="min-width:50px; display: ${statusModify};" onclick="btnModifyError('${error.id}')">Sửa</button> `;
                        buttons += `<button class="btnCancel btn-Handle" style="min-width:50px; display: ${statusCancel};" onclick="btnDeleteError('${error.id}')">Xóa</button> `;
                    }
                    if (currentAccount.permission === 'administrator' || currentAccount.department === error.departmentId) {
                        buttons += `<div style="display: inline-block">
                        <button class="btnHandle btn-Handle" style="min-width:50px; display: ${statusHandle};" onclick="confirmHandleError('${error.id}')">Xử lý</button> 
                        <button class="btnLeave btn-Handle" style="min-width:50px; display: ${statusLeave};" onclick="leaveError('${error.id}')">Để lại</button></div> `;
                        buttons += `<div>
                        <button class="btnComplete btn-Handle" style="display: ${statusComplete};" onclick="handleComplete('${error.id}')">Hoàn Thành</button> <p style="display: ${statusIconComplete};" class="iconComplete ti-check"></p>
                        </div>`
                    }
                }

                return `
                                <tr class="request-error-${error.id}">
                                    <td class="colum-processing" >${error.requestCode}</td>
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
                let columDepartment = document.querySelector('#container .error-body .colum:nth-child(1)');
                let columCategory = document.querySelector('#container .error-body .colum:nth-child(2)');
                columDepartment.innerHTML = department.innerHTML;
                columDepartment.setAttribute('id', `${departmentId}`);
                columCategory.innerHTML = categoryItem;
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

//xử lý tăng mã số đơn hàng mỗi lần tạo mới
async function getCount() {
    let response = await fetch(countCodeRequest + "/" + "1");
    let data = await response.json();
    return data;
}

async function updateCount(dataUpdate) {
    let options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataUpdate),
    }
    let response = await fetch(countCodeRequest + "/" + "1", options)
    return response.json();
}

async function checkMonthYear() {
    let response = await fetch(countCodeRequest + "/" + "1");
    let data = await response.json();
    return data.date;
}

// Hàm xử lý POST


function handleCreateError() {
    btnConfirm.onclick = async function (event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của nút
        let formattedMonth = String(date.getMonth() + 1).padStart(2, '0'); // sử dụng padStart(2, '0') để tạo giá trị có độ dài là 2, nếu ko đủ 2 thì thêm 0 đăng trước
        let formatedYear = String(date.getFullYear()).slice(-2); // lấy 2 số cuối của năm
        let day = String(date.getDate()).padStart(2, '0');
        let countData = await getCount();
        let count;
        let monthYearCheck = await checkMonthYear();
        let monthCheck = String(monthYearCheck.slice(3, 5));

        let yearCheck = String(monthYearCheck.slice(-2));
        if (monthCheck !== formattedMonth || yearCheck !== formatedYear) {
            count = 0;
        } else {
            count = countData.count;
        }

        // let monthYear = `${formattedMonth}${(date.getFullYear() % 100)}`
        let requestcode = `${day}${formattedMonth}${formatedYear}${String(count + 1).padStart(4, '0')}`
        let errorTimeClick = `${date.getHours()}:${date.getMinutes()}-${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        let errorInputColums = Array.from(document.querySelectorAll('#container .error-body td'))
        let errorInputs = Array.from(document.querySelectorAll('#container .error-body input'))
        let result = false
        // không nên dùng vòng lặp để tránh bị add dữ liệu nhiều hơn 1 lần cho mỗi 1 click vào btn
        // vì nếu click vào nhiều lần thì sẽ add dữ liệu nhiều hơn 1 lần
        // nên phải kiểm tra trước rồi mới add dữ liệu vào
        // nếu không có dữ liệu thì không add dữ liệu vào
        // nếu có dữ liệu thì add dữ liệu vào  

        if (// && errorInputColums[0] && errorInputColums[1] 
            // && errorInputs[0] && errorInputs[1] 
            // && errorInputs[2] && errorInputs[3] &&
            errorInputColums[0].innerHTML.trim() !== ''
            && errorInputColums[1].innerHTML.trim() !== ''
            && errorInputs[0].value.trim() !== ''
            && errorInputs[1].value.trim() !== ''
            && errorInputs[2].value.trim() !== '') {
            // if (requestcode) 
            let dataUpdate = {
                count: count + 1,
                date: `${day}-${formattedMonth}-${formatedYear}`
            }
            let countUpdate = await updateCount(dataUpdate);
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
                requestCode: requestcode,
                status: 1,
                notification: errorTimeClick
            };
            result = true;
            CreateError(errorDb, () => {
                removeCreateError()
            }, () => {
                getError(renderhandleErrorUser)
                getError(renderNotifications);

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
                        getError(renderhandleErrorUser);
                        getError(renderNotifications);

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
        status: 2,
        notification: errorHandleTime
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
                getError(renderhandleErrorUser);
                getError(renderNotifications);

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
                            getError(renderNotifications);
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
            let errorTimeClick = `${date.getHours()}:${date.getMinutes()}-${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            let dataUpdate = {
                completeTime: errorTimeClick,
                status: 3,
                notification: errorTimeClick
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
                            getError(renderNotifications);
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
        getError(errors => renderDepartments(errors, departmentIdrender)); //
    };
});

function renderDepartments(errors, departmentIdrender) {

    fetch(account)
        .then(response => response.json())
        .then(accounts => {
            let currentUser = showUserName.innerHTML; // user đang đăng nhập
            let currentAccount = accounts.find(acc => acc.user === currentUser); // tài khoản đang đăng nhập

            let processingBody = document.querySelector('#container .content-processing .processing-body')

            let htmls = "";
            let departmentErrorUser = errors.reverse().filter(element => {
                return element.departmentId === departmentIdrender
            })

            htmls = departmentErrorUser.map((error, index) => {
                let accountRequest = accounts.find(acc => acc.user === error.errorUser)
                let fullNameRequest = accountRequest.fullname;

                // let statusAll = ["Chờ", "Đang xử lý", "Hoàn thành"]
                // let resultStatus = statusAll.find((istatusItem, index) => {
                //     if (error.status == index + 1 || ((error.status) + error.status * 10 + error.status) == (index + 1) + (error.status * 10 + error.status)) {
                //         return istatusItem;
                //     }
                // })
                let resultStatus = getStatusText(error.status)

                let buttons = '';
                let statusModify = (error.status === 1 || error.status === 11) ? 'inline-block' : (error.status === 2 || error.status === 22) ? 'none' : (error.status === 3 || error.status === 33) ? 'none' : 'none';
                let statusCancel = (error.status === 1 || error.status === 11) ? 'inline-block' : (error.status === 2 || error.status === 22) ? 'none' : (error.status === 3 || error.status === 33) ? 'none' : 'none';
                let statusHandle = (error.status === 1 || error.status === 11) ? 'inline-block' : (error.status === 2 || error.status === 22) ? 'none' : (error.status === 3 || error.status === 33) ? 'none' : 'none';
                let statusLeave = (error.status === 1 || error.status === 11) ? 'none' : (error.status === 2 || error.status === 22) ? 'inline-block' : (error.status === 3 || error.status === 33) ? 'none' : 'none';
                let statusComplete = (error.status === 2 || error.status === 22) ? 'inline-block' : 'none';
                let statusIconComplete = (error.status === 3 || error.status === 33) ? 'inline-block' : 'none';

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
                {/* <td class="colum-processing" >${index + 1}</td> */ }
                return `
                            <tr class="request-error-${error.id}">
                            
                                <td class="colum-processing" >${error.requestCode}</td>
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

// END Lọc thông tin theo từng bộ phận

//-HOME---------------------------------------------------------------
home.onclick = function (e) {
    e.preventDefault();
    getError(errors => renderhandleError(errors));
}

// END-HOME---------------------------------------------------------------

let accountAll = fetch(account)
    .then(response => response.json())
    .then(accounts => accounts)

// console.log(accountAll)

// render theo user đăng nhập
// fullName.onclick = function (e) {
//     getError(renderhandleErrorUser)
//     console.log(accountLogin)
// }




function renderhandleErrorUser(errors) {
    fetch(account)
        .then(response => response.json())
        .then(accounts => {
            // let currentAccount = accounts.find(acc => acc.user === currentUser); // tài khoản đang đăng nhập
            let currentUser = accountLogin.user; // user đang đăng nhập

            let processingBody = document.querySelector('#container .content-processing .processing-body')
            let htmls = "";
            let departmentErrorUser = errors.reverse().filter(element => {
                return element.errorUser === accountLogin.user
            })

            htmls = departmentErrorUser.map((error, index) => {
                let fullNameRequest = accountLogin.fullname;

                // let statusAll = ["Chờ", "Đang xử lý", "Hoàn thành"]
                // let resultStatus = statusAll.find((istatusItem, index) => {
                //     if (error.status == index + 1 || ((error.status) + error.status * 10 + error.status) == (index + 1) + (error.status * 10 + error.status)) {
                //         return istatusItem;
                //     }
                // })
                let resultStatus = getStatusText(error.status)


                let buttons = '';
                let statusModify = (error.status === 1 || error.status === 11) ? 'inline-block' : (error.status === 2 || error.status === 22) ? 'none' : (error.status === 3 || error.status === 33) ? 'none' : 'none';
                let statusCancel = (error.status === 1 || error.status === 11) ? 'inline-block' : (error.status === 2 || error.status === 22) ? 'none' : (error.status === 3 || error.status === 33) ? 'none' : 'none';
                let statusHandle = (error.status === 1 || error.status === 11) ? 'inline-block' : (error.status === 2 || error.status === 22) ? 'none' : (error.status === 3 || error.status === 33) ? 'none' : 'none';
                let statusLeave = (error.status === 1 || error.status === 11) ? 'none' : (error.status === 2 || error.status === 22) ? 'inline-block' : (error.status === 3 || error.status === 33) ? 'none' : 'none';
                let statusComplete = (error.status === 2 || error.status === 22) ? 'inline-block' : 'none';
                let statusIconComplete = (error.status === 3 || error.status === 33) ? 'inline-block' : 'none';

                if (accountLogin) {
                    if (accountLogin.permission === 'administrator' || error.errorUser === currentUser) {
                        buttons += `<button class="btnModify" style="min-width:50px; display: ${statusModify};" onclick="btnModifyError('${error.id}')">Sửa</button> `;
                        buttons += `<button class="btnCancel" style="min-width:50px; display: ${statusCancel};" onclick="btnDeleteError('${error.id}')">Xóa</button> `;
                    }
                    if (accountLogin.permission === 'administrator' || accountLogin.department === error.departmentId) {
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
                            
                                <td class="colum-processing" >${error.requestCode}</td>
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

/********************************************

*/
// render theo user
fullName.onclick = function (e) {
    getError(errors => renderhandleErrorUser(errors, accountLogin))
}



// tạo function render tổng

function renderhandleErrorOption(errors, departmentIdAndUser = 'undefined') {
    let processingBody = document.querySelector('#container .content-processing .processing-body')
    let htmls = "";
    let fullNameRequest = accountLogin.fullname;
    // render các request của user đang login
    if (departmentIdAndUser === accountLogin) {
        let currentUser = accountLogin.user;
        let departmentErrorUser = errors.reverse().filter(element => {
            return element.errorUser === currentUser
        })

        htmls = departmentErrorUser.map((error, index) => {
            // let statusAll = ["Chờ", "Đang xử lý", "Hoàn thành"]
            // let resultStatus = statusAll.find((istatusItem, index) => {
            //     if (error.status == index + 1 || ((error.status) + error.status * 10 + error.status) == (index + 1) + (error.status * 10 + error.status)) {
            //         return istatusItem;
            //     }
            // })

            let resultStatus = getStatusText(error.status)

            let buttons = '';
            let statusModify = (error.status === 1 || error.status === 11) ? 'inline-block' : (error.status === 2 || error.status === 22) ? 'none' : (error.status === 3 || error.status === 33) ? 'none' : 'none';
            let statusCancel = (error.status === 1 || error.status === 11) ? 'inline-block' : (error.status === 2 || error.status === 22) ? 'none' : (error.status === 3 || error.status === 33) ? 'none' : 'none';
            let statusHandle = (error.status === 1 || error.status === 11) ? 'inline-block' : (error.status === 2 || error.status === 22) ? 'none' : (error.status === 3 || error.status === 33) ? 'none' : 'none';
            let statusLeave = (error.status === 1 || error.status === 11) ? 'none' : (error.status === 2 || error.status === 22) ? 'inline-block' : (error.status === 3 || error.status === 33) ? 'none' : 'none';
            let statusComplete = (error.status === 2 || error.status === 22) ? 'inline-block' : 'none';
            let statusIconComplete = (error.status === 3 || error.status === 33) ? 'inline-block' : 'none';


            if (accountLogin) {
                if (accountLogin.permission === 'administrator' || error.errorUser === currentUser) {
                    buttons += `<button class="btnModify" style="min-width:50px; display: ${statusModify};" onclick="btnModifyError('${error.id}')">Sửa</button> `;
                    buttons += `<button class="btnCancel" style="min-width:50px; display: ${statusCancel};" onclick="btnDeleteError('${error.id}')">Xóa</button> `;
                }
                if (accountLogin.permission === 'administrator' || accountLogin.department === error.departmentId) {
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
                            
                                <td class="colum-processing" >${error.requestCode}</td>
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
        }).reverse();
        processingBody.innerHTML = htmls.join('');
    }
}


// tạo notifications cho user đăng nhập

async function renderNotifications() { // acccount được lấy sau khi login - để hàm renderNotifications bên trong hàm loginMain
    let loginName = showUserName.innerHTML
    // console.log(loginName);
    let responsAccounts = await fetch(account);
    let dataAccounts = await responsAccounts.json();
    let accountLogin = dataAccounts.find(account => {
        return account.user === loginName;
    })
    let userName = accountLogin.user;
    let fullName = accountLogin.fullname;
    let userId = accountLogin.id;
    let department = accountLogin.department;
    let permission = accountLogin.permission;
    let htmls = [];
    let response = await fetch(handleErrors);
    let dataError = await response.json();
    let notificationsUser = dataError.sort((a,b)=> {
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////xử lý render notificationg mới lên trên cùng//////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
    }).filter(notification => {
        return notification.errorUser == userName;
    })
    // request được bộ phận khác yêu cầu
    let notificationsDepartment = dataError.filter(notification => {
        return notification.departmentId === department && (notification.status == 1 || notification.status == 11)
    })
    // let htmlsUser = [];

    // request của user đăng nhập đã được xử lý
    let htmlsUser = notificationsUser.map((error, index) => {
        if (error.status == 2) {
            return `<div class="noti-child id-${error.id}" onclick="notificationItemQuantity('${error.id}')" ><h5>${error.handleUser}</h5> đang xử lý yêu cầu có mã số: <h5>${error.requestCode}</h5> của bạn<div><span style = "color: red;">${error.notification}</span></div></div>`;
            // htmlsUser.push(`<div class="noti-child" onclick="notificationItemQuantity('${error.id}')" ><h5>${error.handleUser}</h5> đang xử lý yêu cầu có mã số: <h5>${error.requestCode}</h5> của bạn</div>`)
        } else if (error.status == 3) {
            return `<div class="noti-child id-${error.id}" onclick="notificationItemQuantity('${error.id}')" ><h5>${error.handleUser}</h5> đã xử lý xong yêu cầu có mã số: <h5>${error.requestCode}</h5> của bạn<div><span style = "color: red;">${error.notification}</span></div></div>`
            // htmlsUser.push(`<div class="noti-child" onclick="notificationItemQuantity('${error.id}')" ><h5>${error.handleUser}</h5> đã xử lý xong yêu cầu có mã số: <h5>${error.requestCode}</h5> của bạn</div>`)
        }
    })

    let htmlsUserHidden = notificationsUser.map((error, index) => {
        if (error.status == 22) {
            return `<div class="noti-child id-${error.id}" onclick="notificationItemQuantity('${error.id}')" ><h5>${error.handleUser}</h5> đang xử lý yêu cầu có mã số: <h5>${error.requestCode}</h5> của bạn<div><span style = "color: red;">${error.notification}</span></div></div>`;
            // htmlsUser.push(`<div class="noti-child" onclick="notificationItemQuantity('${error.id}')" ><h5>${error.handleUser}</h5> đang xử lý yêu cầu có mã số: <h5>${error.requestCode}</h5> của bạn</div>`)
        } else if (error.status == 33) {
            return `<div class="noti-child id-${error.id}" onclick="notificationItemQuantity('${error.id}')" ><h5>${error.handleUser}</h5> đã xử lý xong yêu cầu có mã số: <h5>${error.requestCode}</h5> của bạn<div><span style = "color: red;">${error.notification}</span></div></div>`;
            // htmlsUser.push(`<div class="noti-child" onclick="notificationItemQuantity('${error.id}')" ><h5>${error.handleUser}</h5> đã xử lý xong yêu cầu có mã số: <h5>${error.requestCode}</h5> của bạn</div>`)
        }
    })


    let htmlsDepartment = notificationsDepartment.map((error, index) => {
        if (error.status == 1) {
            return `<div class="noti-child id-${error.id}" onclick="notificationItemQuantity('${error.id}')"><h5>${error.errorUser}</h5> đã gửi yêu cầu xử lý mã số: <h5>${error.requestCode}</h5> đến bộ phận bạn.<div><span style = "color: red;">${error.notification}</span></div></div>`
        }
    })

    let htmlsDepartmentHidden = notificationsDepartment.map((error, index) => {
        if (error.status == 11) {
            return `<div class="noti-child id-${error.id}" onclick="notificationItemQuantity('${error.id}')"><h5>${error.errorUser}</h5> đã gửi yêu cầu xử lý mã số: <h5>${error.requestCode}</h5> đến bộ phận bạn.<div><span style = "color: red;">${error.errorTime}</span></div></div>`
        }
    })

    htmls = [...htmlsUser, ...htmlsUserHidden, ...htmlsDepartment, ...htmlsDepartmentHidden].filter(html => html !== undefined);
    htmlsQuantity = [...htmlsUser, ...htmlsDepartment].filter(html => html !== undefined);
    // console.log(htmls);
    let notificationsQuantity = htmlsQuantity.length;
    notificationItem.innerHTML = htmls.join('')
    if (notificationsQuantity) {
        notiQuantity.innerHTML = notificationsQuantity;
    } else {
        notiQuantity.innerHTML = '';
    }
    // console.log(notificationItem.innerHTML);
}


notificationsIcon.onclick = function () {
    if (notifications.style.display === 'block') {
        notifications.style.display = 'none';
        getError(() => renderNotifications());

    } else {
        notifications.style.display = 'block'
        getError(() => renderNotifications());
    }
}

// click vaof notifications thì render request sau trừ bớt số lượng thông báo
async function notificationItemQuantity(id) {
    let response = await fetch(handleErrors + "/" + id);
    let data = await response.json();
    let notificationChildItem = document.querySelector(`#header .notification-item .id-${id}`)
    let statusUpdate;

    if (data.status == 1) {
        statusUpdate = 11;
    };
    if (data.status == 2) {
        statusUpdate = 22;
    };
    if (data.status == 3) {
        statusUpdate = 33;
    };
    let dataUpdate = {
        status: statusUpdate
    }
    console.log(dataUpdate);
    let options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataUpdate), // body data type must match "Content-Type" header
    }
    await fetch(handleErrors + '/' + id, options)
        .then(course => course.json())
        .then(() => {
            notificationChildItem.style.backgroundColor = '#fff'
            getError(() => renderNotifications());
        })
}



