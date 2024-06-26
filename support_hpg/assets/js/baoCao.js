// db
let account = 'http://localhost:3000/account';
let categoty = 'http://localhost:3000/category';
let handleErrors = 'http://localhost:3000/handleError'
let countCodeRequest = 'http://localhost:3000/countCodeRequest'


// gọi dom
let domBaoCao = {
    barChart: document.querySelector('#report-table .bar-chart'),
    reportBody: document.querySelector('#report-table .report-body'),
    deparmentsName: document.querySelector('#header .deparments-name span'),
    btnDepartments: Array.from(document.querySelectorAll('#footer .btn-report-deparments button')),
    home: document.querySelector('#header .img-logo')
}

let date = new Date();

function startReport() {
    renderReport(reportYear())
    domBaoCao.deparmentsName.innerHTML = `Báo cáo năm ${date.getFullYear()}`
}

startReport();

// gọi tổng lỗi
async function getError() {
    let response = await fetch(handleErrors);
    let errors = await response.json();
    return errors;
}

// gọi lỗi theo năm
async function getErorYear() {
    let errorAll = getError();
    let formatedYear = String(date.getFullYear()).slice(-2);
    return formatedYear;
}

// render ra màn hình 
async function renderReport(callback) {
    let htmls = '';
    let reportBodyHtmls = '';
    let errors = await callback;
    Object.keys(errors).forEach(key => {
        let monthCurrent = errors[key];
        let sumLength = monthCurrent.length;
        let sumAllPercent = (sumLength / 50) * 100;
        let complete = monthCurrent.filter(element => {
            if (element.status == 3 || element.status == 33) {
                return element;
            }
        })
        let completeLength = complete.length;
        let completePercent = (completeLength / 50) * 100;

        let backlog = monthCurrent.filter(element => {
            if (element.status !== 3 && element.status !== 33) {
                return element;
            }
        })
        let backlogLength = backlog.length;
        let backlogPercent = (backlogLength / 50) * 100;

        htmls += `<div class="bar-chart-month">
                <h3 class="month">Tháng ${key}</h3>
                <div class="backlog" style="--percent: ${backlogPercent}%">${backlogLength}</div>
                <div class="complete" style="--percent: ${completePercent}%">${completeLength}</div>
                <div class="sumAll" style="--percent: ${sumAllPercent}%">${sumLength}</div>
                </div>`
        reportBodyHtmls += `<tr class="title-row">
                        <td>Tháng ${key}</td>
                        <td>${sumLength}</td>
                        <td>${completeLength}</td>
                        <td>${backlogLength}</td>
                    </tr>`
    })
    domBaoCao.barChart.innerHTML = htmls;
    domBaoCao.reportBody.innerHTML = reportBodyHtmls;
}



// xử lý dữ liệu lỗi của năm
// các lỗi trong năm
async function errorYearNow() {
    let errorAll = await getError()
    let yearNow = await getErorYear()
    let errorYear = errorAll.filter(error => {
        let errors = [];
        let numberYear = String(error.requestCode.slice(4, 6))
        if (yearNow == numberYear) {
            errors.push(error)
        }
        return errors;
    })
    return errorYear;
}

// lọc theo tháng 
async function reportYear() {
    // domBaoCao.deparmentsName.innerHTML = `Báo cáo năm ${date.getFullYear()}`
    let error = {};
    let errorYear = await errorYearNow();
    errorYear.forEach(element => {
        let monthLocal = String(element.requestCode).slice(2, 4)
        if (!error[monthLocal]) {
            error[monthLocal] = []
        }
        error[monthLocal].push(element)
    });
    return error;
}


// xử lý dữ liệu lỗi của bộ phận
// Lọc dữ liệu theo department 
async function reportDepartment(department) {
    let errorDepartment = {};
    let errorYear = await reportYear();
    Object.keys(errorYear).forEach(key => {
        if (!errorDepartment[key]) {
            errorDepartment[key] = []
        }
        errorDepartment[key] = errorYear[key].filter(element => element.departmentId === department) //`"${department}"`
    })
    return errorDepartment;
}


//click để render ra màn hình
domBaoCao.btnDepartments.forEach((btnDepartment, index) => {
    let departmentName = btnDepartment.innerHTML;
    if (index < domBaoCao.btnDepartments.length - 1) {
        btnDepartment.addEventListener('click', () => {
            let department = btnDepartment.classList.value;
            domBaoCao.deparmentsName.innerHTML = `Báo cáo ${departmentName} năm ${date.getFullYear()}`
            renderReport(reportDepartment(department));
        })
    } else {
        btnDepartment.addEventListener('click', () => {
            domBaoCao.deparmentsName.innerHTML = `Báo cáo năm ${date.getFullYear()}`
            renderReport(reportYear());
        })
    }
})

///HOME

domBaoCao.home.addEventListener('click', () => {
    window.location.href = "http://127.0.0.1:5500/support_hpg/index.html";
})