import { computed, reactive, ref } from "vue";

const paperStore = reactive({
  selected: [],
});

const tagStore = reactive({
  selected: null,
  tagToPapers: {},
  paperToTags: computed(() => {
    let x = {};
    for (const tag in tagStore.tagToPapers) {
      const papers = tagStore.tagToPapers[tag];
      papers.forEach((p) => {
        if (x[p]) {
          x[p].push(tag);
        } else {
          x[p] = [tag];
        }
      });
    }
    return x;
  }),
});

export { paperStore, tagStore };
