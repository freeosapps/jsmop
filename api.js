let listeners = {};
function listen(eventName, callback) {
    if (listeners[eventName]) {
        if (listeners[eventName]['callbacks'].length) {
            listeners[eventName]['callbacks'].push(callback);                        
        } else {
            listeners[eventName]['callbacks'] = [callback];
        }                   

        if (listeners[eventName]['calls'].length) {
            listeners[eventName]['calls'].forEach((arguments) => {
                listeners[eventName]['callbacks'].forEach((callback) => {
                    callback(...arguments);
                });
            });
            listeners[eventName]['calls'].splice(0, listeners[eventName]['calls'].length);
        }
    } else {
        listeners[eventName] = {
            callbacks: [callback],
            calls: []
        };
    }
}
function emit(eventName, arguments) {
    if (listeners[eventName]) {
        if (listeners[eventName]['callbacks'].length) {
            listeners[eventName]['callbacks'].forEach(callback => {
                callback(...arguments);
            });
        } else {
            listeners[eventName]['calls'].push(arguments);
        }
    } else {
        listeners[eventName] = {
            callbacks: [],
            calls: [arguments]
        };
    }

}
let declaredEvents = [];
function declareEvents(events) {
    let eventNames = Object.keys(events);
    for (let i = 0; i < eventNames.length; i++) {
        let eventName = eventNames[i];
        events[eventName] = function() {
            if (arguments.length && typeof arguments[0] === "function") {
                listen(eventName, arguments[0]);
            } else {
                emit(eventName, arguments);
            }
        }
    }
    declaredEvents = events;
}
let objects = {};
function declareObject(objectName, object) {
    objects[objectName] = object;                
}
function useObject(objectName, arguments) {
    if (arguments) {
        objects[objectName](declaredEvents, arguments);
    } else {
        objects[objectName](declaredEvents);
    }
}

declareEvents({
    the1500MillisecondsHaveElapsed: '',
    typedCaloriesCalculation: '',
    calculatedCalories: ''
});

declareObject('clock', (events, time) => {
    let i = 0;
    setInterval(() => {
        events[`the${time}MillisecondsHaveElapsed`](i);
        i++;
    }, time);
});

declareObject('person', events => {
    events.the1500MillisecondsHaveElapsed(i => {
        document.writeln(`${i} - Passou 1s e 500ms<br>`);
    });                
});

declareObject('calculator', (events, calculationName) => {
    events[`typed${calculationName}Calculation`](expression => {
        events[`calculated${calculationName}`](math.eval(expression));
    });
});

declareObject('designer', events => {
    events.typedCaloriesCalculation('1 + 1');
    events.calculatedCalories(result => {
        alert(`1 + 1 = ${result}`);
    });

});

//useObject('calculator', 'Calories');
//useObject('designer');

//useObject('clock', 1500);
setTimeout(() => {
    //useObject('person');
}, 5000);