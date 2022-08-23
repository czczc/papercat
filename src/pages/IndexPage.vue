<template>
  <!-- <q-page class="flex flex-center"> -->
  <PaperList title="My Papers" />
  <!-- {{ papers }} -->
  <!-- </q-page> -->
</template>

<script>
import { defineComponent } from "vue";
import PaperList from "components/PaperList.vue";
// import getCollection from "../composables/getCollection";
// import { user } from "boot/firebase";

export default defineComponent({
  name: "IndexPage",
  components: {
    PaperList,
  },
  setup() {
    return {};
    // // console.log(user.value.uid);
    // const papers = getCollection("papers", [
    //   "users",
    //   "array-contains",
    //   user.value.uid,
    // ]);
    // return { user, papers };
  },
});
</script>
