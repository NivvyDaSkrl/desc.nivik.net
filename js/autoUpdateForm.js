// Field creation/destruction code
let fieldCount = 0;
let validFields = [];

let columnDefaultValueDisplayName = "Position: auto";

function generate_option_list(numColumns, selectedIndex) {
    let optionString = '<option value="-1" selected>' + columnDefaultValueDisplayName + '</option>';
    if(selectedIndex !== undefined) {
        optionString = '<option value="-1">' + columnDefaultValueDisplayName + '</option>';
    }
    for(let i = 0; i < numColumns; i++) {
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

    let objTo = document.getElementById('desc_fields')
    let numColumns = document.getElementById('NumColumns').value;
    if (typeof numColumns != 'number') {
        numColumns = 3;
    }
    let divtest = document.createElement("div");
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

function init_handlers() {
    // Event handlers
    $("#FixedWidthValue").on("change input", function () {
        $("#FixedWidth").val($(this).val())
    })

    $("#DoBorder").on("change", function () {
        if (this.checked) {
            $(".border-dependent").attr('hidden', false);
        } else {
            $(".border-dependent").attr('hidden', true);
        }
    })

    $("body").on("change input load", ".desc-updater", function () {
        $("#OutputDesc").val(generateDesc($(this).attr("id")))
    })
}

function init() {
    init_desc_fields();
    init_handlers();
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

class Column {
    constructor() {

    }
}


class Footer {
    constructor(paddingLeft, paddingRight, lineSeparator, fieldSeparator) {
        this.sections = [];
        this.validSections = [];
        this.paddingLeft = paddingLeft;
        this.paddingRight = paddingRight;
        this.lineSeparator = lineSeparator;
        this.fieldSeparator = fieldSeparator;
    }

    createSection(fields, numColumns) {
        this.sections.push(new Section(
            fields,
            numColumns,
            this.paddingLeft,
            this.paddingRight,
            this.lineSeparator,
            this.fieldSeparator)
        );
    }

    render() {
        let outstring = "";
        for (let i = 0; i < this.sections.length; i++) {
            outstring += this.sections[i].generateSection(width, isHeader);
        }
        return outstring;
    }
}


class Section {
    constructor(fields, numColumns, paddingLeft, paddingRight, lineSeparator, fieldSeparator) {
        this.fields = fields;
        this.numColumns = numColumns;
        this.paddingLeft = paddingLeft;
        this.paddingRight = paddingRight;
        this.lineSeparator = lineSeparator;
        this.fieldSeparator = fieldSeparator;
    }

    generateSection(width, isHeader) {
        this.fields.sort(this.strLenComparator);
        let columns = this.formFieldsIntoColumns(this.fields);
        let numRows = this.findNumRows(columns);
        this.padItemNamesInColumns(columns);
        this.padItemValuesInColumns(columns);
        let columnsAsText = this.convertColumnsToText(columns)
        let outString = "";
        if(isHeader) {
            outString = outString + this.lineSeparator;
        }
        for (let i = 0; i < numRows; i++) {
            let currLine = ""
            currLine += this.paddingLeft;
            for (let j = 0; j < columnsAsText.length; j++) {
                if (columnsAsText[j][i] !== undefined) {
                    currLine = currLine + columnsAsText[j][i] + this.fieldSeparator;
                }
            }
            currLine = currLine.substring(0, currLine.length - this.fieldSeparator.length).padEnd(width-this.paddingRight.length-1, " ");
            currLine = currLine + this.paddingRight + "\n";
            outString += currLine;
        }
        if(!isHeader) {
            outString = outString + this.lineSeparator;
        }
        return outString;
    }

    strLenComparator (a, b) {
        if (a.length > b.length) {
            return -1;
        } else if (b.length > a.length) {
            return 1;
        } else {
            return 0;
        }
    }

    formFieldsIntoColumns() {
        let cols = []
        for(let i = 0; i < this.numColumns; i++) {
            cols.push([]);
        }
        let numRows = Math.floor(this.fields.length / cols.length);
        if (this.fields.length % cols.length !== 0) {
            numRows++;
        }
        // first, assign priority fields with designated columns
        let dpFields = this.getDesignatedPriorityFields(this.fields);
        this.assignDesignatedFields(cols, dpFields);
        // second, assign priority fields by automatic logic
        let apFields = this.getAutomaticPriorityFields(this.fields);
        this.assignAutomaticFields(cols, apFields, numRows);
        // third, assign normal fields with designated columns
        let dnFields = this.getDesignatedNormalFields(this.fields);
        this.assignDesignatedFields(cols, dnFields);
        // fourth, assign normal fields by automatic logic
        let anFields = this.getAutomaticNormalFields(this.fields);
        this.assignAutomaticFields(cols, anFields, numRows);
        return cols;
    }

    assignDesignatedFields(cols, designatedFields) {
        for (let j = 0; j < designatedFields.length; j++) {
            if(designatedFields[j].column > cols.length) {
                designatedFields[j].column = cols.length-1;
            }
            cols[designatedFields[j].column].push(designatedFields[j]);
        }
    }

    assignAutomaticFields(cols, automaticFields, numRows) {
        for (let j = 0; j < automaticFields.length; j++) {
            let targetColumn = this.getIndexOfShortestFitColumnWithRoomLeft(cols, automaticFields[j].asText(), numRows);
            cols[targetColumn].push(automaticFields[j]);
        }
    }

    convertColumnsToText(columns) {
        let asText = [];
        for(let i = 0; i < columns.length; i++) {
            asText[i] = [];
            for(let j = 0; j < columns[i].length; j++) {
                asText[i][j] = columns[i][j].asText();
            }
        }
        return asText;
    }

    getIndexOfShortestFitColumnWithRoomLeft(cols, fieldText, numRows) {
        let smallestColumnWithSlotsLeft = this.getSmallestColumnIndexWithSlotsLeft(cols, numRows);
        let targetColIndex = smallestColumnWithSlotsLeft;
        let largestColIndex = smallestColumnWithSlotsLeft;
        let largestColLength = 0;
        let fitsInAColumn = false;
        let smallestFitColumnLength = 1025;
        for(let i = smallestColumnWithSlotsLeft; i < cols.length; i++) {
            // track whether we can fit in a column and what the largest we can fit in is
            let currColLength = this.findColumnTotalLength(cols[i]);
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

    getSmallestColumnIndexWithSlotsLeft(cols, numRows) {
        for (let j = 0; j < this.numColumns; j++) {
            if(cols[j].length < numRows) {
                return j;
            }
        }
        return 0;
    }

    getDesignatedPriorityFields(fields) {
        let rval = []
        for(let i = 0; i < fields.length; i++) {
            if(fields[i].column !== '-1' && fields[i].priority === true) {
                rval.push(fields[i]);
            }
        }
        return rval;
    }

    getAutomaticPriorityFields(fields) {
        let rval = []
        for(let i = 0; i < fields.length; i++) {
            if(fields[i].column === '-1' && fields[i].priority === true) {
                rval.push(fields[i]);
            }
        }
        return rval;
    }

    getDesignatedNormalFields(fields) {
        let rval = []
        for(let i = 0; i < fields.length; i++) {
            if(fields[i].column !== '-1' && fields[i].priority === false) {
                rval.push(fields[i]);
            }
        }
        return rval;
    }

    getAutomaticNormalFields(fields) {
        let rval = []
        for(let i = 0; i < fields.length; i++) {
            if(fields[i].column === '-1' && fields[i].priority === false) {
                rval.push(fields[i]);
            }
        }
        return rval;
    }

    // # of rows = column with the most items in it
    findNumRows(cols) {
        let numRows = 0
        for(let i=0; i<cols.length; i++) {
            if (cols[i].length > numRows) {
                numRows = cols[i].length;
            }
        }
        return numRows;
    }

    // longest item in a column determines its length
    findColumnTotalLength(col) {
        let columnLength = 0;
        for (let i = 0; i < col.length; i++) {
            if(col[i].name.length + col[i].value.length > columnLength) {
                columnLength = col[i].name.length + col[i].value.length;
            }
        }
        return columnLength;
    }

    // longest item in a column determines its length
    findColumnNameLength(col) {
        let columnNameLength = 0;
        for (let i = 0; i < col.length; i++) {
            if(col[i].name.length > columnNameLength) {
                columnNameLength = col[i].name.length;
            }
        }
        return columnNameLength;
    }

    padItemNamesInColumns(cols) {
        for(let i=0; i<cols.length; i++) {
            let currColLength = this.findColumnNameLength(cols[i]);
            for(let j=0; j<cols[i].length; j++) {
                cols[i][j].name = cols[i][j].name.padEnd(currColLength, " ");
            }
        }
    }

    padItemValuesInColumns(cols) {
        for(let i=0; i<cols.length; i++) {
            let currColLength = this.findColumnTotalLength(cols[i]);
            for(let j=0; j<cols[i].length; j++) {
                cols[i][j].value = cols[i][j].value.padEnd(currColLength-cols[i][j].name.length, " ");
            }
        }
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
var fieldSeparator = "";

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
    fieldSeparator = getValueOrEmptyString('FieldSeparator');
    fields = [];
    for (let i = 0; i < validFields.length; i++) {
        fields.push(new Field(getValueOrEmptyString("FieldName" + validFields[i]),
            getValueOrEmptyString('FieldValue' + validFields[i]),
            getValueOrEmptyString("ColumnIndicator" + validFields[i]),
            document.getElementById("IsPriority" + validFields[i]).checked));
    }
    lineSeparator = generateSeparator();
}

//General implementation
function getValueOrEmptyString(elementId) {
    let rval = document.getElementById(elementId).value;
    if (typeof(rval) != "string") {
        rval = ""
    }
    return rval;
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
    let inStringTokenized = inString.replaceAll("\n", " " + NEWLINE_TOKEN + " ");
    let tokens = inStringTokenized.split(" ");
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
        if(paddingRight !== "") {
            currLine = currLine.trimEnd().padEnd(width-paddingRight.length-1, " ");
        }
        currLine += paddingRight + "\n";
        outString += currLine;
    }
    return outString.trim()
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
function generateDesc() {
    updateValuesFromForm();
    let outDesc = "";

    let paddingLeft = "";
    let paddingRight = "";
    if(doBorder) {
        paddingLeft = borderCharacter + " ";
        paddingRight = " " + borderCharacter;
    }

    let footer = new Footer(paddingLeft, paddingRight, lineSeparator, fieldSeparator);
    footer.createSection(fields, numColumns);

    if(isHeader) {
        if(doFooter) {
            outDesc = outDesc + footer.render(paddingLeft, paddingRight, width, isHeader);
        }
        outDesc = outDesc + generateMainDesc(paddingLeft, paddingRight);
    } else {
        outDesc = outDesc + generateMainDesc(paddingLeft, paddingRight);
        if(doFooter) {
            outDesc = outDesc + footer.render(paddingLeft, paddingRight, width, isHeader);
        }
    }

    // add a space to all newlines for lsedit compatibility
    outDesc.replace("\n\n", "\n \n");

    return outDesc;
}
