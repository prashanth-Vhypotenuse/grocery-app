<template>
  <LoadingData v-if="loading" />
  <div class="w-4/6 mx-auto">
    <div class="flex py-4 justify-between">
      <h1 class="flex justify-center text-4xl font-bold text-white">
        Groceries List
      </h1>
      <router-link
        to="/grocery-add"
        class="text-white text-lg font-bold bg-gray-500 rounded-sm px-4 py-2 hover:bg-gray-700"
      >
        Grocery Add
      </router-link>
    </div>

    <div class="flex justify-center">
      <table
        class="border-2 bg-gray-100 border-solid border-gray-500 w-full rounded-sm"
      >
        <tr class="py-2 text-base font-semibold">
          <th class="border-2 border-solid border-gray-500 w-12 py-2">
            Name
          </th>
          <th class="border-solid border-2 border-gray-500 w-12 py-2">
            Category
          </th>
          <th class="border-solid border-2 border-gray-500 w-12 py-2 text-right pr-3">
            Quantity
          </th>
          <th class="border-solid border-2 border-gray-500 w-12 py-2">
            Actions
          </th>
        </tr>
        <tr v-for="rowData in groceryCollection" :key="rowData?.id" class="text-center">
          <td class="border-solid border-gray-500 border-2 capitalize">
            {{ rowData?.groceryName }}
          </td>
          <td class="border-solid border-gray-500 border-2">
            {{ rowData?.name }}
          </td>
          <td class="border-solid border-gray-500 border-2 text-right pr-3">
            {{ rowData?.groceryQuantity }}
          </td>
          <td class="border-solid border-gray-500 border-2">
            <!-- <router-link :to="{ name: '/grocery-edit', params: { id: rowData?.id }}"> -->
            <button type="button" class="editbtn" @click="editGrocery(rowData)">
              <i class="fa-solid fa-pen-to-square"></i>
              <span class="sr-only">edit</span>
            </button>
            <!-- </router-link> -->
            <button
              type="button"
              @click="deleteGrocery(rowData)"
              class="deletebtn"
            >
              <i class="fa-solid fa-trash"></i>
              <span class="sr-only">delete</span>
            </button>
          </td>
        </tr>
      </table>
    </div>

    <div v-if="!groceryCollection.length" class="bg-gray-50 flex justify-center">
      <h1 class="text-xl font-normal mt-2">
        No grocery found.
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { baseUrl, apiRoutePoint, screenRoute } from "../common/common";
import axios from "axios";
import { createToaster } from "../custom-components/custom-toast";
import LoadingData from "../components/LoadingData.vue";

const toaster = createToaster({
  /* options */
});

interface IGrocery {
  id: string,
  groceryName: string,
  groceryQuantity: number,
  category_id: string,
  name: string
}

// const getTableData = () => {
//   const result = localStorage.getItem(localStorageKeys.groceryList);
//   if(result) {
//     return JSON.parse(result)
//   }
//   return []
// }

const groceryCollection = ref<IGrocery[]>([]);

const router = useRouter();
const loading = ref<boolean>(false);

const getGroceryCollection = () => {
  loading.value = true;
  axios
    .get(`${baseUrl}/${apiRoutePoint.groceryList}`)
    .then((res) => {
      if (Array.isArray(res.data.result)) {
        loading.value = false;
        groceryCollection.value = res?.data?.result;
      }
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
};

const deleteGrocery = (grocery: any) => {
  const { id } = grocery;
  if (window.confirm(`Are you sure you want to delete ${grocery.groceryName}?`)) {
    axios
      .delete(`${baseUrl}/${apiRoutePoint.grocery}/${id}`)
      .then((res) => {
        if (res) {
          if(res.data) {
            if(res.data.message){
              toaster.success(res.data.message, {
                position: "top-right",
              });
              getGroceryCollection()
            }
          }
        }
      })
      .catch((err) => {
        if(err) {
          if(err.response) {
            if(err.response.data){
              if(err.response.data.message) {
                toaster.error(err.response.data.message, {
                  position: "top-right",
                }
              )
              }
            }
          }
        }
        console.log(err);
      });
    // const oldTableData = getTableData();
    // const newTableData  = oldTableData.filter(
    //   (item: any) => String(item.id) !== String(grocery.id)
    // )
    // localStorage.setItem(localStorageKeys.groceryList, JSON.stringify(newTableData))
    // tableData.value = getTableData()
  }
};

const editGrocery = (grocery: any) => {
  const { id } = grocery;
  router.push(`${screenRoute.EditScreen}/${id}`);
};

// setTimeout(() => {
//   getTableData()
// }, 1000)
onMounted(getGroceryCollection);
</script>

<style scoped>
.deletebtn {
  color: white;
  height: 30px;
  padding: 0px 10px;
  background-color: red;
  font-size: 16px;
  margin: 4px;
  border-style: none;
  border-radius: 3px;
  cursor: pointer;
}

.editbtn {
  color: white;
  height: 30px;
  padding: 0px 10px;
  background-color: green;
  font-size: 16px;
  margin: 4px;
  border-style: none;
  border-radius: 3px;
  cursor: pointer;
  margin-right: 20px;
}
</style>
