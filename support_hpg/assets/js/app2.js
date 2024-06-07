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
        return `<li class="course-item-${course.id}">
            <h4>${course.name}</h4>
            <p>${course.description}</p>
            <button onclick = "handleDeleteCourse(\'${course.id}\')">xóa</button>
            <button onclick = "putIdCourse(\'${course.id}\')">sửa</button>
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



// hàm xử lý việc xóa dữ liệu
function handleDeleteCourse(id) {
    let options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    };
    fetch(courseApi + "/" + id, options)
        // .then(reponse => reponse.json()) // trả về dữ liệu mà đã được fetch thực hiện với cấu hình HTTP obtions ở đối số thứ 2
        // .then(data => console.log('data đã đưuọc xóa'))
        .then(function () { //
            let courseItem = document.querySelector('.course-item-' + id)
            if (courseItem) {
                courseItem.remove();
            }
        });
};



// hàm sửa
function putIdCourse(id) {
    fetch(courseApi + '/' + id)
        .then(response => response.json())
        .then(course => handlePutCourse(course))
}

// hàm xử lý việc sửa dữ liệu

function handlePutCourse(course) {
    let modifyBtn = document.querySelector('#modify');
    let createBtn = document.querySelector('#create');
    let name = document.querySelector('input[name="name"]');
    let description = document.querySelector('input[name="description"]');
    createBtn.style.display = "none";
    modifyBtn.style.display = "inline-block";
    name.value = course.name;
    description.value = course.description;
    modifyBtn.onclick = function () {
        let dataUpdate = {
            name: name.value,
            description: description.value
        }
        let options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataUpdate), // body data type must match "Content-Type" header
        }
        fetch(courseApi + '/' + course.id, options)
            .then(course => course.json())
            .then(function () {
                name.value = '';
                description.value = '';
                createBtn.style.display = "inline-block";
                modifyBtn.style.display = "none";
                getCourseApi(renderCourse);
            })
    }
}


