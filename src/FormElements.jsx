import React, { useState } from "react";
import {
  Formik,
  Form as FormikForm,
  Field,
  ErrorMessage,
  useFormikContext,
  useField,
  useFormik,
} from "formik";

export function Form(props) {
  return (
    <Formik {...props}>
      <FormikForm className="needs-validation" novalidate="">
        {props.children}
      </FormikForm>
    </Formik>
  );
}

export function TextField(props) {
  const { name, label, placeholder, ...rest } = props;
  return (
    <>
      {label && <label for={name}>{label}</label>}
      <Field
        className="form-control"
        type="text"
        name={name}
        id={name}
        placeholder={placeholder || ""}
        {...rest}
      />
      <ErrorMessage
        name={name}
        render={(msg) => <div style={{ color: "red" }}>{msg}</div>}
      />
    </>
  );
}

export function SelectField(props) {
  const { name, label, options } = props;
  return (
    <>
      {label && <label for={name}>{label}</label>}
      <Field as="select" id={name} name={name}>
        <option value="">Choose...</option>
        {options.map((optn, index) => (
          <option value={optn.value} label={optn.label || optn.value} />
        ))}
      </Field>
      <ErrorMessage
        name={name}
        render={(msg) => <div style={{ color: "red" }}>{msg}</div>}
      />
    </>
  );
}

function ListItem(props){
  const {key , index, className , value, selected, selectedIndexesCallback}=props;
  const [itemselected , setItemSelected] = useState(selected);

  const handleClick=()=> {
    if (typeof selectedIndexesCallback === 'function') {
      selectedIndexesCallback(index);
    }
    setItemSelected(!itemselected)
  }
  return(
    <div>
      <li
        onClick={()=>handleClick()}
        className={className}>
        {value}
      </li>
    </div>
  );
}

export function MultiSelectField(props){
  const { dropDownLabel,  optionsData} = props;
  const [showMultiSelectBox , setShowMultiSelectBox]  = useState(false);
  const [selectedIndexes , setselectedIndexes] = useState([]);
  const [optionsValue , setOptionsValue] = useState(optionsData);

  const selectedIndexesCallback=(selectedIndex) =>{
    if (selectedIndexes !== null) {
      let tmpselectedIndexes = (selectedIndexes.indexOf(selectedIndex) !== -1) ?
        selectedIndexes.filter((i) => {
          return i !== selectedIndex;
        }) : [...selectedIndexes, selectedIndex];
        setselectedIndexes(tmpselectedIndexes);
    }
  }

  const getOptions=()=> {
    const optionsList = optionsValue;
    if (optionsList !== undefined && optionsList !== null) {
      return optionsList.map((option, i) => {
        let selected = false;
        if (selectedIndexes !== null) {
          for (let j of selectedIndexes) {
            if (j === i) {
              selected = true;
            }
          }
        }
        return (
          <ListItem
            key={i}
            index={i}
            className='multi-select-box__item'
            value={option}
            selected={selected}
            selectedIndexesCallback={()=>selectedIndexesCallback()}
          />
        );
      });
    }
  }

  const generateLabel =(options = [])=> {
    let labelArray = [];
    if (options.length > 0) {
      for (let option of options) {
        if (option.props.selected) {
          labelArray.push(option.props.value);
        }
      }
    }
    return labelArray.length > 0 ? labelArray.join(', ') : dropDownLabel;
  }


  const options = getOptions();
  const optionLabel = generateLabel(options);

  let multiSelectNodes;
    if (showMultiSelectBox) {
      multiSelectNodes = options;
    }

console.log('optiondata',optionsData)
console.log('optionvalue',optionsValue)
console.log()


  return(
    <div className="">
        <div
          className=""
          onClick={()=>setShowMultiSelectBox(!showMultiSelectBox)}>
          <span className="">{optionLabel}</span>
        </div>
        <section className="">
          <ul>
            {multiSelectNodes}
          </ul>
        </section>
      </div>
  );
}

export function SubmitButton(props) {
  const { title, ...rest } = props;
  const { isSubmitting } = useFormikContext();

  return (
    <button type="submit" {...rest} disabled={isSubmitting}>
      {title}
    </button>
  );
}
