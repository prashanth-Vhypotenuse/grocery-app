export const groceryFormValidation = (formData: any) =>{
  const formErrorMessage: any = {groceryName : "", groceryCategory: "", groceryQuantity: ""}
  let check = true;
  if(formData.value) {
    if((formData.value.groceryName || "").length === 0)
      formErrorMessage.groceryName = "Please enter a name"
    else if(String(Number(formData.value.groceryName)) !== 'NaN') 
      formErrorMessage.groceryName = "Please enter valid name"
    
    if((formData.value.groceryCategory || "").length === 0)
      formErrorMessage.groceryCategory = "Please select a category"
    // if((formData.value.groceryQuantity || "").length === 0 || formData.value.groceryQuantity == "" )
    //   formErrorMessage.groceryQuantity = "Please enter a grocery quantity"
    // console.log(formData.value.groceryQuantity)
    // let intialZeroCount = 0;
    // const quantity = String(formData.value.groceryQuantity).split('')
    // for(let i = 0; i < quantity.length ; i++) {
    //   if(Number(quantity[i]) >= 1) {
    //     break;
    //   } else {
    //     intialZeroCount += 1
    //   }
    // }
    if(formData.value.groceryQuantity == undefined || formData.value.groceryQuantity == '' )
      formErrorMessage.groceryQuantity = "Please enter a quantity"
    // else if(intialZeroCount > 1) {
    //   formErrorMessage.groceryQuantity = "Please enter a grocery quantity / it allows only one zero"
    // }
    if(formErrorMessage.groceryName || formErrorMessage.groceryCategory || formErrorMessage.groceryQuantity ) 
      check = false
  }
  return { check, formErrorMessage } 
}

export const numberOnly = (e:any) => {
  const pattern = /[0-9]/;
  if(!pattern.test(e.key)) e.preventDefault();
}

export const pasteNumberOnly = (e:any) => {
  if (e.type == "paste") {
    const clipboardData = e.clipboardData
    const pastedData = clipboardData.getData('Text');
    if (isNaN(pastedData) || pastedData % 1 !== 0) {
      e.preventDefault();
    } else {
      return;
    }
  }
}

export const dropNumberOnly = (e: any) => {
  if (e.type == "drop") {
    const dataTransfer = e.dataTransfer
    const dropData = dataTransfer.getData('Text')
    console.log(dropData)
    if(isNaN(dropData) || dropData % 1 !== 0) {
      e.preventDefault();
    }
  }
}