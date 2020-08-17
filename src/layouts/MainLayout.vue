<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Expensa
        </q-toolbar-title>

        <div><small>Expense tracking app</small></div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">
          <div class="logoAlt q-pa-none">
            <q-btn
              round
              size="18px"
              color="blue-12"
              icon="fas fa-chart-line"
              glossy
              to="/"
            />
            <h5 class="text-center text-weight-bold">Expensa</h5>
          </div>
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";

const linksData = [
  {
    title: "Expenses",
    icon: "fas fa-chart-line",
    link: "/expenses"
  },
  {
    title: "Income",
    icon: "fas fa-cubes",
    link: "/income"
  },
  {
    title: "Report",
    icon: "fas fa-clipboard-list",
    link: "/report"
  },
  {
    title: "settings",
    icon: "fas fa-cog",
    link: "/settings"
  },
  {
    title: "File Manager",
    caption: "Comming Soon",
    icon: "fas fa-file",
    link: "/file-manager"
  }
];

export default {
  name: "MainLayout",
  components: { EssentialLink },
  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    };
  }
};
</script>
