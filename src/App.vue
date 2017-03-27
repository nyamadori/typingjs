<template>
  <div id="app">
    <game></game>
  </div>
</template>

<script>
import Game from './components/Game'

export default {
  name: 'app',
  components: {
    Game
  }
}
</script>

<style>
@font-face {
  font-family: 'Noto Sans Japanese';
  font-style: normal;
  font-weight: 100;
  src: url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Thin.woff2) format('woff2'),
    url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Thin.woff) format('woff'),
    url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Thin.otf) format('opentype');
}

* {
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
}

body {
  margin: 0;
  background: #050505;
  color: #fff;
  font-family: 'Noto Sans Japanese', serif;
}
</style>
