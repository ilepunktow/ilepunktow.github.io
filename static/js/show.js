try {
    const REQ = ['marks', 'exams', 'addition', 'achievements', 'total'];
    const url = location.href;
    const hash = decodeURI(location.hash);
    jsonStr = atob(hash.substr(3));
    const json = JSON.parse(jsonStr);

    for(let x of REQ)
        if (!(x in json))
            throw new Error('invalid json');
        else {
            $(`.i-${x}`).text(json[x]);
        }

    $("#share").on('click', function () {
        $(this).hide();
        $("#link-section").show();

        navigator.clipboard.writeText(url).then(function() {
            $("#copy-status").html('<b>Skopiowano</b>');
        }, function(err) {
            $("#copy-status".html('Błąd, proszę skopiować "ręcznie"'));
        });

        $("#link-input").val(url);
    });


} catch (e) {
    console.log(e);
    window.location.replace('/');
}

$("#restart").on('click', function () {
    location.replace('/');
});
