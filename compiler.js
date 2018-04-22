function compile(code) {
    const STATES = {
        INITIAL: 0,
        E: 1,
        EV: 2,
        EVE: 3,
        EVEN: 4,
        EVENT: 5,
        EVENTS: 6,
        O: 7,
        OB: 8,
        OBJ: 9,
        OBJE: 10,
        OBJEC: 11,
        OBJECT: 12,
        OBJECTS: 13,
        U: 14,
        US: 15,
        USE: 16,
        W: 17,
        WH: 18,
        WHE: 19,
        WHEN: 20,
        A: 21,
        AN: 22,
        AND: 23,
        NAME: 24
    }

    let tokens = [];
    let lexeme = '';
    let state = 0;
    let finalState = false;

    const TOKEN_TYPES = {
        OPEN_BRACKETS: 'open brackets',
        CLOSE_BRACKETS: 'close brackets',
        OPEN_PARENTHESIS: 'open parenthesis',
        CLOSE_PARENTHESIS: 'close parenthesis',
        OPEN_SQUARE_BRACKETS: 'open square brackets',
        CLOSE_SQUARE_BRACKETS: 'close square brackets',
        COMMA: 'comma',
        EVENTS: 'events',
        OBJECT: 'object',
        USE: 'use',
        WHEN: 'when',
        AND: 'and',
        NAME: 'name'
    }

    function isAFinalStateCharacter(character) {
        return character == ' ' 
        || character == '\n' 
        || character == '\t' 
        || isASingleCharacterToken(character);
    }

    function isASingleCharacterToken(character) {
        return character == '{' 
        || character == '}' 
        || character == '(' 
        || character == ')' 
        || character == '[' 
        || character == ']' 
        || character == ',';
    }

    let previousColumn = 0;

    function retract() {
        if (column == 0) {
            column = previousColumn;
            line--;
        } else {
            column--;
        }                
        i--;
    }

    let line = 0;
    let column = 0;
    let i = 0;
    while (i < code.length) {
        let character = code.charAt(i);
        if (state == STATES.INITIAL) {
            if (character == 'e') {
                state = STATES.E;
                lexeme += character;
            } else if (character == 'o') {
                state = STATES.O;
                lexeme += character;
            } else if (character == 'u') {
                state = STATES.U;
                lexeme += character;
            } else if (character == 'w') {
                state = STATES.W;
                lexeme += character;
            } else if (character == 'a') {
                state = STATES.A;
                lexeme += character;
            } else if (isASingleCharacterToken(character)) {
                if (character == '{') {
                    tokens.push({
                        type: TOKEN_TYPES.OPEN_BRACKETS,
                        value: character,
                        line: line,
                        column: column
                    });
                    state = STATES.INITIAL;
                    lexeme = ''; 
                } else if (character == '}') {                            
                    tokens.push({
                        type: TOKEN_TYPES.CLOSE_BRACKETS,
                        value: character,
                        line: line,
                        column: column
                    });
                    state = STATES.INITIAL;
                    lexeme = '';
                } else if (character == '(') {
                    tokens.push({
                        type: TOKEN_TYPES.OPEN_PARENTHESIS,
                        value: character,
                        line: line,
                        column: column
                    });
                    state = STATES.INITIAL;
                    lexeme = ''; 
                } else if (character == ')') {
                    tokens.push({
                        type: TOKEN_TYPES.CLOSE_PARENTHESIS,
                        value: character,
                        line: line,
                        column: column
                    });
                    state = STATES.INITIAL;
                    lexeme = ''; 
                } else if (character == '[') {
                    tokens.push({
                        type: TOKEN_TYPES.OPEN_SQUARE_BRACKETS,
                        value: character,
                        line: line,
                        column: column
                    });
                    state = STATES.INITIAL;
                    lexeme = ''; 
                } else if (character == ']') {
                    tokens.push({
                        type: TOKEN_TYPES.CLOSE_SQUARE_BRACKETS,
                        value: character,
                        line: line,
                        column: column
                    });
                    state = STATES.INITIAL;
                    lexeme = ''; 
                } else if (character == ',') {
                    tokens.push({
                        type: TOKEN_TYPES.COMMA,
                        value: character,
                        line: line,
                        column: column
                    });
                    state = STATES.INITIAL;
                    lexeme = ''; 
                }
            } else if (isAFinalStateCharacter(character)) {
                if (character == '\n') {
                    line++;
                    previousColumn = column;
                    column = 0;                            
                }
                state = STATES.INITIAL;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.E) {                    
            if (character == 'v') {
                state = STATES.EV;
                lexeme += character;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.EV) {
            if (character == 'e') {
                state = STATES.EVE;
                lexeme += character;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.EVE) {
            if (character == 'n') {
                state = STATES.EVEN;
                lexeme += character;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.EVEN) {
            if (character == 't') {
                state = STATES.EVENT;
                lexeme += character;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.EVENT) {
            if (character == 's') {
                state = STATES.EVENTS;
                lexeme += character;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.EVENTS) {
            if (isAFinalStateCharacter(character)) {
                tokens.push({
                    type: TOKEN_TYPES.EVENTS,
                    value: lexeme,
                    line: line,
                    column: column - lexeme.length
                });
                state = STATES.INITIAL;
                lexeme = '';     
                retract();                  
            } else {
                state = STATES.NAME
                lexeme += character;
            }
        } else if (state == STATES.O) {
            if (character == 'b') {
                state = STATES.OB;
                lexeme += character;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.OB) {
            if (character == 'j') {
                state = STATES.OBJ;
                lexeme += character;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.OBJ) {
            if (character == 'e') {
                state = STATES.OBJE;
                lexeme += character;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.OBJE) {
            if (character == 'c') {
                state = STATES.OBJEC;
                lexeme += character;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.OBJEC) {
            if (character == 't') {
                state = STATES.OBJECT;
                lexeme += character;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.OBJECT) {
            if (isAFinalStateCharacter(character)) {
                tokens.push({
                    type: TOKEN_TYPES.OBJECT,
                    value: lexeme,
                    line: line,
                    column: column - lexeme.length
                });
                state = STATES.INITIAL;
                lexeme = '';
                retract();
            } else {
                state = STATES.NAME
                lexeme += character;
            }
        } else if (state == STATES.U) {
            if (character == 's') {
                state = STATES.US;
                lexeme += character;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.US) {
            if (character == 'e') {
                state = STATES.USE;
                lexeme += character;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.USE) {
            if (isAFinalStateCharacter(character)) {
                tokens.push({
                    type: TOKEN_TYPES.USE,
                    value: lexeme,
                    line: line,
                    column: column - lexeme.length
                });
                state = STATES.INITIAL;
                lexeme = '';
                retract();
            } else {
                state = STATES.NAME
                lexeme += character;
            }
        } else if (state == STATES.W) {
            if (character == 'h') {
                state = STATES.WH;
                lexeme += character;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.WH) {
            if (character == 'e') {
                state = STATES.WHE;
                lexeme += character;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.WHE) {
            if (character == 'n') {
                state = STATES.WHEN;
                lexeme += character;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.WHEN) {
            if (isAFinalStateCharacter(character)) {
                tokens.push({
                    type: TOKEN_TYPES.WHEN,
                    value: lexeme,
                    line: line,
                    column: column - lexeme.length
                });
                state = STATES.INITIAL;
                lexeme = '';
                retract();
            } else {
                state = STATES.NAME
                lexeme += character;
            }
        } else if (state == STATES.A) {
            if (character == 'n') {
                state = STATES.AN;
                lexeme += character;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.AN) {
            if (character == 'd') {
                state = STATES.AND;
                lexeme += character;
            } else {
                state = STATES.NAME;
                lexeme += character;
            }
        } else if (state == STATES.AND) {
            if (isAFinalStateCharacter(character)) {
                tokens.push({
                    type: TOKEN_TYPES.AND,
                    value: lexeme,
                    line: line,
                    column: column - lexeme.length
                });
                state = STATES.INITIAL;
                lexeme = '';
                retract();
            } else {
                state = STATES.NAME
                lexeme += character;
            }
        } else if (state == STATES.NAME) {
            if (isAFinalStateCharacter(character)) {
                tokens.push({
                    type: TOKEN_TYPES.NAME,
                    value: lexeme,
                    line: line,
                    column: column - lexeme.length
                });
                state = STATES.INITIAL;
                lexeme = '';
                retract();
            } else {
                state = STATES.NAME
                lexeme += character;
            }
        }
        i++;
        column++;
    }
    console.log(tokens);

    let outputCode = '';

    function generateOutputCode(code) {
        outputCode += code;
    }

    let indexToken = 0;            
    function nextToken() {                
        return tokens[indexToken++];
    }

    let token = nextToken();

    function tokenMatch(type) {
        if (token.type == type) {
            token = nextToken();
        } else {
            throw `${token.line}:${token.column} ${type} expected`;
        }
    }

    if (token && token.type == TOKEN_TYPES.EVENTS) {
        matchEvents();
    } 
    while(token && token.type == TOKEN_TYPES.OBJECT) {
        matchObject();
    }            

    while(token && token.type == TOKEN_TYPES.USE) {
        matchUse();
    }

    function matchEvents() {
        tokenMatch(TOKEN_TYPES.EVENTS);
        tokenMatch(TOKEN_TYPES.OPEN_BRACKETS);
        generateOutputCode('declareEvents({');        
        do {
            matchEventNameDeclaration();
            if (token.type == TOKEN_TYPES.NAME) {
                generateOutputCode(',');
            }
        } while(token.type != TOKEN_TYPES.CLOSE_BRACKETS);        
        tokenMatch(TOKEN_TYPES.CLOSE_BRACKETS);
        generateOutputCode('});');
    }

    function matchEventNameDeclaration() {
        generateOutputCode(`"${token.value}`);          
        tokenMatch(TOKEN_TYPES.NAME);        
        if (token.type == TOKEN_TYPES.OPEN_SQUARE_BRACKETS) {            
            tokenMatch(TOKEN_TYPES.OPEN_SQUARE_BRACKETS);
            generateOutputCode(`[${token.value}`);
            tokenMatch(TOKEN_TYPES.NAME);                        
            tokenMatch(TOKEN_TYPES.CLOSE_SQUARE_BRACKETS);
            generateOutputCode(`]": ''`);
        } else {
            generateOutputCode(`": ''`);
        }
    }

    function matchEventName() {
        generateOutputCode(`events["${token.value}`);          
        tokenMatch(TOKEN_TYPES.NAME);        
        if (token.type == TOKEN_TYPES.OPEN_SQUARE_BRACKETS) {            
            tokenMatch(TOKEN_TYPES.OPEN_SQUARE_BRACKETS);
            generateOutputCode(`[" + ${token.value} + "`);
            tokenMatch(TOKEN_TYPES.NAME);                        
            tokenMatch(TOKEN_TYPES.CLOSE_SQUARE_BRACKETS);
            generateOutputCode(`]"]`);
        } else {
            generateOutputCode(`"]`);
        }
    }

    function matchObject() {
        tokenMatch(TOKEN_TYPES.OBJECT);
        generateOutputCode(`declareObject('${token.value}'`);
        tokenMatch(TOKEN_TYPES.NAME);
        generateOutputCode(',');
        if (token.type == TOKEN_TYPES.OPEN_PARENTHESIS) {            
            matchObjectParameters();
        } else {
            generateOutputCode('(events)');
        }
        tokenMatch(TOKEN_TYPES.OPEN_BRACKETS);
        generateOutputCode('=>{');
        while(token.type != TOKEN_TYPES.CLOSE_BRACKETS) {
            if (token.type == TOKEN_TYPES.WHEN) {
                matchWhen();
            } else if (token.type == TOKEN_TYPES.NAME) {
                matchEventName();
                if (token.type == TOKEN_TYPES.OPEN_PARENTHESIS) {
                    matchParameters();
                } else {
                    generateOutputCode('()');
                }
                generateOutputCode(';');
            }
        } 
        tokenMatch(TOKEN_TYPES.CLOSE_BRACKETS);
        generateOutputCode('});');
    }

    function matchWhen() {
        tokenMatch(TOKEN_TYPES.WHEN);
        do {
            matchEventName();
        } while(token.type != TOKEN_TYPES.OPEN_BRACKETS && token.type != TOKEN_TYPES.OPEN_PARENTHESIS);                
        if (token.type == TOKEN_TYPES.OPEN_PARENTHESIS) {
            matchParameters();
        }
        while(token.type != TOKEN_TYPES.OPEN_BRACKETS) {
            tokenMatch(TOKEN_TYPES.AND);
            do {
                matchEventName();
            } while(token.type != TOKEN_TYPES.OPEN_BRACKETS && token.type != TOKEN_TYPES.OPEN_PARENTHESIS);
            if (token.type == TOKEN_TYPES.OPEN_PARENTHESIS) {
                matchParameters();
            }
        }
        tokenMatch(TOKEN_TYPES.OPEN_BRACKETS);
        tokenMatch(TOKEN_TYPES.CLOSE_BRACKETS);
    }

    function matchObjectParameters() {
        tokenMatch(TOKEN_TYPES.OPEN_PARENTHESIS);
        generateOutputCode(`(events,${token.value}`);
        tokenMatch(TOKEN_TYPES.NAME);
        do {
            if (token.type == TOKEN_TYPES.COMMA) {
                tokenMatch(TOKEN_TYPES.COMMA);
                generateOutputCode(`,${token.value}`);
                tokenMatch(TOKEN_TYPES.NAME);                
            }
        } while(token.type != TOKEN_TYPES.CLOSE_PARENTHESIS);
        tokenMatch(TOKEN_TYPES.CLOSE_PARENTHESIS);
        generateOutputCode(')');
    }

    function matchParameters() {
        tokenMatch(TOKEN_TYPES.OPEN_PARENTHESIS);
        generateOutputCode(`(${token.value}`);
        tokenMatch(TOKEN_TYPES.NAME);
        do {
            if (token.type == TOKEN_TYPES.COMMA) {
                tokenMatch(TOKEN_TYPES.COMMA);
                generateOutputCode(`,${token.value}`);
                tokenMatch(TOKEN_TYPES.NAME);                
            }
        } while(token.type != TOKEN_TYPES.CLOSE_PARENTHESIS);
        tokenMatch(TOKEN_TYPES.CLOSE_PARENTHESIS);
        generateOutputCode(')');
    }

    function matchUse() {
        tokenMatch(TOKEN_TYPES.USE);
        tokenMatch(TOKEN_TYPES.NAME);
        if (token.type == TOKEN_TYPES.OPEN_PARENTHESIS) {
            tokenMatch(TOKEN_TYPES.OPEN_PARENTHESIS);
            tokenMatch(TOKEN_TYPES.NAME);                    
            do {
                if (token.type == TOKEN_TYPES.COMMA) {
                    tokenMatch(TOKEN_TYPES.COMMA);
                    tokenMatch(TOKEN_TYPES.NAME);                        
                }
            } while(token.type != TOKEN_TYPES.CLOSE_PARENTHESIS);
            tokenMatch(TOKEN_TYPES.CLOSE_PARENTHESIS);
        }
    }

    console.log(outputCode);
}