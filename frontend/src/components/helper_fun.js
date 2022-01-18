/**
 * Helper functions Javascript file
 */

import React from "react";
import {textFieldParams} from "./params_field_types";

/**
 *
 * @param fieldSet
 * @param defaultVal
 * @returns {{submitted: boolean}}
 */
export function newState(fieldSet, defaultVal) {
    let state = {submitted: false};
    for (let i = 0; i < fieldSet.length; i++) {
        state[`${fieldSet[i].id}`] = defaultVal;
    }
    return state;
}

export function handleCheckHook(comp, _compSetter, value, e) {
    comp[`${value}`] = e.target.checked;
    _compSetter(comp);
}

export function handleChangeHook(comp, _compSetter, value, e) {
    if (e.target.value.length !== 0) {
        comp[`${value}`] = e.target.value;
    } else delete comp[`${value}`];
    _compSetter(comp);
    console.log(comp);
}

export function handleChange(comp, value, event) {
    comp.setState({[`${value}`]: event.target.value});
}

export function renderField(params, id, fieldName, onChange) {
    return (
        <div className="form-group">
            <label style={{marginRight: params.marginRight}} id={fieldName} htmlFor={id}>{fieldName}</label>
            <input type={params.type}
                   id={id}
                   onChange={onChange}/>
        </div>
    );
}

export function stateful(fieldSet, defaultVal) {
    let state = {};
    for (let i = 0; i < fieldSet.length; i++) {
        state[`${fieldSet[i].id}`] = defaultVal;
    }
    return state;
}

export function createLabel(fieldName, tok) {
    return (<label id={fieldName} htmlFor={tok}>{fieldName}</label>)
}

export function renderRangeInput(id, value, valueSetter, label) {
    const id_min = id + "_min";
    const id_max = id + "_max";
    return (
        <section class="mb-lg-2">
            <div className="d-flex align-items-center mt-sm-1 pb-1">
                <div className="md-form md-outline my-0">
                    {
                        renderField(textFieldParams, id_min, label + ' min',
                            (event => handleChangeHook(value, valueSetter, id_min, event)))}
                </div>
                <div className="md-form md-outline my-0">
                    {
                        renderField(textFieldParams, id_max, label + ' max',
                            (event => handleChangeHook(value, valueSetter, id_max, event)))}
                </div>
            </div>
        </section>
    )
}

export function renderRadioHook(id, value, valueSetter,values, options, label) {
    return (
        <>
            <div>
                <ul>
                    {createLabel(label, id)}
                    {options.map((o, ix) => (
                        <div className="form-group">
                            <input type="radio"
                                   id={`${id}_${o}`}
                                   name={id}
                                   value={values[ix]}
                                   checked={true}
                                   onClick={(event => handleChangeHook(value, valueSetter, id, event))}
                            />
                            <label htmlFor={`${id}_${o}`}>{o}</label>
                        </div>
                    ))}
                </ul>
            </div>
        </>
    )
}

export function renderRadio(comp, id, fieldName, options, values) {
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
                                   onChange={(event => handleChange(comp, id, event))}
                                   checked={comp.state[`${id}`] == values[ix]}/>
                            <label htmlFor={`${id}_${o}`}>{o}</label>
                        </div>
                    ))}
                </ul>
            </div>
        </>
    )
}

