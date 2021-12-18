//Starting step
const start = () => {
    let time = Cookies.get('seconds');
    let allQuestions = JSON.parse(localStorage.getItem('allQuestionsInLS'));
    let view = `<div class="col-xl-6 col-lg-7 col-md-9 col-sm-10 text-center" id="start">
    <h5>خوش آمدید!</h5>
    <p>آزمون دارای <strong class="fs-5"> ${allQuestions.length} </strong>سوال است و شما <strong class="fs-5"> ${time} ثانیه </strong> زمان دارید تا به سوالات پاسخ دهید</p>
    <form onsubmit="startShowQuestions(event)" class="form-floating mb-3">
        <input type="text" class="form-control text-start rounded-pill" name="username" id="userName" placeholder="نام کاربری">
        <label for="userName">نام کاربری</label>
        <i class="bi bi-person-fill rounded-circle p-2"></i>
        <button type="submit" class="btn rounded-pill">شروع</button>
    </form>
    <div id="is-invalid" class="opacity-0"><i class="bi bi-bookmark-x-fill me-2"></i>لطفا یک نام کاربری وارد کنید</div>
</div>`;
    document.getElementById('view').classList.add('h-100');
    document.getElementById('view').innerHTML = view;
}

//Username validation and start questions
const startShowQuestions = (e) => {
    let form = new FormData(e.target)
    if (form.get('username').trim() === '') {
        document.getElementById('userName').classList.add('is-invalid');
        document.getElementById('is-invalid').classList.replace('opacity-0', 'opacity-100');
    } else {
        Cookies.set('username', form.get('username'))
        changeViewStatus('showQuestions');
    }
    e.preventDefault();
}

//Question display step
const showQuestions = (questionIndex) => {
    let allQuestions = JSON.parse(localStorage.getItem('allQuestionsInLS'));
    let question = allQuestions[questionIndex];
    let view = `
            <div class="col-12 text-white d-flex justify-content-center mt-2" id="userInformation">
            <div class="userName d-flex me-5"><i class="bi bi-person-fill fs-5 me-2"></i>${Cookies.get('username')}</div>
            <div class="d-flex"><i class="bi bi-stopwatch fs-5 me-2"></i> <span id="time">${Cookies.get('seconds')}</span>:00</div>
        </div>
        <div class="col-sm-8 col-11  p-3" id="contentQuestion">
            <div class="d-flex flex-wrap justify-content-center content">
                <div class="w-100 text-center question my-3">
                    <h5>${question.title}</h5>
                </div>
                <div onclick="selectAnswer(event)" class="d-flex align-items-center justify-content-center text-center answer m-3 px-3 py-2" id="option_1">${question.option_1}</div>
                <div onclick="selectAnswer(event)" class="d-flex align-items-center justify-content-center text-center answer m-3 px-3 py-2" id="option_2">${question.option_2}</div>
                <div onclick="selectAnswer(event)" class="d-flex align-items-center justify-content-center text-center answer m-3 px-3 py-2" id="option_3">${question.option_3}</div>
                <div onclick="selectAnswer(event)" class="d-flex align-items-center justify-content-center text-center answer m-3 px-3 py-2" id="option_4">${question.option_4}</div>
            </div>
            <div class="rounded-pill text-center counter px-4 py-2">سوال ${question.questionNumber} از 5</div>
        </div>
        <div id="buttons" class="col-sm-8 col-11 d-flex align-items-center justify-content-between my-3 px-0">
        </div>
            `;

    document.getElementById('view').classList.remove('h-100');
    document.getElementById('view').innerHTML = view;
    let allAnswer = document.querySelectorAll('.answer');
    allAnswer.forEach(answer => {
        if (answer.id === question.userSelection) {
            answer.classList.add('active')
        }
    })

    if (allQuestions.length === question.questionNumber) {
        document.getElementById('buttons').innerHTML = `
        <button id="btn-next" onclick="changeViewStatus('endQuestions')" class="btn btn-next rounded-pill">پایان آزمون</button>
        <button id="btn-prev" onclick="questionIndex('prev')" class="btn btn-prev rounded-pill"><span>سوال قبل</span> <i class="bi bi-chevron-double-left"></i></button>
        `;
    } else {
        document.getElementById('buttons').innerHTML = `
        <button id="btn-next" onclick="questionIndex('next')" class="btn btn-next rounded-pill"><i class="bi bi-chevron-double-right"></i> سوال بعد</button>
        <button id="btn-prev" onclick="questionIndex('prev')" class="btn btn-prev rounded-pill"><span>سوال قبل</span> <i class="bi bi-chevron-double-left"></i></button>
        `;
    }
    if (question.questionNumber === 1) {
        document.getElementById('btn-prev').disabled = true;
    }
}

//Test end step and show results
const endQuestions = () => {
    let allQuestions = JSON.parse(localStorage.getItem('allQuestionsInLS'));
    let trueAnswer = 0,
        falseAnswer = 0,
        noAnswer = 0;
    allQuestions.forEach(question => {
        if (question.userSelection === question.correctOption) {
            ++trueAnswer;
        } else if (question.userSelection === null) {
            ++noAnswer;
        } else {
            ++falseAnswer;
        }
    })
    let view = `
            <div class="col-12">
            <div class="row justify-content-center">
                <div class="col-12 my-3">
                    <h4 class="text-center"><strong>آزمون شما به پایان رسید!</strong></h4 class="text-center">
                </div>
                <div class="col-xl-2 col-md-3 col-6 mb-2 mb-md-0">
                    <div class="card true-status">
                        <div class="card-body">
                            <div class="icon-status"><i class="bi bi-bookmark-check-fill"></i></div>
                            <p class="text-status">پاسخ صحیح</p>
                            <p><span class="number-status">${trueAnswer}</span> سوال</p>
                        </div>
                    </div>
                </div>
                <div class="col-xl-2 col-md-3 col-6 mb-2 mb-md-0">
                    <div class="card false-status">
                        <div class="card-body">
                            <div class="icon-status"><i class="bi bi-bookmark-x-fill"></i></div>
                            <p class="text-status">پاسخ غلط</p>
                            <p><span class="number-status">${falseAnswer}</span> سوال</p>
                        </div>
                    </div>
                </div>
                <div class="col-xl-2 col-md-3 col-6">
                    <div class="card no-answer">
                        <div class="card-body">
                            <div class="icon-status"><i class="bi bi-bookmark-fill"></i></div>
                            <p class="text-status">پاسخ داده نشده</p>
                            <p><span class="number-status">${noAnswer}</span> سوال</p>
                        </div>
                    </div>
                </div>
                <div class="col-xl-2 col-md-3 col-6">
                    <div class="card remaining-time">
                        <div class="card-body">
                            <div class="icon-status"><i class="bi bi-alarm-fill"></i></div>
                            <p class="text-status">زمان باقیمانده</p>
                            <p>00:<span id="time">${Cookies.get('seconds')}</span></p>
                        </div>
                    </div>
                </div>
                <div class="col-12 d-flex justify-content-center align-items-center my-3">
                    <button onclick="changeViewStatus('reviewAnswers')" class="btn rounded-pill btn-review">مرور پاسخ ها</button>
                    <button onclick="reset()" class="btn rounded-pill btn-end">پایان آزمون بدون مرور</button>
                </div>
            </div>
        </div>    
    `;
    document.getElementById('view').classList.add('h-100');
    document.getElementById('view').innerHTML = view;
    let time = Cookies.get('seconds');
    showTime(time);
}

//Review answers step
const reviewAnswer = (reviewIndex) => {
    let allQuestions = JSON.parse(localStorage.getItem('allQuestionsInLS'));
    let review = allQuestions[reviewIndex];
    let view = `
            <div class="col-sm-8 col-11  p-3" id="contentQuestion">
            <div class="d-flex flex-wrap justify-content-center content">
                <div class="w-100 text-center question my-3">
                    <h5>${review.title}</h5>
                    <div id="answer-alert"></div>
                </div>
                <div class="d-flex align-items-center justify-content-center text-center answer-review m-3 px-3 py-2" id="option_1">${review.option_1}</div>
                <div class="d-flex align-items-center justify-content-center text-center answer-review m-3 px-3 py-2" id="option_2">${review.option_2}</div>
                <div class="d-flex align-items-center justify-content-center text-center answer-review m-3 px-3 py-2" id="option_3">${review.option_3}</div>
                <div class="d-flex align-items-center justify-content-center text-center answer-review m-3 px-3 py-2" id="option_4">${review.option_4}</div>
            </div>
            <div class="rounded-pill text-center counter px-4 py-2">سوال ${review.questionNumber} از 5</div>
        </div>
        <div id="buttons" class="col-sm-8 col-11 d-flex align-items-center justify-content-between my-3 px-0">
        </div>
    `;
    document.getElementById('view').classList.remove('h-100');
    document.getElementById('view').innerHTML = view;
    if (review.correctOption === review.userSelection) {
        document.getElementById('answer-alert').innerHTML = showAnswerAlert(true);
        document.getElementById('answer-alert').classList.add('answer-true');
        let allAnswerReview = Array.from(document.querySelectorAll('.answer-review'));
        allAnswerReview.forEach(answer => {
            if (answer.id === review.userSelection) {
                answer.classList.add('answer-true')
            }
        })
    } else if (review.userSelection === null) {
        let allAnswerReview = Array.from(document.querySelectorAll('.answer-review'));
        let indexCorrectOption = allAnswerReview.findIndex(answer => answer.id === review.correctOption)
        document.getElementById('answer-alert').innerHTML = showAnswerAlert('noAnswer', ++indexCorrectOption);
        document.getElementById('answer-alert').classList.add('answer-noAnswer');
        allAnswerReview.forEach(answer => {
            if (answer.id === review.correctOption) {
                answer.classList.add('answer-noAnswer')
            }
        })
    } else {
        let allAnswerReview = Array.from(document.querySelectorAll('.answer-review'));
        let indexCorrectOption = allAnswerReview.findIndex(answer => answer.id === review.correctOption)
        document.getElementById('answer-alert').innerHTML = showAnswerAlert(false, ++indexCorrectOption);
        document.getElementById('answer-alert').classList.add('answer-false');
        allAnswerReview.forEach(answer => {
            if (answer.id === review.userSelection) {
                answer.classList.add('answer-false')
            } else if (answer.id === review.correctOption) {
                answer.classList.add('answer-true')
            }
        })
    }
    if (allQuestions.length === review.questionNumber) {
        document.getElementById('buttons').innerHTML = `
        <button id="btn-next" onclick="reset()" class="btn btn-next rounded-pill">پایان آزمون</button>
        <button id="btn-prev" onclick="answerIndex('prev')" class="btn btn-prev rounded-pill"><span>سوال قبل</span> <i class="bi bi-chevron-double-left"></i></button>
        `;
    } else {
        document.getElementById('buttons').innerHTML = `
        <button id="btn-next" onclick="answerIndex('next')" class="btn btn-next rounded-pill"><i class="bi bi-chevron-double-right"></i> سوال بعد</button>
        <button id="btn-prev" onclick="answerIndex('prev')" class="btn btn-prev rounded-pill"><span>سوال قبل</span> <i class="bi bi-chevron-double-left"></i></button>
        `;
    }
    if (review.questionNumber === 1) {
        document.getElementById('btn-prev').disabled = true;
    }
}

//View user selection
const selectAnswer = (e) => {
    let elementUserAnswer = e.currentTarget;
    let allAnswer = document.querySelectorAll('.answer');
    allAnswer.forEach(answer => {
        if (answer.classList.contains('active')) {
            answer.classList.remove('active')
        }
    })
    elementUserAnswer.classList.add('active');
    userSelection(elementUserAnswer.id);
}

//Show alerts in review answers
const showAnswerAlert = (answerStatus, correctOption) => {
    if (answerStatus === true) {
        return `<i class="bi bi-bookmark-check-fill me-2"></i>شما به این سوال پاسخ صحیح دادید.`;
    } else if (answerStatus === false) {
        return `<i class="bi bi-bookmark-x-fill me-2"></i>شما به این سوال پاسخ غلط دادید.گزینه ${correctOption} صحیح است`;
    } else {
        return `<i class="bi bi-bookmark-fill me-2"></i>شما به این سوال پاسخ ندادید.گزینه ${correctOption} صحیح است`
    }
}

//Show test time
const showTime = (time) => {
    time < 10 ? time = `0${time}` : time = time;
    document.getElementById('time').innerHTML = time;
}