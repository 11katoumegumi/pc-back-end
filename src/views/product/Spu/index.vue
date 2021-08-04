<template>
  <div>
    <CategorySelector />
    <SpuList v-if="isShow === 1" @changeIsShow="changeIsShow" />
    <AddOrUpdateSpu v-if="isShow === 2" @changeIsShow="changeIsShow" />
    <AddOrUpdateSku v-if="isShow === 3" @changeIsShow="changeIsShow" />
  </div>
</template>

<script>
import AddOrUpdateSpu from "./AddOrUpdateSpu";
import AddOrUpdateSku from "./AddOrUpdateSku";
import SpuList from "./SpuList";
import CategorySelector from "../../../components/CategorySelector";
export default {
  name: "Spu",
  data() {
    return {
      isShow: 1,
    };
  },
  methods: {
    changeIsShow(value) {
      this.isShow = value;
    },
  },
  components: {
    CategorySelector,
    AddOrUpdateSpu,
    SpuList,
    AddOrUpdateSku,
  },
};
</script>

<style>
</style>
