// Field creation/destruction code
var fieldCount = 0;
var validFields = [];

let columnDefaultValueDisplayName = "Position: auto";

function generate_option_list(numColumns, selectedIndex) {
    var optionString = '<option value="-1" selected>' + columnDefaultValueDisplayName + '</option>';
    if(selectedIndex !== undefined) {
        optionString = '<option value="-1">' + columnDefaultValueDisplayName + '</option>';
    }
    for(var i = 0; i < numColumns; i++) {
        if (selectedIndex !== undefined && selectedIndex === i) {
            optionString = optionString + '<option value="' + i + '" selected>' + i + '</option>';
        } else {
            optionString = optionString + '<option value="' + i + '">' + i + '</option>';
        }
    }
    return optionString;
}

function desc_field(name, value, priority, column) {
    let priorityToken = ""
    if(priority) {
        priorityToken = " checked";
    }

    var objTo = document.getElementById('desc_fields')
    var numColumns = document.getElementById('NumColumns').value;
    if (typeof numColumns != 'number') {
        numColumns = 3;
    }
    var divtest = document.createElement("div");
    divtest.setAttribute("class", "form-group removeclass"+fieldCount);
    divtest.innerHTML = '<div class="row align-items-start">' +
        '<div class="col-3 nopadding"><div class="form-group"> <input type="text" class="form-control desc-updater" id="FieldName'+ fieldCount +'" name="FIELDNAME" value="'+ name +'" placeholder="FIELD NAME"></div></div>' +
        '<div class="col-3 nopadding"><div class="form-group"> <input type="text" class="form-control desc-updater" id="FieldValue'+ fieldCount +'" name="FIELDVALUE" value="'+ value +'" placeholder="Field value"></div></div>' +
        '<div class="col-2 nopadding"><div class="form-group"> <select class="form-select desc-updater" id="ColumnIndicator' + fieldCount + '">' + generate_option_list(numColumns, column) + '</select></div></div>' +
        '<div class="col-2 nopadding"><div class="form-group"> <input type="checkbox" class="form-check-label desc-updater" id="IsPriority' + fieldCount + '"' + priorityToken + '> <label class="form-label" for="NumColumns">Priority?</label></div></div>' +
        '<div class="col-2 input-group-btn"> <button class="btn btn-danger" type="button" onclick="remove_field('+ fieldCount +');">-</button></div></div></div></div><div class="clear"></div></div>';

    objTo.appendChild(divtest)
    validFields.push(fieldCount);
    fieldCount++;
}

function create_empty_desc_field() {
    desc_field("","");
}

function init() {
    init_desc_fields();
}

function init_desc_fields() {
    desc_field("NAME", "name", true, 0);
    desc_field("SPECIES", "species", true, 1);
    desc_field("SEX", "sex", true, 2);
    desc_field("AGE", "age");
    desc_field("EYES", "eyes");
    desc_field("HAIR", "hair");
    desc_field("FUR", "fur");
    desc_field("BUILD", "build");
    desc_field("HEIGHT", "height");

}

function remove_field(rid) {
    $('.removeclass'+rid).remove();
    validFields.splice(validFields.indexOf(rid), 1);
}

// Event handlers
$( "#FixedWidthValue" ).on("change input", function() {
    $( "#FixedWidth" ).val($(this).val())
})

$( "#DoBorder" ).on("change", function() {
    if(this.checked) {
        $( ".border-dependent" ).attr('hidden', false);
    } else {
        $( ".border-dependent" ).attr('hidden', true);
    }
})

$( "body").on("change input", ".desc-updater", function() {
    $( "#OutputDesc" ).val(generateDesc($(this).attr("id")))
})

// Define fields:
class Field {
    constructor(name, value, column, priority) {
        this.name = name;
        this.value = value;
        this.column = column;
        this.priority = priority;
    }

    asText() {
        return this.name + ": " + this.value;
    }
}

// Form Values
var width = "";
var inputDesc = "";
var doWrap = "";
var doBorder = "";
var seperatorPattern = "";
var borderCharacter = "";
var cornerCharacter = "";
var doFooter = "";
var isHeader = "";
var numColumns = 3;
var fields = [];
var lineSeparator = "";
var fieldSeperator = "";

function updateValuesFromForm() {
    width = getValueOrEmptyString('FixedWidthValue');
    inputDesc = getValueOrEmptyString('InputDesc');
    doWrap = document.getElementById("DoWrap").checked;
    doBorder = document.getElementById("DoBorder").checked;
    seperatorPattern = getValueOrEmptyString('SeparatorPattern');
    borderCharacter = getValueOrEmptyString('BorderCharacter');
    cornerCharacter = getValueOrEmptyString('CornerCharacter');
    doFooter = document.getElementById("DoFooter").checked;
    isHeader = document.getElementById("IsHeader").checked;
    numColumns = getValueOrEmptyString('NumColumns');
    fieldSeperator = getValueOrEmptyString('FieldSeperator');
    fields = [];
    for (i = 0; i < validFields.length; i++) {
        fields.push(new Field(getValueOrEmptyString("FieldName" + validFields[i]),
            getValueOrEmptyString('FieldValue' + validFields[i]),
            getValueOrEmptyString("ColumnIndicator" + validFields[i]),
            document.getElementById("IsPriority" + validFields[i]).checked));
    }
    lineSeparator = generateSeparator();
}

//General implementation
function getValueOrEmptyString(elementId) {
    var rval = document.getElementById(elementId).value;
    if (typeof(rval) != "string") {
        rval = ""
    }
    return rval;
}

function strLenComparator (a, b) {
    if (a.length > b.length) {
        return -1;
    } else if (b.length > a.length) {
        return 1;
    } else {
        return 0;
    }
}

function generateMainDesc(paddingLeft, paddingRight) {
    let outString = "";
    outString += lineSeparator;

    if(doWrap) {
        outString += inputDesc;
    } else {
        outString += generateFixedWidth(inputDesc, width, paddingLeft, paddingRight)
    }

    outString += "\n";
    outString += lineSeparator;

    return outString;
}

const NEWLINE_TOKEN = "<!NL!>";

function generateFixedWidth(inString, width, paddingLeft, paddingRight) {
    let inStringTokenified = inString.replaceAll("\n", " " + NEWLINE_TOKEN + " ");
    let tokens = inStringTokenified.split(" ");
    let outString = "";
    for(let i = 0; i < tokens.length; ) {
        let currLine = "";
        currLine += paddingLeft;
        let hitLineBreak = false;
        while(currLine.trimEnd().length + tokens[i].replace(NEWLINE_TOKEN,"").length + paddingRight.length < width-1) {
            if(tokens[i].includes(NEWLINE_TOKEN)) {
                hitLineBreak = true;
                ++i;
                break;
            }
            currLine += tokens[i] + " ";
            ++i;
            if(i >= tokens.length) {
                break;
            }
        }
        if(paddingRight != "") {
            currLine = currLine.trimEnd().padEnd(width-paddingRight.length-1, " ");
        }
        currLine += paddingRight + "\n";
        outString += currLine;
    }
    return outString.trim()
}


function generateFieldOutput(paddingLeft, paddingRight, width, isHeader) {
    fields.sort(strLenComparator);
    console.log(fields);
    columns = formFieldsIntoColumns(fields);
    var numRows = findNumRows(columns);
    padItemNamesInColumns(columns);
    padItemValuesInColumns(columns);
    let columnsAsText = convertColumnsToText(columns)
    var outString = "";
    if(isHeader) {
        outString = outString + lineSeparator;
    }
    for (var i = 0; i < numRows; i++) {
        let currLine = ""
        currLine += paddingLeft;
        for (var j = 0; j < columnsAsText.length; j++) {
            if (columnsAsText[j][i] !== undefined) {
                currLine = currLine + columnsAsText[j][i] + fieldSeperator;
            }
        }
        currLine = currLine.substring(0, currLine.length - fieldSeperator.length).padEnd(width-paddingRight.length-1, " ");
        currLine = currLine + paddingRight + "\n";
        outString += currLine;
    }
    if(!isHeader) {
        outString = outString + lineSeparator;
    }
    return outString;
}

function convertColumnsToText(columns) {
    let asText = [];
    for(let i = 0; i < columns.length; i++) {
        asText[i] = [];
        for(let j = 0; j < columns[i].length; j++) {
            asText[i][j] = columns[i][j].asText();
        }
    }
    return asText;
}

function formFieldsIntoColumns(fields) {
    var cols = []
    for(i = 0; i < numColumns; i++) {
        cols.push([]);
    }
    let numRows = Math.floor(fields.length / cols.length);
    if (fields.length % cols.length != 0) {
        numRows++;
    }
    // first, assign priority fields with designated columns
    let dpFields = getDesignatedPriorityFields(fields);
    assignDesignatedFields(cols, dpFields);
    // second, assign priority fields by automatic logic
    let apFields = getAutomaticPriorityFields(fields);
    assignAutomaticFields(cols, apFields, numRows);
    // third, assign normal fields with designated columns
    let dnFields = getDesignatedNormalFields(fields);
    assignDesignatedFields(cols, dnFields);
    // fourth, assign normal fields by automatic logic
    let anFields = getAutomaticNormalFields(fields);
    assignAutomaticFields(cols, anFields, numRows);
    console.log(cols);
    return cols;
}

function assignDesignatedFields(cols, fields) {
    for (var j = 0; j < fields.length; j++) {
        if(fields[j].column > cols.length) {
            fields[j].column = cols.length-1;
        }
        cols[fields[j].column].push(fields[j]);
    }
}

function assignAutomaticFields(cols, fields, numRows) {
    for (var j = 0; j < fields.length; j++) {
        let targetColumn = getIndexOfShortestFitColumnWithRoomLeft(cols, fields[j].asText(), numRows);
        cols[targetColumn].push(fields[j]);
    }
}

function getIndexOfShortestFitColumnWithRoomLeft(cols, fieldText, numRows) {
    let smallestColumnWithSlotsLeft = getSmallestColumnIndexWithSlotsLeft(cols, numRows);
    let targetColIndex = smallestColumnWithSlotsLeft;
    let largestColIndex = smallestColumnWithSlotsLeft;
    let largestColLength = 0;
    let fitsInAColumn = false;
    let smallestFitColumnLength = 1025;
    for(let i = smallestColumnWithSlotsLeft; i < cols.length; i++) {
        // track whether we can fit in a column and what the largest we can fit in is
        let currColLength = findColumnTotalLength(cols[i]);
        if (fieldText.length <= currColLength && cols[i].length < numRows) {
            fitsInAColumn = true;
            if (currColLength < smallestFitColumnLength) {
                targetColIndex = i;
                smallestFitColumnLength = currColLength;
            }
        }
        // track the largest column in case we don't fit in any of them
        if(currColLength > largestColLength && cols[i].length < numRows) {
            largestColIndex = i;
        }
    }

    if (fitsInAColumn) {
        return targetColIndex;
    } else {
        return largestColIndex;
    }
}

function getSmallestColumnIndexWithSlotsLeft(cols, numRows) {
    for (let j = 0; j < numColumns; j++) {
        if(cols[j].length < numRows) {
            return j;
        }
    }
    return 0;
}

function getDesignatedPriorityFields(fields) {
    let rval = []
    for(let i = 0; i < fields.length; i++) {
        if(fields[i].column != -1 && fields[i].priority == true) {
            rval.push(fields[i]);
        }
    }
    return rval;
}

function getAutomaticPriorityFields(fields) {
    let rval = []
    for(let i = 0; i < fields.length; i++) {
        if(fields[i].column == -1 && fields[i].priority == true) {
            rval.push(fields[i]);
        }
    }
    return rval;
}

function getDesignatedNormalFields(fields) {
    let rval = []
    for(let i = 0; i < fields.length; i++) {
        if(fields[i].column != -1 && fields[i].priority == false) {
            rval.push(fields[i]);
        }
    }
    return rval;
}

function getAutomaticNormalFields(fields) {
    let rval = []
    for(let i = 0; i < fields.length; i++) {
        if(fields[i].column == -1 && fields[i].priority == false) {
            rval.push(fields[i]);
        }
    }
    return rval;
}

// # of rows = column with the most items in it
function findNumRows(cols) {
    var numRows = 0
    for(var i=0; i<cols.length; i++) {
        if (cols[i].length > numRows) {
            numRows = cols[i].length;
        }
    }
    return numRows;
}

// longest item in a column determines its length
function findColumnTotalLength(col) {
    var columnLength = 0;
    for (var i = 0; i < col.length; i++) {
        if(col[i].name.length + col[i].value.length > columnLength) {
            columnLength = col[i].name.length + col[i].value.length;
        }
    }
    return columnLength;
}

// longest item in a column determines its length
function findColumnNameLength(col) {
    var columnNameLength = 0;
    for (var i = 0; i < col.length; i++) {
        if(col[i].name.length > columnNameLength) {
            columnNameLength = col[i].name.length;
        }
    }
    return columnNameLength;
}

function padItemNamesInColumns(cols) {
    for(var i=0; i<cols.length; i++) {
        var currColLength = findColumnNameLength(cols[i]);
        for(var j=0; j<cols[i].length; j++) {
            cols[i][j].name = cols[i][j].name.padEnd(currColLength, " ");
        }
    }
}

function padItemValuesInColumns(cols) {
    for(var i=0; i<cols.length; i++) {
        var currColLength = findColumnTotalLength(cols[i]);
        for(var j=0; j<cols[i].length; j++) {
            cols[i][j].value = cols[i][j].value.padEnd(currColLength-cols[i][j].name.length, " ");
        }
    }
}

function generateSeparator() {
    if(doBorder) {
        let reversedCornerCharacter = cornerCharacter.split("").reverse().join("");
        return cornerCharacter +
            seperatorPattern.repeat(Math.ceil(width/seperatorPattern.length)).substring(0,width-1-cornerCharacter.length*2) +
            reversedCornerCharacter + "\n";
    }
    return seperatorPattern.repeat(Math.ceil(width/seperatorPattern.length)).substring(0,width-1) + "\n";
}


// Logic
function generateDesc(name) {
    updateValuesFromForm();
    let outDesc = "";

    let paddingLeft = "";
    let paddingRight = "";
    if(doBorder) {
        paddingLeft = borderCharacter + " ";
        paddingRight = " " + borderCharacter;
    }

    if(isHeader) {
        if(doFooter) {
            outDesc = outDesc + generateFieldOutput(paddingLeft, paddingRight, width, isHeader);
        }
        outDesc = outDesc + generateMainDesc(paddingLeft, paddingRight);
    } else {
        outDesc = outDesc + generateMainDesc(paddingLeft, paddingRight);
        if(doFooter) {
            outDesc = outDesc + generateFieldOutput(paddingLeft, paddingRight, width, isHeader);
        }
    }

    // add a space to all newlines for lsedit compatibility
    outDesc.replace("\n\n", "\n \n");

    return outDesc;
}
