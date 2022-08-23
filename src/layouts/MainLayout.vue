<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
          </q-avatar>
          Paper Cat
        </q-toolbar-title>

        <q-btn v-if="user" flat>
          <!-- <q-avatar>
            <img :src="user.photoURL" />
          </q-avatar> -->
          {{ user.displayName }}
        </q-btn>
        <q-btn v-if="user" flat @click="logout"> Log Out </q-btn>
        <q-btn v-else flat @click="login"> log in </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      show-if-above
      bordered
      :width="250"
    >
      <AddPaper />
      <q-separator />
      <TagList />
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
      <PaperDetail />
    </q-drawer>

    <q-page-container v-if="user">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
// import EssentialLink from "components/EssentialLink.vue";
import { auth, user } from "boot/firebase";
import { signOut } from "firebase/auth";
import userLogin from "../composables/userLogin";
import AddPaper from "src/components/AddPaper.vue";
import TagList from "components/TagList.vue";
import PaperDetail from "components/PaperDetail.vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    AddPaper,
    TagList,
    PaperDetail,
  },

  setup() {
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);

    const logout = () => {
      signOut(auth);
    };

    const login = () => {
      userLogin();
    };

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      rightDrawerOpen,
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value;
      },
      user,
      logout,
      login,
    };
  },
});
</script>
