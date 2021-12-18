let timeInterval;

//load each step where the user is located
const load = () => {
    let allViewStatus;
    let allQuestionsInLS;
    if (localStorage.getItem('allViewStatus') === null) {
        allViewStatus = [{
            nameStatus: 'start',
            viewStatus: true
        }, {
            nameStatus: 'showQuestions',
            viewStatus: false
        }, {
            nameStatus: 'endQuestions',
            viewStatus: false
        }, {
            nameStatus: 'reviewAnswers',
            viewStatus: false
        }];
    } else {
        allViewStatus = JSON.parse(localStorage.getItem('allViewStatus'))
    }
    let view = allViewStatus.find(status => {
        return status.viewStatus === true
    })
    if (!Cookies.get('questionIndex') || !Cookies.get('answerIndex')) {
        Cookies.set('questionIndex', 0);
        Cookies.set('answerIndex', 0);
    }
    switch (view.nameStatus) {
        case 'start':
            allQuestionsInLS = allQuestions;
            localStorage.setItem('allQuestionsInLS', JSON.stringify(allQuestionsInLS))
            Cookies.set('seconds', 45);
            start();
            break;
        case 'showQuestions':
            questionIndex();
            timer('start');
            break;
        case 'endQuestions':
            timer('end');
            endQuestions();
            break;
        case 'reviewAnswers':
            answerIndex()
            break;

        default:
            break;
    }
    localStorage.setItem('allViewStatus', JSON.stringify(allViewStatus))

}

//Change the step
const changeViewStatus = (viewStatus) => {
    let allViewStatus;
    if (localStorage.getItem('allViewStatus') === null) {
        allViewStatus = [{
            nameStatus: 'start',
            viewStatus: true
        }, {
            nameStatus: 'showQuestions',
            viewStatus: false
        }, {
            nameStatus: 'endQuestions',
            viewStatus: false
        }, {
            nameStatus: 'reviewAnswers',
            viewStatus: false
        }]
    } else {
        allViewStatus = JSON.parse(localStorage.getItem('allViewStatus'))
    }
    allViewStatus.forEach(status => {
        if (status.nameStatus === viewStatus) {
            status.viewStatus = true;
        } else {
            status.viewStatus = false;
        }
    });
    localStorage.setItem('allViewStatus', JSON.stringify(allViewStatus))
    load();
}

//Circulation in questions
const questionIndex = (status) => {
    let index;
    index = Number(Cookies.get('questionIndex'));

    if (status === 'next') {
        ++index;
        Cookies.set('questionIndex', index);
        showQuestions(index);
    } else if (status === 'prev') {
        --index;
        Cookies.set('questionIndex', index);
        showQuestions(index);
    } else {
        showQuestions(index);
    }

}

//Circulation in review answers
const answerIndex = (status) => {
    let index;
    index = Number(Cookies.get('answerIndex'));
    if (status === 'next') {
        ++index;
        Cookies.set('answerIndex', index);
        reviewAnswer(index);
    } else if (status === 'prev') {
        --index;
        Cookies.set('answerIndex', index);
        reviewAnswer(index);
    } else {
        reviewAnswer(index);
    }
}

//Test time
const timer = (status) => {
    if (status === 'start') {
        timeInterval = setInterval(() => {
            let timer = Number(Cookies.get('seconds'));
            --timer;
            Cookies.set('seconds', timer);
            showTime(timer);
            if (timer === 0) {
                showTime(timer);
                clearInterval(timeInterval)
                changeViewStatus('endQuestions');
            }
        }, 1000)
    } else if (status === 'end') {
        clearInterval(timeInterval)
    }
}

//The answer that the user chooses
const userSelection = (answer) => {
    let allQuestions = JSON.parse(localStorage.getItem('allQuestionsInLS'));
    let index = Cookies.get('questionIndex');
    allQuestions[index].userSelection = answer;
    localStorage.setItem('allQuestionsInLS', JSON.stringify(allQuestions))
}

//Start from the beginning
const reset = () => {
    localStorage.clear();
    for (let cookie in Cookies.get()) {
        Cookies.remove(cookie)
    }
    load();
}