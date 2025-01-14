var fieldCount = 1;

function desc_field(name, value) {
    fieldCount++;
    var objTo = document.getElementById('desc_fields')
    var divtest = document.createElement("div");
    divtest.setAttribute("class", "form-group removeclass"+fieldCount);
    divtest.innerHTML = '<div class="row align-items-start"><div class="col-5 nopadding"><div class="form-group"> <input type="text" class="form-control desc-updater" id="FieldName'+ fieldCount +'" name="FIELDNAME" value="'+ name +'" placeholder="FIELD NAME"></div></div><div class="col-5 nopadding"><div class="form-group"> <input type="text" class="form-control desc-updater" id="FieldValue'+ fieldCount +'" name="FIELDVALUE" value="'+ value +'" placeholder="Field value"></div></div><div class="col-2 input-group-btn"> <button class="btn btn-danger" type="button" onclick="remove_field('+ fieldCount +');">-</button></div></div></div></div><div class="clear"></div></div>';

    objTo.appendChild(divtest)
}

function create_empty_desc_field() {
    desc_field("","");
}

function init_desc_fields() {
    desc_field("NAME", "name");
    desc_field("SPECIES", "species");
    desc_field("SEX", "sex");
    desc_field("AGE", "age");
    desc_field("EYES", "eyes");
    desc_field("HAIR", "hair");
    desc_field("FUR", "fur");
    desc_field("BUILD", "build");
    desc_field("HEIGHT", "height");

}

function remove_field(rid) {
    $('.removeclass'+rid).remove();
}