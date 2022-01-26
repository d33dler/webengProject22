/**
 * Helper functions Javascript file
 */

import React from "react";
import {checkboxParams, rangeParams, textFieldParams} from "../components/configs/params_field_types";
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

export function renderField(params, field, onChange, defaultValue = "") {
    const {
        name, id, type, placeholder
    } = field;
    return (
        <div className="form-group">
            <label style={{marginRight: params.marginRight}} id={name + type} htmlFor={id}>{name}</label>
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
    return (<label id={fieldName} htmlFor={tok}>{fieldName}</label>)
}

export function generateForm(fields, inputs, setInputs, defaultValues = new URLSearchParams()) {
    return <form>
        {fields.map((field) => {
            const {id, type} = field;
            switch (type) {
                case 'text':
                    return renderField(textFieldParams, field,
                        e => {
                            handleChangeHook(inputs, setInputs, id, e)
                        }, defaultValues.get(`${id}`))
                case 'range':
                    return renderRangeInput(field, inputs, setInputs, defaultValues)
                case 'checkbox':
                    if (isUndefined(inputs[id])) inputs[id] = false;
                    return (renderField(checkboxParams, field,
                        (e => handleCheckHook(inputs, setInputs, id, e))));
                case 'radio':
                    return renderRadioHook(field, inputs, setInputs, defaultValues)
                case 'select':
                    return renderSelectHook(field, inputs, setInputs, defaultValues)
                default:
                    return null;
            }
        })}
    </form>
}

export function generateButton(label, _func) {
    return <button
        className="btn btn-outline-secondary"
        type="button"
        onClick={_func}
    >{label}
    </button>
}

export function renderSelectHook(field, inputs, setInputs, defaultValues = new URLSearchParams()) {
    const {id, label, options, values} = field;
    return (
        <>
            <div>
                {createLabel(label, id)}
                <select id= {id} onChange={(event => handleChangeHook(inputs, setInputs, id, event))} defaultValue={ options[0]}>
                    {options.map((o, ix) => (
                        <option value={values[ix]}>{o}</option>))}
                </select>
            </div>
        </>
    )
}

export function renderRangeInput(field, value, valueSetter, defaultValues = new URLSearchParams()) {
    const {id} = field;
    const id_min = id + "_min";
    const id_max = id + "_max";
    const field1 = {...field, name: field.name + " min"}
    const field2 = {...field, name: field.name + " max"}
    return (
        <section class="mb-lg-2">
            <div className="d-flex align-items-center mt-sm-1 pb-1">
                <div className="md-form md-outline my-0">
                    {renderField(rangeParams, field1,
                        (event => handleChangeHook(value, valueSetter, id_min, event)), defaultValues.get(id_min))}
                </div>
                <div className="md-form md-outline my-0">
                    {renderField(rangeParams, field2,
                        (event => handleChangeHook(value, valueSetter, id_max, event)), defaultValues.get(id_max))}
                </div>
            </div>
        </section>
    )
}

export function renderRadioHook(field, value, valueSetter, defaultValues = new URLSearchParams()) {
    const {id, label, options, values} = field;
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
                                   defaultChecked={!isUndefined(defaultValues.get(`${id}`))
                                   && defaultValues.get(`${id}`) === values[ix]}
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
