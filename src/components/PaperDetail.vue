<template>
  <div class="q-pa-xs">
    <q-card
      class="q-mb-xs"
      v-for="paper in selectedPapers"
      :key="paper.arxiv"
      :v-bind="paper"
      flat
      bordered
    >
      <q-card-section class="q-pa-xs">
        <q-list dense>
          <!-- <q-item-label header> Tags </q-item-label> -->

          <q-item>
            <q-item-section>
              <!-- <q-item-label overline>Title</q-item-label> -->
              <q-item-label class="text-red-8">{{ paper.title }}</q-item-label>
              <q-item-label caption>{{ author(paper) }}</q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-item-label caption>{{ paper.citation_count }}</q-item-label>
            </q-item-section>
            <!-- <q-item-section side>{{ tag.items.length }} </q-item-section> -->
          </q-item>
          <q-item v-if="paper.publication">
            <q-item-section>
              <q-item-label style="font-style: italic">
                {{ publication(paper) }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>
                <a
                  target="_blank"
                  :href="'https://arxiv.org/abs/' + paper.arxiv"
                  >arXiv</a
                >
                &nbsp; | &nbsp;
                <a
                  target="_blank"
                  :href="
                    'https://inspirehep.net/literature/' + paper.control_number
                  "
                  >INSPIRE</a
                >
                &nbsp; | &nbsp;
                <a target="_blank" :href="'https://doi.org/' + paper.doi"
                  >DOI</a
                >
                &nbsp; | &nbsp;
                <a
                  :href="
                    ' https://inspirehep.net/api/arxiv/' +
                    paper.arxiv +
                    '?format=bibtex'
                  "
                  >BibTeX</a
                >
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-chip
            color="primary"
            text-color="white"
            v-for="tag in tagStore.paperToTags[paper.arxiv]"
            :key="tag"
            :v-bind="tag"
          >
            {{ tag }}
          </q-chip>
          <!-- <q-separator spaced /> -->
          <!-- <q-item-label header>List Header</q-item-label> -->
          <!-- {{ selectedPaper }} -->
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { paperStore, tagStore } from "../composables/store";
import { ref, watch, toRaw } from "vue";

export default defineComponent({
  name: "PaperDetail",

  setup() {
    // watchEffect(() => {
    //   console.log(paperStore.selected);
    // });

    const selectedPapers = ref([]);

    const author = (p) => {
      let str = "";
      if (p && p.collaborations && p.collaborations.length > 0) {
        str += p.collaborations.join(" & ") + " collaboration";
      } else if (p && p.first_author) {
        str += p.first_author + " et al.";
      }
      return str;
    };

    const publication = (p) => {
      let str = "unpublished";
      if (p.publication.journal_title) {
        str = `${p.publication.journal_title} ${p.publication.journal_volume} ${p.publication.artid} (${p.publication.year})`;
      }
      return str;
    };

    watch(
      () => paperStore.selected,
      (newValue) => {
        if (newValue) {
          // console.log(newValue);
          selectedPapers.value = toRaw(newValue);
        }
      }
    );

    return {
      paperStore,
      tagStore,
      selectedPapers,
      author,
      publication,
    };
  },
});
</script>

<style></style>
