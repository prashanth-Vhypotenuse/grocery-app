<template>

  <LoadingData v-if="loading"/>
  <h1 class="flex py-4 justify-center text-4xl font-bold text-white">Grocery Form</h1>
  <div class="flex justify-center">
    <form
      @submit="onSubmit"
      @keyup.enter="onSubmit"
      class="bg-gray-200 w-10/12 md:w-5/12 py-6 px-10 rounded-md"
    >
      <!-- <h1 class="font-semibold text-4xl text-gray-800 text-center mb-3">
        Grocery Shop
      </h1> -->

      <div class="py-2 w-full">
        <label for="groceryName" class="text-base font-semibold">Name : </label>
        <input
          type="text"
          id="groceryName"
          v-model="formData.groceryName"
          @input="validateForm"
          placeholder="Enter a name"
          maxlength="20"
          :class="[validateForm()?.formErrorMessage?.groceryName ? 'block border-2 py-2 border-red-500 outline-2 outline-red-500 w-full rounded-sm px-3' : 'outline-none py-2 w-full rounded-sm px-3']"
        />
        <small v-if="validateForm()?.formErrorMessage?.groceryName" class="text-red-600 text-sm font-semibold">
          {{ validateForm()?.formErrorMessage?.groceryName }}
        </small>
      </div>
      <div class="py-2 w-full">
        <label for="groceryCategory" class="text-base font-semibold">Category : </label>
        <select
          id="groceryCategory"
          v-model="formData.groceryCategory"
          @input="validateForm"
          :class="[validateForm()?.formErrorMessage?.groceryCategory ? 
                    'block border-2 py-2 border-red-500 outline-2 outline-red-500 w-full rounded-sm px-3' : 
                    !formData.groceryCategory ?  
                    'text-gray-400 outline-none py-2 w-full rounded-sm px-3' : 
                    'outline-none py-2 w-full rounded-sm px-3']"
        >
          <option value="" disabled class="text-gray-200">Select a category</option>
          <option v-for="options in categoryOptions" :key="options?.id" :value="options?.id" class="text-gray-700">
            {{ options?.name }}
          </option>
        </select>
        <small v-if="validateForm()?.formErrorMessage?.groceryCategory" class="block text-red-600 text-sm font-semibold">
          {{ validateForm()?.formErrorMessage?.groceryCategory }}
        </small>
      </div>

      <div class="py-2 w-full">
        <label for="groceryQuantity" class="text-base font-semibold">Quantity : </label>
        <input
          type="text"
          id="groceryQuantity"
          v-model="formData.groceryQuantity"
          placeholder="Enter a quantity"
          min="0"
          maxlength="4"
          @keypress="numberOnly"
          @input="validateForm"
          @paste="pasteNumberOnly"
          @drop="dropNumberOnly"
          @keydown="allowOnlyOneZero"
          :class="[validateForm()?.formErrorMessage?.groceryQuantity ? 'block border-2 py-2 border-red-500 outline-2 w-full outline-red-500 rounded-sm px-3' : 'outline-none py-2 w-full rounded-sm px-3']"
        />
        <small v-if="validateForm()?.formErrorMessage?.groceryQuantity" class="block text-red-600 text-sm font-semibold">
          {{validateForm()?.formErrorMessage?.groceryQuantity}}
        </small>
      </div>
      <div class="flex justify-between mt-2">
        <button
          type="submit"
          class="text-lg font-semibold bg-blue-900 text-white py-1 rounded-sm mt-2 w-32 hover:bg-blue-600"
        >
          Submit
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
import { onMounted, ref } from 'vue';
import { baseUrl, apiRoutePoint, screenRoute } from '../common/common';
import { groceryFormValidation, numberOnly, pasteNumberOnly, dropNumberOnly } from '../common/validation'
import axios from 'axios'
import { createToaster } from "../custom-components/custom-toast";
// import { createToaster } from '@meforma/vue-toaster'
import LoadingData from '../components/LoadingData.vue';

interface IGroceryForm {
  groceryName: string,
  groceryQuantity: any,
  groceryCategory: any,
}

const toaster = createToaster({ /* options */ });

const router = useRouter()
const loading = ref<boolean>(false);

// const getTableData = () => {
//   const result = localStorage.getItem(localStorageKeys.groceryList);
//   if(result) {
//     return JSON.parse(result)
//   }
//   return []
// }
// onBeforeMount(() => {
//       console.log('V3 beforeMount!');
//     })

//     onMounted(() => {
//       console.log('V3 mounted!');
//     })

const formData = ref<IGroceryForm>({
  groceryName: "",
  groceryCategory: "",
  groceryQuantity: ""
});

const submitTried = ref(false);
const categoryOptions = ref<any>([]);

const validateForm = (e:any = null) => {
  if(e) {
    e.preventDefault();
  }
  if(submitTried.value) {
    const validationResult = groceryFormValidation(formData)
    // console.log(validationResult)
    return validationResult
    // if(validationResult) {
    //   return validationResult
    //   //  { check, formErrorMessage }
    // }
  }
}

const onSubmit = (e: any) => {
  e.preventDefault();
  if(!submitTried.value) submitTried.value = true;
  const { check = false } =  groceryFormValidation(formData)

  if(check){
    // const tableData = getTableData();
    // const newGrocery = {
    //   ...formData.value,
    //   id: String(tableData.length + 1),
    //   createdAt : new Date(),
    //   modifiedAt: null,
    // };
    axios
      .post(`${baseUrl}/${apiRoutePoint.grocery}`, {
        category_id : formData?.value?.groceryCategory,
        groceryName : formData?.value?.groceryName[0].toUpperCase() + formData?.value?.groceryName.substring(1),
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

    // tableData.push(newGrocery)
    // localStorage.setItem(localStorageKeys.groceryList, JSON.stringify(tableData));
    // router.push('/')
  }
}

const cancel = () => {
  router.push(`${screenRoute.DashboardScreen}`)
}

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