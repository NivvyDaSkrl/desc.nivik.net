// Define handlers
function init_handlers() {
    // Event handlers
    $("#DoBorder").on("change", function () {
        if (this.checked) {
            $(".border-dependent").attr('hidden', false);
        } else {
            $(".border-dependent").attr('hidden', true);
        }
    })

    $("body").on("change input", ".desc-updater", updateOutputDescField);

    $("body").on("change input", ".morph-updater", updateMorph);
}

function updateMorph() {
    try {
        updateMorphUnhandled();
    } catch (err) {
        updateUiWithError(err);
    }
}

function updateOutputDescField() {
    try {
        updateOutputDescFieldUnhandled();
    } catch (err) {
        updateUiWithError(err);
    }
}

function updateOutputDescFieldUnhandled() {
    let generatedDesc = generateDesc();
    $(".desc-update-target").val(generatedDesc);
}

function updateMorphUnhandled() {
    let generatedMorph = generateMorph();
    $(".morph-update-target").val(generatedMorph);
}

let uiCurrError = 0;
let uiValidErrors = [];
function updateUiWithError(error) {
    let objTo = document.getElementById('errorMessages')
    let errorDiv = document.createElement("div");
    errorDiv.setAttribute("class", "form-group removeErrorClass"+uiCurrError);
    errorDiv.innerHTML =
        '<div class="alert alert-danger fade show row" role="alert">' +
        '  <strong class="col-3 align-content-center">*sad noises*</strong>' +
        '  <div class="col-6 text-center align-content-center">' + error.name + ': ' + error.message + '</div>' +
        '  <div class="col-3 text-end align-content-center"><button class="btn btn-outline-danger text-center" type="button" onclick="uiRemoveError('+ uiCurrError +');">Hide Error</button></div>' +
        '</div>'
    objTo.appendChild(errorDiv);
    uiValidErrors.push(uiCurrError++);
}

function uiRemoveError(rid) {
    $('.removeErrorClass'+rid).remove();
    uiValidSections.splice(uiValidSections.indexOf(rid), 1);
}


// Field creation/destruction code
let uiCurrSection = 0;
let uiValidSections = [];
function uiGenerateFooterSection(sectionName, numColumns, numDisplayedRows, fields) {
    let objTo = document.getElementById('footer_sections')
    let sectionDiv = document.createElement("div");
    sectionDiv.setAttribute("class", "form-group removeSectionClass"+uiCurrSection);
    sectionDiv.innerHTML =
        '<div class="container-fluid my-4">' +
        '  <div class = "row align-items-center">' +
        '    <div class="col nopadding"><div style="text-align: center;"><h4>' + sectionName + '</h4></div></div>' +
        '  </div>' +
        '  <div class = "row align-items-center">' +
        '    <div class="col">' +
        '      <div class="form-group d-inline-flex align-items-center">' +
        '        <label class="form-label mx-1" style="min-width: 85px" for="SectionNumColumns' + uiCurrSection + '">Number of Columns</label>' +
        '        <input type="text" class="form-control desc-updater mx-1" style="min-width: 45px; max-width: 100px" id="SectionNumColumns' + uiCurrSection + '" value="' + numColumns + '">' +
        '      </div>' +
        '    </div>' +
        '    <div class="col form-group text-end"><button class="btn btn-danger" type="button" onclick="uiRemoveSection('+ uiCurrSection +');">Remove Section</button></div>' +
        '  </div>' +
        '  <div class = "row align-items-start">' +
        '    <div class="col nopadding"><div class="form-updateOutputDescField(); updateMorph();group d-inline-flex flex-column"><div class="text-center p-1">Names</div><textarea class="form-control desc-updater" rows="'+ numDisplayedRows +'" id="SectionNames' + uiCurrSection + '">' + fieldNamesToNewlineDelimitedString(fields) + '</textarea></div></div>' +
        '    <div class="col nopadding"><div class="form-group d-inline-flex flex-column"><div class="text-center p-1">Values</div><textarea class="form-control desc-updater" rows="'+ numDisplayedRows +'" id="SectionValues' + uiCurrSection + '">' + fieldValuesToNewlineDelimitedString(fields) + '</textarea></div></div>' +
        '    <div class="col nopadding"><div class="form-group d-inline-flex flex-column"><div class="text-center p-1">Position/Column</div><textarea class="form-control desc-updater" rows="'+ numDisplayedRows +'" id="SectionColumnNumber' + uiCurrSection + '">' + fieldColumnNumbersToNewlineDelimitedString(fields) + '</textarea></div></div>' +
        '    <div class="col nopadding"><div class="form-group d-inline-flex flex-column"><div class="text-center p-1">Is Priority?</div><textarea class="form-control desc-updater" rows="'+ numDisplayedRows +'" id="SectionIsPriority' + uiCurrSection + '">' + fieldPrioritiesToNewlineDelimitedString(fields) + '</textarea></div></div>' +
        '  </div>' +
        '</div>';
    objTo.appendChild(sectionDiv);
    uiValidSections.push(uiCurrSection++);
}

function uiRemoveSection(rid) {
    $('.removeSectionClass'+rid).remove();
    uiValidSections.splice(uiValidSections.indexOf(rid), 1);
}

function uiCreateEmptyFooterSection() {
    uiGenerateFooterSection("Section " + uiCurrSection, 1, 3, [] );
}

function fieldNamesToNewlineDelimitedString(fields) {
    let text = "";
    for(let i = 0; i < fields.length; i++) {
        text += fields[i].name + "\n"
    }
    return text.substring(0, text.length - 1); // remove last \n
}

function fieldValuesToNewlineDelimitedString(fields) {
    let text = "";
    for(let i = 0; i < fields.length; i++) {
        text += fields[i].value + "\n"
    }
    return text.substring(0, text.length - 1); // remove last \n
}

function fieldColumnNumbersToNewlineDelimitedString(fields) {
    let text = "";
    for(let i = 0; i < fields.length; i++) {
        let colNum = fields[i].column;
        if (colNum < 0) {
            colNum = "auto"
        }
        text += fields[i].column + "\n"
    }
    return text.substring(0, text.length - 1); // remove last \n
}

function fieldPrioritiesToNewlineDelimitedString(fields) {
    let text = "";
    for(let i = 0; i < fields.length; i++) {
        text += fields[i].priority + "\n"
    }
    return text.substring(0, text.length - 1); // remove last \n
}

function init() {
    try {
        initUnhandled();
    } catch (err) {
        updateUiWithError(err);
    }
}

function initUnhandled() {
    uiGenerateFooterSection("Main Stats", 3, 12, [
        new Field("NAME", "Moniker", 0, true),
        new Field("SPECIES", "Sparkleferret", 1, true),
        new Field("SEX", "Herm", 2, true),
        new Field("AGE", "430 (looks 16)", -1, false),
        new Field("EYES", "Octarine", -1, false),
        new Field("FUR", "Lime green", -1, false),
        new Field("HAIR", "Magenta", -1, false),
        new Field("BUILD", "Stacked AF", -1, false),
        new Field("HEIGHT", "8'13\"", -1, false)
    ]);
    uiGenerateFooterSection("Outfit", 1, 5, [
        new Field("OUTFIT", "Band tee and tripp pants.", -1, false),
        new Field("|-> TOP", "Fluorescent yellow \"Hyperderp\" band tee.", -1, false),
        new Field("|-> BOTTOM", "Cyan bondage pants with caution orange straps.", -1, false)
    ]);

    // Perform initial population of output fields.
    updateOutputDescField();
    updateMorph();

    init_handlers(); // Do this last so other instantiations don't repeatedly call the handlers.
}

// Define fields:
class Field {
    constructor(name, value, column, priority) {
        this.name = name;
        this.value = value;
        if(typeof column === "number") {
            this.column = column;
        } else if (typeof column === "string" && !isNaN(Number(column))) {
            this.column = Number(column);
        } else {
            this.column = -1;
        }
        if(priority === true || priority === 'true') {
            this.priority = true;
        } else {
            this.priority = false;
        }
    }

    asText() {
        return this.name + ": " + this.value;
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
        this.sanitize();
    }

    sanitize() {
        for(let i = 0; i < this.fields.length; i++) {
            if (this.fields[i].column > this.numColumns-1) {
                this.fields[i].column = this.numColumns-1;
            } else if (this.fields[i].column < -1) {
                this.fields[i].column = -1;
            }
        }
        if(this.numColumns < 1) {
            this.numColumns = 1;
        }
    }

    generateSection(width, isHeader) {
        this.fields.sort(this.strLenComparator);
        let columns = this.formFieldsIntoColumns(this.fields);
        let numRows = this.findNumRows(columns);
        this.padItemNamesInColumns(columns);
        this.padItemValuesInColumns(columns);
        let columnsAsText = this.convertColumnsToText(columns)
        let outString = "";
        outString = outString + this.lineSeparator;
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

    // assignAutomaticFields(cols, automaticFields, numRows) {
    //     for (let j = 0; j < automaticFields.length; j++) {
    //         let targetColumn = this.getIndexOfShortestFitColumnWithRoomLeft(cols, automaticFields[j].asText(), numRows);
    //         cols[targetColumn].push(automaticFields[j]);
    //     }
    // }

    assignAutomaticFields(cols, automaticFields, numRows) {
        automaticFields.sort(this.strLenComparator);
        for (let j = 0; j < automaticFields.length; j++) {
            let slotFound = false;
            for(let i = 0; i < cols.length; ++i) {
                if(cols[i].length < numRows) {
                    slotFound = true;
                    cols[i].push(automaticFields[j]);
                    break;
                }
            }
            if(!slotFound) {
                cols[0].push(automaticFields[j]);
            }
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
            if(fields[i].column !== -1 && fields[i].priority === true) {
                rval.push(fields[i]);
            }
        }
        return rval;
    }

    getAutomaticPriorityFields(fields) {
        let rval = []
        for(let i = 0; i < fields.length; i++) {
            if(fields[i].column === -1 && fields[i].priority === true) {
                rval.push(fields[i]);
            }
        }
        return rval;
    }

    getDesignatedNormalFields(fields) {
        let rval = []
        for(let i = 0; i < fields.length; i++) {
            if(fields[i].column !== -1 && fields[i].priority === false) {
                rval.push(fields[i]);
            }
        }
        return rval;
    }

    getAutomaticNormalFields(fields) {
        let rval = []
        for(let i = 0; i < fields.length; i++) {
            if(fields[i].column === -1 && fields[i].priority === false) {
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
var fields = [];
var lineSeparator = "";
var fieldSeparator = "";
var addLink = "";

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
    addLink = document.getElementById("AddLink").checked;
    numColumns = [];
    for(let i = 0; i < uiValidSections.length; i++) {
        numColumns.push(getValueOrEmptyString('SectionNumColumns' + uiValidSections[i]));
    }
    fieldSeparator = getValueOrEmptyString('FieldSeparator');
    updateAllFieldsFromSections();

    sanitizeValues();
    lineSeparator = generateSeparator();
}

function sanitizeValues() {
    if(width < 1 || width > 1023) {
        width = 79;
    }
    if(seperatorPattern === "") {
        seperatorPattern = "-";
    }
}

function updateAllFieldsFromSections() {
    fields = []
    for (let i = 0; i < uiValidSections.length; i++) {
        fields.push(updateFieldsFromSection(uiValidSections[i]));
    }
}

function updateFieldsFromSection(sectionNumber) {
    let currFields = [];
    let sectionNames = getValueOrEmptyString("SectionNames" + sectionNumber).trimEnd().split("\n");
    let sectionValues = getValueOrEmptyString("SectionValues" + sectionNumber).trimEnd().split("\n");
    let sectionColumnNumber = getValueOrEmptyString("SectionColumnNumber" + sectionNumber).trimEnd().split("\n");
    let sectionIsPriority = getValueOrEmptyString("SectionIsPriority" + sectionNumber).trimEnd().split("\n");

    let lengthOfShortestArray = getLengthOfShortestArrayInArray([
        sectionNames,
        sectionValues,
        sectionColumnNumber,
        sectionIsPriority
    ]);

    for(let i = 0; i < lengthOfShortestArray; i++) {
        currFields.push(new Field(
            sectionNames[i],
            sectionValues[i],
            sectionColumnNumber[i],
            sectionIsPriority[i]
        ))
    }
    return currFields;
}

function getLengthOfShortestArrayInArray(arrays) {
    let lengthOfShortestArray = Number.MAX_SAFE_INTEGER;
    for(let i=0; i<arrays.length; i++) {
        if(arrays[i].length < lengthOfShortestArray) {
            lengthOfShortestArray = arrays[i].length;
        }
    }
    return lengthOfShortestArray;
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


let link = "[created @ http://desc.nivik.net/ ]"
function generateSeparatorWithLink() {
    let separator = generateSeparator();
    let insertPosition = separator.length-link.length-5;
    let frontSep = separator.slice(0, insertPosition);
    let endSep = separator.slice(insertPosition+link.length, separator.length-1);
    return frontSep + link + endSep;
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

    for(let i = 0; i < fields.length; ++i) {
        footer.createSection(fields[i], numColumns[i]);
    }


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

    if(addLink) {
        outDesc += generateSeparatorWithLink();
    } else {
        outDesc += lineSeparator;
    }

    // add a space to all newlines for lsedit compatibility
    outDesc.replace("\n\n", "\n \n");

    return outDesc;
}

class MorphContext {
    constructor() {
        this.command = getValueOrEmptyString("MorphCommand");
        this.name = getValueOrEmptyString("MorphName");
        this.message = getValueOrEmptyString("MorphMessage");
        this.scent = getValueOrEmptyString("ScentMessage");
        this.sex = getValueOrEmptyString("SexProperty");
        this.species = getValueOrEmptyString("SpeciesProperty");
        this.notify = getValueOrEmptyString("NotifyStyle");
        this.desc = getValueOrEmptyString("OutputDesc");
        this.isUpdate = document.getElementById("IsMorphUpdate").checked;
    }
}

function generateCommand(command, object, value) {
    return command + " " + object + "=" + value + "\n";
}

let lookNotifyMpi = "{null:{tell:***{toupper:{&cmd} {&arg}}->[{name:me}],this}}";
function generateMorph() {
    let context = new MorphContext();

    let outString = "";
    outString += generateCommand("@set", "me", "_scent:" + context.scent);
    outString += generateCommand("@set", "me", "sex:" + context.sex);
    outString += generateCommand("@set", "me", "species:" + context.species);
    outString += generateCommand("lsedit", "me", "/tooldescs/" + context.command);
    outString += ".del 1 999\n";
    outString += context.desc + "\n";
    outString += ".end\n";

    let listDisplayMpi = "{list:/tooldescs/" + context.command + "}";
    if(context.notify === "mpi") {
        outString += generateCommand("@set", "me", "/tripwire:" + lookNotifyMpi);
        outString += generateCommand("@desc", "me", "{exec:tripwire}" + listDisplayMpi);
    } else if (context.notify === "standard") {
        outString += generateCommand("@set", "me", "_look/notify:yes");
        outString += generateCommand("@set", "me", "_look/notify-contents:yes");
    } else {
        outString += generateCommand("@desc", "me", listDisplayMpi);
    }

    outString += "morph #add\n";
    outString += context.command + "\n";
    if(context.isUpdate) {
        outString += "yes\n";
    }
    outString += context.name + "\n";
    outString += context.message + "\n";

    return outString
}
