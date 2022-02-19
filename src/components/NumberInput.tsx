import * as React from "react";
import { ChangeEvent, useState } from "react";
import { InputBaseComponentProps } from "@material-ui/core";
import { formatNumber, formatNumberString } from "../formatters/NumberFormatters";


interface NumberInputProps extends InputBaseComponentProps {
  fractionDigits?: number;
  allowNegatives?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = (props) => {
  const {inputRef, fractionDigits, allowNegatives, ...rest } = props;
  
  const [editing, setEditing] = useState(false);
  
  const handleFocus = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    toggleEditing();
    
    if (rest.onFocus) {
      rest.onFocus(event);
    }
  }
  
  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    toggleEditing();
    
    if (rest.onBlur) {
      rest.onBlur(event);
    }
  }    
  
  const toggleEditing = () => 
    setEditing(!editing);
  
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    
    const parsed = parseFloat(event.target.value);
    const formatted = formatNumber(parsed, fractionDigits);
    
    if ((event.target.value === "" || (!isNaN(parsed) && parsed === formatted && (allowNegatives || parsed >= 0))) && props.onChange) {
      props.onChange(event);
    }
  }
  
  const formattedValue = props.value != null && props.value !== "" ? formatNumberString(props.value, fractionDigits) : "";
  
  return editing 
    ? <input {...rest}
             ref={inputRef}
             type="number"
             defaultValue={formattedValue}
             onChange={handleChange}
             onBlur={handleBlur}/>
             
    : <input {...rest}
             ref={inputRef}
             type="text" 
             value={formattedValue} 
             onFocus={handleFocus}/>
};

const makeNumberInput = (partialProps: Partial<NumberInputProps>) => 
  (props: any) => 
    NumberInput({...props, ...partialProps});

export { makeNumberInput };
export default NumberInput;