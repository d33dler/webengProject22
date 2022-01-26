/**
 * Helper functions Javascript file
 */

import React from "react";
import {checkboxParams, rangeParams, textFieldParams} from "../configs/params_field_types";
import {isUndefined} from "lodash";

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


export function renderField(field, params, onChange, defaultValue = "") {
    const {name, id, placeholder} = field;
    return (
        <div className="form-group">
            <label style={{marginRight: params.marginRight}} id={id+name} >{name}</label>
            <input type={params.type === "range" ? "number" : params.type}
                   id={id}
                   placeholder={placeholder}
                   defaultValue={defaultValue}
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
    return (<label id={fieldName} >{fieldName}</label>)
}

function renderSelectHook(field, inputs, setInputs) {
    const {id, options, values, name} = field;
    return <div>
        {createLabel(name,id)}
        <select onChange={(event => handleChangeHook(inputs,setInputs, id, event))}>
            {options.map((o,ix) => {
                return <option value={values[ix]}>{o}</option>
            })}
        </select> ;
    </div>
}

export function generateForm(fields, inputs, setInputs, defaultValues = new URLSearchParams()) {
   return fields.map((field) => {
        const {id, type} = field;
        switch (type) {
            case 'text':
                return (renderField(field, textFieldParams,
                    (e => {
                        handleChangeHook(inputs, setInputs, id, e)
                    }), defaultValues.get(`${id}`)))
            case 'range':
                return renderRangeInput(field, inputs, setInputs, defaultValues)
            case 'checkbox':
                if(isUndefined(inputs[id])) inputs[id] = false;
                return (renderField(field, checkboxParams,
                    (e => handleCheckHook(inputs, setInputs, id, e))));
            case 'radio':
                return (renderRadioHook(field, inputs, setInputs, defaultValues));
            case 'select':
                return (renderSelectHook(field, inputs, setInputs))
            default:
                return null;
        }
    })
}

export function generateButton(label, _func ) {
    return  <button
        className="btn btn-outline-secondary"
        type="button"
        onClick={_func}
    >{label}
    </button>
}


export function renderRangeInput(field, value, valueSetter, defaultValues = new URLSearchParams()) {
    const {id, label} = field;
    const id_min = id + "_min";
    const id_max = id + "_max";
    return (
        <section class="mb-lg-2">
            <div className="d-flex align-items-center mt-sm-1 pb-1">
                <div className="md-form md-outline my-0">
                    {
                        renderField(field,rangeParams,
                            (event => handleChangeHook(value, valueSetter, id_min, event)), defaultValues.get(id_min))}
                </div>
                <div className="md-form md-outline my-0">
                    {
                        renderField(field, rangeParams,
                            (event => handleChangeHook(value, valueSetter, id_max, event)), defaultValues.get(id_max))}
                </div>
            </div>
        </section>
    )
}

export function renderRadioHook(field, value, valueSetter, defaultValue = new URLSearchParams()) {
    const {id, options, values, label} = field;
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
                                   defaultChecked={!isUndefined(defaultValue.get(`${id}`))
                                   && defaultValue.get(`${id}`) === values[ix] }
                                   value={values[ix]}
                                   onChange={(event => handleChangeHook(value, valueSetter, id, event))}
                            />
                            <label htmlFor={`${id}_${o}`}>{o}</label>
                        </div>
                    ))}
                </ul>
            </div>
        </>
    )
}

