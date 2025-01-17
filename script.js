const entry = document.getElementById('eingabe');
const result = document.getElementById('ergebnis');
const del = document.getElementById('del');
const back = document.getElementById('back');
const one = document.getElementById('one');
const two = document.getElementById('two')
const three = document.getElementById('three');
const four = document.getElementById('four');
const five = document.getElementById('five');
const six = document.getElementById('six');
const seven = document.getElementById('seven');
const eight = document.getElementById('eight');
const nine = document.getElementById('nine');
const zero = document.getElementById('zero');
const dot = document.getElementById('dot');
const equals = document.getElementById('equals');
const mult = document.getElementById('mult');
const devide = document.getElementById('devide');
const add = document.getElementById('add');
const sub = document.getElementById('sub');

mult.innerHTML = ' ' + mult.innerHTML + ' ';
devide.innerHTML = ' ' + devide.innerHTML + ' ';
add.innerHTML = ' ' + add.innerHTML + ' ';
sub.innerHTML = ' ' + sub.innerHTML + ' ';

const numbersOnClickHandler = ({ target }) =>{
    entry.innerHTML = `${entry.innerHTML}${target.innerHTML}`;
}

const numbers = [one, two, three, four, five, six, seven, eight, nine, zero];
numbers.forEach(element =>{
    element.addEventListener('click', numbersOnClickHandler);
});

const signs = [dot, mult, devide, add, sub];
signs.forEach(element =>{
    element.addEventListener('click', numbersOnClickHandler);
});

const deleteOnClickHandler = () =>{
    entry.innerHTML = '';
    result.innerHTML = '';
}

del.addEventListener('click', deleteOnClickHandler);

const backOnClickHandler = () =>{
    let entryString = entry.innerHTML;
    let lastIndex = entryString.length -1; //-1 um den index des letzten Zeichens zu erhalten 
    let lastSign = entryString.substring(lastIndex);
    if(lastSign !== ' '){
        entryString = entryString.substring(0, lastIndex);
    } else {
        if(entryString.length > 0){
            entryString = entryString.substring(0, lastIndex - 2 ); //-2 weil immer wenn ein zeichen mit 
            //leerzeichen hinzugefügt wird sind sowohl vor dem zeichen als auch dahinter ein leerzeichen
        }
    }
    entry.innerHTML = entryString;
    console.log(entryString);
}

back.addEventListener('click', backOnClickHandler);

//enthält objekte mit jeweils dem operator und dem index des operators
//bsp. : [{operator: '+', index: '5'}]
let operatorArray = [];
let spaceIndex = [];

const stringAnalyzer = (str) =>{
    if(str.length > 0){
        let copyString = str;
        let newIndex = 0;
        for(let i = 0; i < str.length; i++){
            let char = str.charAt(i);
            let operatorObject = {};
            if(char === '+' || char === '-' || char === 'x' || char === '/'){
                operatorObject.operator = char;
                operatorObject.index = copyString.indexOf(char) + newIndex;
                newIndex = operatorObject.index+1;
                copyString = str.substring(operatorObject.index+1);
                operatorArray.push(operatorObject);
            }
        }
    } 
}

const spaceAnalyzer = str =>{
    if(str.length > 0){
        let copyString = str;
        let newIndex = 0;
        spaceIndex.push(-1);
        for(let i = 0; i < str.length; i++){
            let char = str.charAt(i);
            if(char === ' '){
                spaceIndex.push(copyString.indexOf(char)+newIndex) // 1,3,5
                newIndex = newIndex+copyString.indexOf(char)+1; //2,4,6
                copyString = str.substring(newIndex);
            }
        }
        spaceIndex.push(str.length);
    }
}

//Merke: eine if-bedingung einbauen beim click auf das = zeichen wenn der string leer ist
const calculateOperation = (str, opr) =>{
    //console.log(str);
    stringAnalyzer(str);
    spaceAnalyzer(str);
    //console.log(operatorArray);
    //console.log(spaceIndex);
    let firstOperand ='';
    let secondOperand='';
    let copySpaceIndex = spaceIndex;
    let indexBefore;
    let twoIndexBefore;
    let indexAfter;
    let twoIndexAfter;
    let firstSubstring;
    let secondSubstring;
    let result;
    //operator.forEach(element =>{
    for(let k = 0; k < operatorArray.length; k++){
        if(operatorArray[k].operator === opr){
            copySpaceIndex = copySpaceIndex.filter(i =>{
                return i < operatorArray[k].index;
            });
            indexBefore = copySpaceIndex[copySpaceIndex.length - 1];
            copySpaceIndex = copySpaceIndex.filter(i =>{
                return i < indexBefore;
            });
            //console.log(indexBefore);
            twoIndexBefore = copySpaceIndex[copySpaceIndex.length - 1];
            //console.log(twoIndexBefore);
            firstSubstring = str.substring(0, twoIndexBefore);
            //console.log(firstSubstring);
            for(let j = twoIndexBefore+1; j<indexBefore; j++){
                firstOperand = firstOperand + str.charAt(j);
            }
            copySpaceIndex = spaceIndex;
            copySpaceIndex = copySpaceIndex.filter(i =>{
                return i > operatorArray[k].index;
            });
            indexAfter = copySpaceIndex[0];
            //console.log(indexAfter);
            copySpaceIndex = copySpaceIndex.filter(i =>{
                return i > indexAfter;
            });
            twoIndexAfter = copySpaceIndex[0];
            //console.log(twoIndexAfter);
            secondSubstring = str.substring(twoIndexAfter+1);
            //console.log(secondSubstring)
            for(let j = twoIndexAfter-1; j>indexAfter; j--){
                secondOperand = str.charAt(j) + secondOperand;
            }
            firstOperand = parseFloat(firstOperand);
            secondOperand = parseFloat(secondOperand);
            if(opr === 'x'){
                result = firstOperand * secondOperand;
            }
            if(opr === '/'){
                result = firstOperand / secondOperand;
            }
            if(opr === '+'){
                result = firstOperand + secondOperand;
            }
            if(opr === '-'){
                result = firstOperand - secondOperand;
            }
            //console.log(str);
            if(twoIndexBefore === -1){
                str = firstSubstring + result + ' ' + secondSubstring; 
            } else {
                str = firstSubstring + ' ' + result + ' ' + secondSubstring; 
            } 
            //console.log(str);
            //operator = [];
            //spaceIndex = [];
            //stringAnalyzer(str);
            //spaceAnalyzer(str);
            break;
        }
    //});
    }
    operatorArray = [];
    spaceIndex = [];
    return str;
}

const calculate = str =>{
    while(str.includes('x')){
        str = calculateOperation(str, 'x');
    }
    while(str.includes('/')){
        str = calculateOperation(str, '/');
    }
    while(str.includes('+')){
        str = calculateOperation(str, '+');
    }
    while(str.includes('-')){
        str = calculateOperation(str, '-');
    }
    //console.log(str);
    return str;
}

const equalsClickHandler = () =>{
    const calculation = entry.innerHTML;
    const res = calculate(calculation);
    result.innerHTML = res;
}

equals.addEventListener('click', equalsClickHandler);

const testString = '1 x 4 x 3'; //5.28...
calculate(testString);
//console.log(operator);
//console.log(spaceIndex);


