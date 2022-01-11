/**
 * Helper functions Javascript file
 */

import React from "react";

/**
 *
 * @param fieldSet
 * @param defaultVal
 * @returns {{submitted: boolean}}
 */
export function newState(fieldSet, defaultVal){
    let state = {submitted: false};
    for (let i = 0; i < fieldSet.length; i++) {
        state[`${fieldSet[i].id}`] = defaultVal;
    }
    return state;
}


export function handleChange(comp,value, event){
    comp.setState({[`${value}`]: event.target.value});
}

export function renderField(comp,params, arg, id, fieldName, onChange) {
    return (
        <div className="form-group">
            <label style={{marginRight : params.marginRight}} id={fieldName} htmlFor={id}>{fieldName}</label>
            <input type={params.type}
                   id={id}
                   onChange={onChange}/>
        </div>
    );
}
export function createLabel(fieldName, tok){
    return (<label id={fieldName} htmlFor={tok}>{fieldName}</label>)
}

export function renderRadio(comp, arg, id, fieldName, options, values){
    return (
        <>
            <div>
                <ul>
                    {createLabel(fieldName, id)}
                    {options.map((o, ix) => (
                        <div className="form-group">
                            <input type="radio"
                                   id={`${id}_${o}`}
                                   value={values[ix]}
                                   onChange={(event => handleChange(comp,id, event))}
                                   checked={comp.state[`${id}`] == values[ix]}/>
                            <label htmlFor={`${id}_${o}`}>{o}</label>
                        </div>
                    ))}
                </ul>
            </div>
        </>
    )
}

