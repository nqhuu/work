let courseApi = 'http://localhost:3000/courses';

// Hàm khởi động chương trình
function start() {
    getCourseApi(renderCourse);
    handleCreateForm();
};

start();

// các hàm xử lý************************************

// GET dữ liệu về

function getCourseApi(callback) {
    fetch(courseApi)
        .then(reponse => reponse.json())
        .then(callback);
}

//  Render lên màn hình

function renderCourse(courses) {
    let listCoursesBlock = document.querySelector('#list-courses');
    let htmls = courses.map(course => {
        return `<li>
            <h4>${course.name}</h4>
            <p>${course.description}</p>
        </li>`
    })
    listCoursesBlock.innerHTML = htmls.join("");
}


// Hàm tạo thêm dữ liệu

function createCourse(data, callback) {
    // Phương thức POST 
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    }

    fetch(courseApi, options)
        .then(reponse => reponse.json())
        .then(callback) // sẽ gọi hàm lấy dữ liệu về đây
}

// hàm lấy dữ liệu về từ giao diện form

function handleCreateForm() {
    let createBtn = document.querySelector('#create')
    createBtn.onclick = function () {
        let name = document.querySelector('input[name="name"]').value;
        let description = document.querySelector('input[name="description"]').value;
        let formData = {
            name: name,
            description: description
        };
        createCourse(formData, () => {
            getCourseApi(renderCourse);
        });
    };
};