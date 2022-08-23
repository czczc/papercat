<template>
  <div class="q-pa-md">
    <q-table
      v-if="papers"
      :rows="papers"
      :columns="columns"
      row-key="arxiv"
      :filter="filter"
      :pagination="initialPagination"
      selection="multiple"
      v-model:selected="paperStore.selected"
      dense
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:top-left>
        <q-btn color="secondary" label="Update" @click="updateSelected" />
        <q-btn
          class="q-ml-sm"
          color="dark"
          label="Delete"
          @click="deleteSelected"
        />
      </template>

      <template v-slot:body-cell-arxiv="props">
        <q-td :props="props">
          <a :href="'https://arxiv.org/abs/' + props.row.arxiv">{{
            props.row.arxiv
          }}</a>
        </q-td>
      </template>

      <template v-slot:body-cell-journal="props">
        <q-td :props="props">
          <a :href="'https://doi.org/' + props.row.doi">{{
            props.row.publication.journal_title
          }}</a>
        </q-td>
      </template>

      <template v-slot:body-cell-citation="props">
        <q-td :props="props">
          <a
            :href="
              'https://inspirehep.net/literature/' + props.row.control_number
            "
            >{{ props.row.citation_count }}</a
          >
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { ref, toRaw, watch } from "vue";
import getCollection from "../composables/getCollection";
import { deletePaper, updatePaper } from "../composables/crud";
import { paperStore, tagStore } from "../composables/store";
import { user } from "boot/firebase";

const columns = [
  {
    name: "arxiv",
    align: "left",
    required: true,
    label: "arXiv",
    field: "arxiv",
    sortable: true,
  },
  {
    name: "title",
    align: "left",
    label: "Title",
    field: "title",
    // style: "max-width: 50px",
    // headerClasses: "bg-primary text-white",
    // headerStyle: "max-width: 50px",
  },
  {
    name: "author",
    label: "Author",
    field: "collaborations",
    sortable: true,
    format: (val, row) =>
      val.length > 0 ? val.join(", ") : row.first_author + " et al.",
    align: "left",
  },
  {
    name: "journal",
    label: "Journal",
    field: "publication",
    // sortable: true,
    // sort: (a, b) => a.journal_title > b.journal_title,
    format: (val) => val.journal_title,
    align: "left",
  },
  {
    name: "year",
    label: "Year",
    field: "year",
    sortable: true,
  },
  {
    name: "citation",
    label: "Citation",
    field: "citation_count",
    sortable: true,
  },
];

export default defineComponent({
  name: "PaperList",
  props: {
    title: {
      type: String,
      required: false,
    },
  },

  setup() {
    // console.log(user.value.uid);
    // const selected = ref([]);
    const initialPagination = {
      sortBy: "year",
      descending: true,
      rowsPerPage: 20,
    };
    const allPapers = getCollection("papers", [
      "users",
      "array-contains",
      user.value.uid,
    ]);
    const papers = ref(null);

    watch(allPapers, () => {
      papers.value = allPapers.value;
    });

    watch(
      () => tagStore.selected,
      (newValue) => {
        papers.value = allPapers.value.filter((item) => {
          return tagStore.tagToPapers[newValue].includes(item.arxiv);
        });
      }
    );

    const deleteSelected = () => {
      paperStore.selected.forEach((val) => {
        deletePaper(val.id);
      });
    };

    const updateSelected = () => {
      // console.log(paperStore.selected);
      paperStore.selected.forEach((val) => {
        updatePaper(toRaw(val));
      });
    };

    return {
      filter: ref(""),
      columns,
      initialPagination,
      deleteSelected,
      updateSelected,
      user,
      papers,
      paperStore,
    };
  },
});
</script>

<style>
.q-table td,
.q-table th {
  /* don't shorten cell contents */
  white-space: normal !important;
}
</style>
