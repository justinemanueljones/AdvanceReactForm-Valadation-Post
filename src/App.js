import React, { useState,useEffect } from 'react'
import * as yup from 'yup'
import axios from 'axios'

//(7.2) setup our form valadation
const schema = yup.object().shape({
  name: yup.string().required('You MUST enter a name').min(6, 'Name MUST be 6 characters or more '),
  email: yup.string().required('You MUST enter a email').min(6, 'Email MUST be 6 characters or more '),
  password: yup.string().required('You MUST enter a passord').min(6, 'Password MUST be 6 characters or more '),
  tos:yup.boolean().oneOf([true,'You MUST agree to our Term of Service']),
  subscribe: yup.string().oneOf(['yes', 'no' ],'Would you like to subscribe to our email? '),
  role:  yup.string().oneOf(['1', '2', '3'],'You MUST choose yor ROLE')
})

//(1)set form needed information Name, Email, Password & TOS (checkbox)
//(2)set type field //(3)create name to map to values
//(4)create component state import state hook  //state is our object of our keys
//(5)state isnt driving the form so we add value to the form
//(6.0)set on change handelr to data and declare change a callaback that takes an event object
export default function App() {
  const [form, setForm]= useState({name: '',email:'',password:'',tos:'true',subscribe:'',role:''})
  // {/* //(7.1)set state of disabled to button check new slice of state in React dev tools 
  // & import yup*/}
  const [errors, setErrors]= useState({name: '',email:'',password:'',tos:'',subscribe:'',role:''})
  const [disabled, setDisabled]= useState(true)

 //8.1
 const setFormErrors = (name, value)=>{
   yup.reach(schema, name).validate(value)
   .then(()=> setErrors({...errors, [name]:''}))
   .catch(error => setErrors({...errors, [name]: error.errors[0]})) 
 } 
 //8.2 (9:20) https://lambdaschool.instructure.com/courses/338/pages/objective-2-validate-user-input-in-forms?module_item_id=351896
 


  //(6) 
  const change =event =>{
const {checked, value, name, type}= event.target //(6.1)handles all the changes of type inputs
  const valueToUse = type === 'checkbox' ? checked : value 
  //(6.2)name equals checkbox the value to use is checked otherwsie the value we use is value
  setFormErrors(name, valueToUse)
setForm({...form, [name]: valueToUse}) 
//(6.3)passes in fresh object,overides ?value //event.target has that information
 

}
//9.1 import axios to handle our submit & add prevent default to stop page reload
const submit = event =>{
event.preventDefault()
const newUser = {name: form.name.trim() ,email: form.email , password: form.password ,
tos: form.tos ,subcribe: form.subscribe , role: form.role }
axios.post('https://reqres.in/api/users', newUser)

.then(respone=>{
setForm({name: '',email:'',password:'',tos:'true',subscribe:'',role:''})
})
.catch(error=>{

})
}


useEffect(()=>{
schema.isValid(form).then(valid=> setDisabled(!valid)) 
//(7.4)if schema is valid passing in form then we set the button to oppposite if 
},[form]) //(7.3)we want this effect to run everytime the form changes

  return (
    <div>
    <div style={{
      color:'red'}}>
    <div>{errors.name}</div><div>{errors.email}</div>
    <div>{errors.password}</div><div>{errors.tos}</div>
    <div>{errors.subscribe}</div><div>{errors.role}</div>
    </div>

    <div style={{
       display: 'flex',
      justifyContent:'center',
      flexDirection: 'column',
      backgroundColor:'#EFEFEF',
      padding:'1rem',
      width:'100%%',}}>
     <form onSubmit={submit}> {/* //create a submit function to handle post request */}
<div style={{
      display: 'flex',
      justifyContent:'center',
      flexDirection: 'column',
      margin:'1rem',
      padding:'1rem',
      width:'60%',
      border:'solid black 1px',
     }} >
     <label>
     Name :
     <input onChange={change} value={form.name} name='name' type='text'/>
     </label>

     <label>
     Email :
     <input onChange={change} value={form.email} name='email' type='text'/>
     </label>

     <label>
     Password :
     <input onChange={change} value={form.password} name='password' type='text'/>
     </label>

     <label>
     Terms of Service :
     <input onChange={change} checked={form.tos} name='tos' type='checkbox'/>
     </label>

     <p>Subscribe To Our Email</p>

     <label>
     Yes
     <input onChange={change} checked={form.subscribe==='yes'} value='yes' name='subscribe' type='radio'/>
     </label>
     {/* //(1)provide identical names so we cant check both */}
     {/* (2)value for radio has to be hard coded */}
     {/* //(3)used checked to drive state here */}
     <label>
     No
     <input onChange={change} checked={form.subscribe==='no'} value='no' name='subscribe' type='radio'/>
     </label>

     <label>
     Role :
     <select onChange={change} value={form.role} name='role'>
     <option>--select One--</option>
     <option value='1'>Full Stack Web Developer</option>
     <option value='2'>Front End Web Developer</option>
     <option value='3'>Back End Web Developer</option>
     </select>
     </label>
     {/* //(7)add submit button now that eveything is controlled by state */}
     <button style={{
      width:'30%',
      marginTop:'1rem',
     }} 
     disabled={disabled}>Submit</button>
     </div>
     <div/>
     </form> 
     </div>
    </div>
  )
}


 