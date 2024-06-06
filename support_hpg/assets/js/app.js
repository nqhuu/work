let courseApi = 'http://localhost:3000/courses'

function start() {
    getCourese(renderCourses)
    handleCreatForm()
}

start();

// functions ************************

function getCourese(callback) {
    fetch(courseApi) // gọi api bằng fetch
        .then(function (response) {
            return response.json(); //chuyển đổi kiểu dữ liệu json sang js
        })
        .then(callback); // đưa dữ liệu response.json() vừa lấy về vào trong hàm callback tiếp theo 
}

// hàm tạo thêm data
function createCourse(data, callback) {
    let options = { //lấy phương thức POST để sử dụng cho việc tạo dữ liệu
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    };
    fetch(courseApi, options) // gọi API và options POST
        .then(function (response) {
            return response.json(); // đưa dữ liệu json sang js
        })
        .then(callback); // đưa dữ liệu response.json() vào hàm callback tiếp theo 
}

//tạo hàm xử lý xóa dữ liệu với dữ liệu id được đưa vào hàm
function handleDeleteCourse(id) {
    let options = { // lấy phương thức DELETE để thực hiện việc xóa dữ liệu
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        },
    };
    fetch(courseApi + '/' + id, options) //gọi tới API có id cụ thể để xác định được thẻ cần xóa
        .then(function (response) {
            response.json(); //đưa dữ liệ json sang js 
        })
        .then(function () {
            let courseItem = document.querySelector('.course-item-' + id); //
            if (courseItem) {
                courseItem.remove();
            }
        });
}

//Hàm xử lý đưa dữ liệu được gọi hiển thị lên giao diện
function renderCourses(courses) {
    let listCoursesBlock = document.querySelector('#list-courses'); //lấy DOM của thẻ có id list-courses
    let htmls = courses.map(function (course) { //lặp qua mảng dữ liệu courses sau đó trả về dữ liệu dk xử lý vào thẻ li đối số courses sẽ được lấy tại hàm getCourese
        // khi đưa hàm renderCourses vào getCourese thì renderCourses chính là hàm callback và sử dụng dữ liệu mảng dk .then của hàm getCourese
        return `
            <li class="course-item-${course.id}">
                <h4>${course.name}</h4>
                <p>${course.description}</p>
                <button onclick="handleDeleteCourse(\'${course.id}\')">Xóa</button>
            </li>
        `;
    });
    listCoursesBlock.innerHTML = htmls.join(''); // đưa dữ liệu innerHTML vào trong thẻ dk đặt biến listCoursesBlock với dữ liệu là chuỗi bao gôm các phần từ của mảng htmls đã được nối lại với nhau bằng hàm jon("")
}

// hàm xử lý tạo dữ liệu
function handleCreatForm() {
    let createBtn = document.querySelector('#create') // lấy về DOM của nút create
    createBtn.onclick = function () { // DOM event
        let name = document.querySelector('input[name="name"]').value; // lấy về value (dữ liệu) của thẻ input có name = "name"
        let description = document.querySelector('input[name="description"]').value; // lấy về value (dữ liệu) của thẻ input có name = "description"

        let formData = { // tạo 1 object với key bằng name và description, có value tương ứng là biến name và description được tạo phía trên
            name: name,
            description: description
        };
        createCourse(formData, function () { // gọi lại hàm createCourse với 2 đối số là biến formData và hàm callback. callback ở đây không có đối số mà chỉ sử dụng để chạy hàm getCourese(renderCourses); khi .this(callback) của hàm createCourse gọi
            getCourese(renderCourses); // gọi lại hàm getCourese(renderCourses) là hàm callback và xử lý để đưa dữ liệu render lên màn hình
        });
    }
}

