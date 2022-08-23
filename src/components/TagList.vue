<template>
  <div class="q-pa-md">
    <q-list>
      <!-- <q-item-label header> Tags </q-item-label> -->

      <q-item
        v-for="tag in tags"
        :key="tag.name"
        :v-bind="tag"
        clickable
        @click="tagChanged(tag)"
      >
        <!-- {{ tag }} -->
        <q-item-section>{{ tag.name }} </q-item-section>
        <q-item-section side>{{ tag.items.length }} </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { getTags } from "../composables/getTags";
import { tagStore } from "../composables/store";
export default defineComponent({
  name: "TagList",

  setup() {
    // console.log(user.value.uid);
    const tags = ref([]);
    getTags().then((result) => {
      tagStore.tagToPapers = result.data.tag;
      result.data.tags.forEach((val) => {
        tags.value.push({
          name: val,
          items: result.data.tag[val],
        });
      });
      // console.log(tagDict.value);
      console.log(tagStore.paperToTags);
    });

    const tagChanged = (tag) => {
      tagStore.selected = tag.name;
      // console.log(tag);
    };
    return {
      tags,
      tagChanged,
    };
  },
});
</script>
