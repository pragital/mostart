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

        <q-toolbar-title>Mostart</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label header class="text-grey-8">Options</q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
      <q-list>
        <!-- <EssentialLink v-bind="setupLink" /> -->
        <q-separator />
        <EssentialLink v-bind="helpLink" />
        <q-separator />
        <EssentialLink v-bind="exitLink" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink";

export default {
  name: "MainLayout",

  components: {
    EssentialLink
  },

  data() {
    return {
      leftDrawerOpen: false,
      essentialLinks: [
        {
          title: "Home",
          caption: "",
          icon: "home",
          link: "/"
        },
        // {
        //   title: "Motor",
        //   caption: "Register new motors.",
        //   icon: "group_work",
        //   link: "/motor"
        // },
        {
          title: "Settings",
          caption: "Modify settings",
          icon: "settings",
          link: "/settings"
        }
      ],
      // setupLink: {
      //   title: "Setup",
      //   caption: "Setup new device or reset.",
      //   icon: "restore",
      //   link: "/setup"
      // },
      exitLink: {
        title: "Exit",
        caption: "",
        icon: "close",
        link: "/exit"
      },
      helpLink: {
        title: "Help",
        caption: "Seek more information.",
        icon: "help",
        link: "/help"
      }
    };
  }
};
</script>
