<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white shadow-1">
      <q-toolbar id="main-header" class="text-black">
        <q-toolbar-title>
          <div class="logoAlt q-pa-none">
            <q-btn
              round
              size="18px"
              color="blue-12"
              icon="fas fa-chart-line"
              glossy
              to="/"
            />
            <h5 class="text-center text-black text-weight-bold">
              Expensa
            </h5>
          </div>
        </q-toolbar-title>
        <q-tabs shrink class="gt-sm">
          <q-route-tab name="home" label="Home" to="/home"></q-route-tab>
          <q-route-tab
            name="expenses"
            label="Expenses"
            to="/expenses"
          ></q-route-tab>
          <q-route-tab name="income" label="Income" to="/income"></q-route-tab>
          <q-route-tab
            name="customer"
            label="Customers"
            to="/customer"
          ></q-route-tab>
          <q-route-tab name="report" label="Report" to="/report"></q-route-tab>
          <q-route-tab
            name="settings"
            label="Settings"
            to="/settings"
          ></q-route-tab>
          <q-route-tab
            name="file-manager"
            label="file-manager"
            to="/file-manager"
          ></q-route-tab>
        </q-tabs>
        <q-space />
        <q-btn
          class="gt-sm"
          size="15px"
          color="red-7"
          glossy
          icon="fas fa-user-circle"
          label="Logout"
          to="#"
        />
        <div class="gt-sm text-black"><small>Expense tracking app</small></div>
        <q-btn
          id="menu-icon"
          class="lt-md shadow-2 q-mr-lg"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="drawerRight = !drawerRight"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerRight" bordered content-class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8">
          <div class="logoAlt">
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
        <q-item>
          <q-item-section>
            <q-btn
              class="text-md-left"
              size="15px"
              color="red-7"
              glossy
              icon="fas fa-power-off"
              label="Logout"
              to="#"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- <q-footer class="text-center text-grey-5">
      <q-toolbar class="bg-white">
        <q-toolbar-title>SpecstechAfrica</q-toolbar-title>
      </q-toolbar>
    </q-footer> -->
  </q-layout>
</template>
<style scoped>
.logoAlt h5 {
  font-size: 1.3rem;
  line-height: 0.1rem;
  letter-spacing: normal;
}
</style>

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
    title: "Customers",
    icon: "fas fa-cubes",
    link: "/customer"
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
      drawerRight: false,
      essentialLinks: linksData
    };
  },
  computed: {
    auth: () => {
      return users.getters.ifAuthenticated;
    }
  }
};
</script>
