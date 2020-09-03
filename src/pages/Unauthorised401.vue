<template>
  <div
    class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center"
  >
    <div>
      <div style="font-size: 30vh">
        401
      </div>

      <div class="text-h2" style="opacity:.4">
        Unauthorized User...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        @click="$router.push('/login')"
        label="Go to Login"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Unauthorized401"
};
</script>
