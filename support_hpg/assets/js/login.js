

let dataAccount = JSON.parse(localStorage.getItem('account')); // lấy dữ liệu mảng account từ file scrip.js sang theo định gạn JSON và trả về dạng mảng ban đầu
// console.log(dataAccount);

fetch('login.html')
    .then(reponse => reponse.text())
    .then(data1 => {
        let userElement = document.querySelector('input[id="username"]');
        let passwordElement = document.querySelector('input[id="password"]');
        // let website = document.querySelector('a[id="webHpg"]')
        let alertError = document.querySelector('#login .login-form .alert')
        // console.log(alertError);
        let username = '';
        userElement.oninput = function (event) {
            username = event.target.value;
        }

        let password = '';
        passwordElement.oninput = function (event) {
            password = event.target.value
        }

        let summit = document.querySelector('#login .login  ')
        summit.onclick = function (event) {
            event.preventDefault();
            let kq = false;
            let checkAccount;
            if (username.length === 0 || username.length < 3) {
                alertError.innerHTML = 'Nhập tài khoản có nhiều hơn 2 ký tự'
                alert('Nhập tài khoản có nhiều hơn 2 ký tự')
            } else if (username.length >= 3) {
                if (password.length === 0 || password.length < 3) {
                    alert('Mật khẩu không được để trống và phải có ít nhất 2 ký tự')
                } else {
                    checkAccount = account.find(item => item.user === username && item.password === password)
                    if (checkAccount) {
                        alert('Bạn đã đăng nhập thành công');
                        kq = true;
                        fetch('index.html')
                            .then(reponse => reponse.text())
                            .then(data2 => {
                                document.addEventListener('DOMContentLoaded', function () {
                                    let overlay = document.querySelector('overlay')
                                    overlay.addEventListener()
                                    console.log(overlay);
                                })
                            })
                    } else {
                        alert('Sai tài khoản hoặc mật khẩu')
                    }
                }

                // if (kq) {
                //     window.location.href = website.href;
                // };
            }

        }
    })


