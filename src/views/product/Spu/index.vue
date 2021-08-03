<template>
  <div>
    <CategorySelector />
    <SpuList />
    <AddOrUpdateSpu />
  </div>
</template>

<script>
import AddOrUpdateSpu from "./AddOrUpdateSpu";
import SpuList from "./SpuList";
import CategorySelector from "../../../components/CategorySelector";
export default {
  name: "Spu",
  data() {
    return {};
  },
  components: {
    CategorySelector,
    AddOrUpdateSpu,
    SpuList,
  },
};
</script>

<style>
</style>
