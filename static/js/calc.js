function getMarkValue(section) {
    for(let btn of section.children){
        btn = $(btn);
        if(btn.attr('data-selected') === '1')
            return parseInt(btn.attr('data-points'));
    }
}

function removeErrors() {
    for(let x of Array.from($(".exam-input")))
        $(x.parentNode).removeClass("error");

    for(let x of Array.from($(".btn-section")))
        $(x).removeClass("error");
}

function validExamAndMark(){
    let valid = 1;
    let errorId = 0;

    function setError(error, id=error){
        valid = 0;
        error.addClass("error");
        if(!errorId)
            errorId = id.attr('id');
    }
    Array.from($('.btn-section')).forEach(x => {
        let temp = 0;

        for (let y of Array.from(x.children))
            if ($(y).attr('data-selected') === '1') {
                temp = 1;
                break;
            }

        if(!temp)
            setError($(x));

    });

    Array.from($('.exam-input')).forEach(x => {
        if (isNaN(x.valueAsNumber) || x.valueAsNumber > 100 || x.valueAsNumber < 0)
            setError($(x.parentNode), $(x));

    });



    return [valid, errorId];
}

$('.exam-input').change(function () {
    if(this.valueAsNumber < 0)
        this.value = 0;
    else if(this.valueAsNumber > 100)
        this.value = 100;
    else if(isNaN(this.valueAsNumber))
        this.value = 0;
});

$('.radio').on("click", function () {
        removeErrors();
        const t = $(this);
        Array.from(this.parentNode.children).map(function (x) {
            x = $(x);
            if(x.attr('id') === t.attr('id')) {
                x.addClass('btn-outline-success');
                x.attr('data-selected', 1);
            }
            else {
                x.removeClass('btn-outline-success');
                x.attr('data-selected', 0);
            }
        });
    });

$("#show-achievements").click(function () {
    $("#achievements-section").toggle();
    console.log($(this).attr('data-status'));
    if($(this).attr('data-status') === "0") {
        $(this).text("Osiągnięcia (zwiń)");
        $(this).attr('data-status', "1");
    } else {
        $(this).text("Osiągnięcia (rozwiń)");
        $(this).attr('data-status', "0");
    }

});

$("#run").click(function () {
    removeErrors();
    let valid = validExamAndMark();
    if (valid[0]) {
        let markPoints = 0;
        Array.from($('.btn-section')).forEach(x => markPoints += getMarkValue(x));

        let examPoints = 0;
        Array.from($('.exam-input')).forEach(x => examPoints += parseFloat($(x).attr('data-multiplier')) * x.valueAsNumber);

        let additionPoints = 0;
        Array.from($('.addition')).forEach(x => {
            if (x.checked)
                additionPoints += parseInt($(x).attr('data-points'));
        });

        let achievementPoints = 0;
        Array.from($('.achievement')).forEach(x => {
            if (x.checked)
                achievementPoints += parseInt($(x).attr('data-points'));
        });

        if (achievementPoints > 18)
            achievementPoints = 18;

        let points = markPoints + examPoints + additionPoints + achievementPoints;

        let json = {
            marks: markPoints,
            exams: examPoints,
            addition: additionPoints,
            achievements: achievementPoints,
            total: points
        };

        const resultURL = `/result/#>>${btoa(JSON.stringify(json))}`;

        location.replace(resultURL);
    }else
        location.href = `#${valid[1]}`;
});
