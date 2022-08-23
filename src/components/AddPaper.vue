<template>
  <div class="q-pa-md">
    <!-- <q-btn v-if="user" @click="addOne"> Add a paper </q-btn> -->
    <q-form @submit.prevent="addOne">
      <q-input
        filled
        v-model="arxiv"
        label="arXiv number"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || '']"
      />
      <!-- <q-space /> -->
      <div>
        <q-btn label="Add a new paper" type="submit" color="primary" />
        <q-btn
          label="..."
          color="primary"
          flat
          class="q-ml-sm"
          @click.prevent="showAddMore = !showAddMore"
        />
      </div>
    </q-form>
    <q-form
      class="q-mt-md"
      v-if="showAddMore"
      @submit.prevent="addFromCollaboration"
    >
      <q-input
        filled
        v-model="collaboration"
        label="collaboration"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || '']"
      />
      <!-- <q-space /> -->
      <div>
        <q-btn label="Add 10 papers" type="submit" color="primary" />
        <q-pagination
          class="q-mt-md"
          v-model="currentPage"
          color="black"
          :max="maxPage"
          :max-pages="5"
          boundary-numbers
        />
      </div>
    </q-form>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { createPaper, createFromCollaboration } from "../composables/crud.js";

export default defineComponent({
  name: "AddPaper",

  setup() {
    const arxiv = ref("");
    const $q = useQuasar();
    const showAddMore = ref(false);
    const currentPage = ref(1);
    const maxPage = ref(10);
    const collaboration = ref("");

    const addOne = async () => {
      arxiv.value = arxiv.value.trim();
      const { status, newPaper } = await createPaper(arxiv.value);
      if (status == 1) {
        $q.notify({
          message: "You already own arXiv:" + arxiv.value,
          icon: "info",
          color: "warning",
        });
      } else if (status == 2) {
        $q.notify({
          message: "Paper added: arXiv:" + arxiv.value,
          icon: "Done",
          color: "positive",
        });
      } else if (status == 3) {
        $q.notify({
          message: "Paper does not exist! arXiv:" + arxiv.value,
          icon: "error",
          color: "negative",
        });
      } else {
        $q.notify({
          message: "Paper added: arXiv:" + newPaper.arxiv,
          caption: newPaper.title,
          icon: "Done",
          color: "positive",
        });
      }
    };

    const addFromCollaboration = async () => {
      collaboration.value = collaboration.value.trim();
      // console.log(currentPage.value);
      const { total } = await createFromCollaboration(
        collaboration.value,
        currentPage.value
      );
      maxPage.value = Math.floor(total / 10 + 1);
    };

    return {
      arxiv,
      showAddMore,
      currentPage,
      maxPage,
      collaboration,
      addOne,
      addFromCollaboration,
    };
  },
});
</script>
