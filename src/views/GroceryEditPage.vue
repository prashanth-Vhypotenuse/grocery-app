<template>
  <LoadingData v-if="loading"/>
  <h1 class="flex py-4 justify-center text-4xl font-bold text-white">Update Grocery Form</h1>
  <div class="flex justify-center">
    <form
      @submit="onSubmit"
      @keyup.enter="onSubmit"
      class="bg-gray-200 w-5/12 py-6 px-10 rounded-md"
    >
      <!-- <h1 class="font-semibold text-4xl text-gray-800 text-center mb-3">
        Grocery Shop
      </h1> -->

      <div class="py-2">
        <label for="groceryName" class="text-base font-semibold">Name : </label>
        <input
          type="text"
          id="groceryName"
          v-model="formData.groceryName"
          @input="validateForm"
          placeholder="Enter a name"
          maxlength="20"
          :class="[validateForm()?.formErrorMessage?.groceryName ? 'border-2 py-2 border-red-500 outline-2 outline-red-500 w-full rounded-sm px-3' : 'outline-none py-2 w-full rounded-sm px-3']"
        />
        <small v-if="validateForm()?.formErrorMessage?.groceryName" class="text-red-600 text-sm font-semibold">
          {{ validateForm()?.formErrorMessage?.groceryName }}
        </small>
      </div>
      <div class="py-2">
        <label for="groceryCategory" class="text-base font-semibold">Category : </label>
        <select
          id="groceryCategory"
          v-model="formData.groceryCategory"
          @input="validateForm"
          :class="[validateForm()?.formErrorMessage?.groceryCategory ? 'border-2 py-2 border-red-500 outline-2 outline-red-500 w-full rounded-sm px-3' : 'outline-none py-2 w-full rounded-sm px-3']"
        >
          <option value="" disabled className="text-gray-200">Select a category</option>
          <option v-for="options in categoryOptions" :key="options?.id" :value="options?.id">
            {{ options?.name }}
          </option>
          <!-- <option value="Vegetable">Vegetable</option>
          <option value="Juice">Juice</option>
          <option value="Kitchen">Kitchen</option>
          <option value="Fruits">Fruits</option> -->
        </select>
        <small v-if="validateForm()?.formErrorMessage?.groceryCategory" class="text-red-600 text-sm font-semibold">
            {{ validateForm()?.formErrorMessage?.groceryCategory }}
        </small>
      </div>
      <a href="#about">About</a>
      <div class="py-2" id="about">
        <label for="groceryQuantity" class="text-base font-semibold">Quantity : </label>
        <input
          type="text"
          id="groceryQuantity"
          v-model="formData.groceryQuantity"
          placeholder="Enter a quantity"
          min="0"
          step=any
          maxlength="4"
          @keypress="numberOnly"
          @input="validateForm"
          @paste="pasteNumberOnly"
          @drop="dropNumberOnly"
          @keydown="allowOnlyOneZero"
          :class="[validateForm()?.formErrorMessage?.groceryQuantity ? 'border-2 py-2 border-red-500 outline-2 outline-red-500 w-full rounded-sm px-3' : 'outline-none py-2 w-full rounded-sm px-3']"
        />
        <small v-if="validateForm()?.formErrorMessage?.groceryQuantity" class="text-red-600 text-sm font-semibold">
          {{ validateForm()?.formErrorMessage?.groceryQuantity }}
        </small>
      </div>
      <div class="flex justify-between mt-2">
        <button
          type="submit"
          class="text-lg font-semibold bg-blue-900 text-white py-1 rounded-sm mt-2 w-32 hover:bg-blue-600"
        >
          Update
        </button>
        <button
          type="button"
          @click="cancel"
          class="text-lg font-semibold bg-red-700 text-white py-1 rounded-sm mt-2 w-32 hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import { baseUrl, apiRoutePoint, screenRoute } from '../common/common';
import axios from 'axios';
import { groceryFormValidation, numberOnly, pasteNumberOnly, dropNumberOnly } from '../common/validation'
import { createToaster } from "../custom-components/custom-toast";
import LoadingData from '../components/LoadingData.vue';

const toaster = createToaster({ /* options */ });

interface IGroceryForm {
  groceryName: string,
  groceryQuantity: any,
  groceryCategory: any,
}

const router = useRouter()
const loading = ref<boolean>(false);

// const getTableData = () => {
//   const result = localStorage.getItem(localStorageKeys.groceryList);
//   if(result) {
//     return JSON.parse(result)
//   }
//   return []
// }

// const oldData = ref<any>({});
const formData = ref<IGroceryForm>({
  groceryName: "",
  groceryCategory: "",
  groceryQuantity: ""
});
const categoryOptions = ref<any>([]);

const submitTried = ref(false);
const groceryId = useRouter().currentRoute.value.params.id;

const validateForm = (e:any = null) => {
  if(e) {
    e.preventDefault();
  }
  if(submitTried.value) {
    const validationResult = groceryFormValidation(formData)
    return validationResult
    // if(validationResult) {
    //   const { check, formErrorMessage} = validationResult
    //   return {check, formErrorMessage}
    // }
  }
}

const onSubmit = (e: any) => {
  e.preventDefault();
  if(!submitTried.value) submitTried.value = true;

  const { check = false } =  groceryFormValidation(formData)
  if(check){
    // const tableData = getTableData();

    // const groceryIndex = tableData.findIndex(
    //   (item: any) => String(item.id) === String(groceryId)
    // )

    // tableData[groceryIndex] = {
    //   ...oldData.value,
    //   ...formData.value,
    //   modifiedAt: new Date(),
    // }
    // localStorage.setItem(localStorageKeys.groceryList, JSON.stringify(tableData));
    axios
      .patch(`${baseUrl}/${apiRoutePoint.grocery}/${groceryId}`, {
        category_id : formData?.value?.groceryCategory,
        groceryName : formData?.value?.groceryName[0]?.toUpperCase() + formData?.value?.groceryName.substring(1),
        groceryQuantity : Number(formData?.value?.groceryQuantity),
      })
      .then((res) => {
        if(res && res.data && res.data.message) {
          toaster.success(res.data.message, {
            position: "top-right",
          })
          router.push(`${screenRoute.DashboardScreen}`)
        }
      })
      .catch((err) => {
        if(err && err.response && err.response.data && err.response.data.message) {
          toaster.error(err.response.data.message, {
            position: "top-right",
          })
        }
        console.error(err)
      })
    
    // setTimeout(() =>{
    //   router.push('/')
    // }, 500)
  }
}

const cancel = () => {
  router.push(`${screenRoute.DashboardScreen}`)
}

// onMounted(() => {
// const groceryId = useRouter().currentRoute.value.params.id;
// const tableData = getTableData();
// const filterResult = tableData.filter(
//   (item: any) => String(item.id) === String(groceryId)
// )
// if(filterResult && filterResult.length > 0) {
//   const [grocery] = filterResult;
//   Object.assign(oldData.value, grocery)
//   Object.assign(formData.value, grocery);
// } else {
//   cancel()
// }
// })

onMounted(() => {
  loading.value = true
  axios
    .get(`${baseUrl}/${apiRoutePoint.categoryList}`)
    .then((res) => {
      loading.value = false
      categoryOptions.value = res.data.result
    })
    .catch((err) => {
      loading.value = false
      console.log(err)
    })
    
  axios
    .get(`${baseUrl}/${apiRoutePoint.grocery}/${groceryId}`)
    .then((res) => { 
      loading.value = false
      if(res.data.result.length > 0) {
        formData.value.groceryName = res.data.result[0].groceryName;
        formData.value.groceryCategory = res.data.result[0].category_id;
        formData.value.groceryQuantity = String(res.data.result[0].groceryQuantity);
      }
    })
    .catch((err) => {
      loading.value = false
      console.log(err)
      if(err) {
          window.alert(`Grocery id does not exist ${groceryId}`)
          router.push(`${screenRoute.DashboardScreen}`)
        }
    })
})
const allowOnlyOneZero = ((e: any) =>{
  let intialZeroCount = 0;
    const quantity = String(formData.value.groceryQuantity).split('')
    for(let i = 0; i < quantity.length ; i++) {
      if(Number(quantity[i]) >= 1) {
        break;
      } else {
        intialZeroCount += 1
      }
    }
  if(intialZeroCount >= 1) {
    if(formData.value.groceryQuantity == 0) {
      formData.value.groceryQuantity = null
    }
  }
})
</script>