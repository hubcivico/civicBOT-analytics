function fechaFormatter(value, row) {
    var string = String(value);
    var fecha = string.split("T");
    return fecha[0];
}

function imageFormatter(value, row) {
    return '<img src="' + value + '" width="100" height="50"/>';
}

function editarLabelFormatter(value, row) {
    return '<input id="label" value="' + value + '" list="labelList"/>';
}

function editarPartyFormatter(value, row) {
    return '<input id="party" value="' + value + '" list="partyList"/>';
}

function editarLocationFormatter(value, row) {
    return '<input id="location" value="' + value + '" list="locationList"/>';
}

function editarMediaFormatter(value, row) {
    return '<input id="media" value="' + value + '" list="mediaList"/>';
}

function publishedFormatter(value, row) {
    if (row.published == true) {
        return '<span class="glyphicon glyphicon-ok" style="color: blue"/>';
    } else {
        return '<span class="glyphicon glyphicon-remove" style="color: blue"/>';
    }
}

function editedFormatter(value, row) {
    if (row.edited == true) {
        return '<span class="glyphicon glyphicon-ok" style="color: blue"/>';
    } else {
        return '<span class="glyphicon glyphicon-remove" style="color: blue"/>';
    }
}

function responseHandler(res) {
    $.each(res.rows, function (i, row) {
        row.state = $.inArray(row.id, selections) !== -1;
    });
    return res;
}

function detailFormatter(index, row) {
    var html = [];
    html.push('<table><tr><td>');
    //  $.each(row, function(key, value) {
    //    console.log("key: " + key);
    //    console.log("value: " + value);

    html.push('<table><tr><td><b>Categoria: </b>' + row.label.name + '</td></tr>' + '<tr><td><b>Partido pol&iacutetico: </b>' + row.party.party + '</td></tr>' +
        '<tr><td><b>Municipio: </b>' + row.location.name + ',' + row.location.cp + '</td></tr>' +
        '<tr><td><b>Medios de comunicaci&oacuten: </b>' + row.media.media + '</td></tr></table>');

    //  });
    html.push('</td><td><img src="' + row.photo + '"  width="300" height="200"/></td></tr></table>');
    return html.join('');
}

function operateFormatter(value, row, index) {
    if (row.published == false) {
        return [
            '<div class="btn-toolbar" role="group" align="center">',
            ' <button type="button" class="btn btn-success save"><span class="glyphicon glyphicon-save"/></button>',
            '<button type="button" class="btn btn-danger unpublish"><span class="glyphicon glyphicon-remove"/></button>',
            '</div>'
        ].join('');
    } else {
        return [
            '<div class="btn-toolbar" role="group" align="center">',
            ' <button type="button" class="btn btn-success save"><span class="glyphicon glyphicon-save"/></button>',
            '<button type="button" class="btn btn-info publish"><span class="glyphicon glyphicon-ok"/></button>',
            '</div>'
        ].join('');
    }

}

window.operateEvents = {
    'click .save': function (e, value, row, index) {
        console.log("save");
        console.log("row: " + row.id +
            " label/" + row.label.id + " party/" + row.party.id + " location/" + row.location.id + "//" + row.location.name + " media/" + row.media.id + "/");
        console.log(storeLocation.setParty);
        console.log(storeLocation.setMedia);
        console.log(storeLocation.setLocation);
        console.log(storeLocation.setLabel);

        setParty(row.id, row.party.id);
        setLocation(row.id, row.location.id);
        setLabel(row.id, row.label.id);
        setMedia(row.id, row.media.name, row.media.id);

    },
    'click .publish': function (e, value, row, index) {
        console.log("publish")
        if (row.published == false) {
            setToPublish(row.id, 1);
        }
    },
    'click .unpublish': function (e, value, row, index) {
        console.log("unpublish");
        console.log(row.label.name);
        if (row.published == true) {
            setToPublish(row.id, 0);
        }
    }
};

function setParty(contribId, partyId) {
    $.ajax({
        type: "POST",
        url: api + "Private/setParty",
        data: '{"contribId": "' + contribId + '", "partyId" : "' + partyId + '"}',
        headers: {
            'Authorization': "Bearer " + localStorage.token
        },
        success: function () {
            console.log('OK');
        }
    });
}

//TODO: Revisar parámetros en función de arquitectura api
function setMediaId(contribId, mediaId) {
    $.ajax({
        type: "POST",
        url: api + "Private/setMedia",
        data: '{"contribId": "' + contribId + '","mediaId" : "' + mediaId + '"}',
        headers: {
            'Authorization': "Bearer " + localStorage.token
        },
        success: function () {
            console.log('OK');
        }
    });
}
function setMediaName(contribId, mediaName) {
    $.ajax({
        type: "POST",
        url: api + "Private/setMedia",
        data: '{"contribId": "' + contribId + '","mediaName": "' + mediaName + '"}',
        headers: {
            'Authorization': "Bearer " + localStorage.token
        },
        success: function () {
            console.log('OK');
        }
    });
}

function setLocation(contribId, locationId) {
    $.ajax({
        type: "POST",
        url: api + "Private/setLocation",
        data: '{"contribId": "' + contribId + '", "locationId" : "' + locationId + '"}',
        headers: {
            'Authorization': "Bearer " + localStorage.token
        },
        success: function () {
            console.log('OK');
        }
    });
}

function setLabel(contribId, labelId) {
    $.ajax({
        type: "POST",
        url: api + "Private/setLabel",
        data: '{"contribId": "' + contribId + '", "labelId" : "' + labelId + '"}',
        headers: {
            'Authorization': "Bearer " + localStorage.token
        },
        success: function () {
            console.log('OK');
        }
    });
}

//TODO: Comprobación de "si ya publicado, no publico"
function setToPublish(contribId, publish) {
    $.ajax({
        type: "POST",
        url: api + "Private/setToPublish",
        data: '{"contribId": "' + contribId + '", "publish" : "' + publish + '"}',
        headers: {
            'Authorization': "Bearer " + localStorage.token
        },
        success: function () {
            console.log('OK');
        }
    });
}

function getContributionList() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: api + "Private/getContributionList",
        headers: {
            'Authorization': "Bearer " + localStorage.token
        },
        success: function (data) {
            console.log('OK');
            return data;
        }
    });
}

function logOut() {
    $.ajax({
        type: 'GET',
        url: api + "Private/logout",
        headers: {
            'Authorization': "Bearer " + localStorage.token
        },
        success: function (data) {
            console.log("LOGOUT OK");
            localStorage.removeItem('token');
            window.location.href = 'index.html'
        }
    })
}


$(document).ready(function(){
    $.ajax({
        type: "GET",
        dataType: "json",
        url: api + "Private/getPartyList",
        headers: {
            'Authorization': "Bearer " + localStorage.token
        },
        success: function (data) {

            $("#parties").append( '<datalist id="partyList">' );
            for(var i=0; i<data.length; i++){
                $("#partyList").append('<option value="'+data[i].party+'" id="'+data[i].id+'">');
            }

        }
    });
    $.ajax({
        type: "GET",
        dataType: "json",
        url: api + "Private/getMediaList",
        headers: {
            'Authorization': "Bearer " + localStorage.token
        },
        success: function (data) {

            $("#medias").append( '<datalist id="mediaList">' );
            for(var i=0; i<data.length; i++){
                $("#mediaList").append('<option value="'+data[i].media+'" id="'+data[i].id+'">');
            }

        }
    });
    $.ajax({
        type: "GET",
        dataType: "json",
        url: api + "Private/getLabelList",
        headers: {
            'Authorization': "Bearer " + localStorage.token
        },
        success: function (data) {

            $("#labels").append( '<datalist id="labelList">' );
            for(var i=0; i<data.length; i++){
                $("#labelList").append('<option value="'+data[i].name+'" id="'+data[i].id+'">');
            }

        }
    });
    $.ajax({
        type: "GET",
        dataType: "json",
        url: api + "Private/getLocationList",
        headers: {
            'Authorization': "Bearer " + localStorage.token
        },
        success: function (data) {

            $("#locations").append( '<datalist id="locationList">' );
            for(var i=0; i<data.length; i++){
                $("#locationList").append('<option value="'+data[i].name+'" id="'+data[i].id+'">');
            }

        }
    });

});



var html = [];
var width = $().width();
console.log("WIDTH: "+width);
html.push('<td ></td>');
html.push('<td></td>');
html.push('<td style="text-align: center">' + row.label.name + '</td>' +
    '<td style="text-align: center">' + row.party.party + '</td>' +
    '<td>' + row.location.name  + '</td>' +
    '<td>' + row.media.media + '</td>');

html.push('<td><img src="' + row.photo + '"  width="300" height="200"/></td>');


return html.join('');