<template>
  <div class="container">
    <div v-if="!finished" class="problem">
      <div :style="displayTextStyle" class="display-text">{{ problem.displayText }}</div>
      <div :style="romanTextStyle" class="roman-text">
        <span v-for="char in acceptedChars" class="accepted-char">{{ char }}</span
        ><span class="remain head">{{ remainRomanTextHead }}</span
        ><span class="remain tail">{{ remainRomanTextTail }}</span>
      </div>
    </div>

    <div v-if="finished">gameclear</div>
  </div>
</template>

<script>
import RomanParser from '../lib/RomanParser'
import table from '../lib/table/googleime'

export default {
  data () {
    return {
      problems: [
        { displayText: '吾輩は猫である。名前はまだ無い。', kanaText: 'わがはいはねこである。なまえはまだない。' },
        { displayText: 'どこで生れたかとんと見当けんとうがつかぬ。', kanaText: 'どこでうまれたかとんとけんとうがつかぬ。' }
      ],
      problemIndex: 0,
      acceptedRomanText: '',
      remainRomanText: ''
    }
  },

  computed: {
    problem () {
      return this.problems[this.problemIndex]
    },

    finished () {
      return this.problemIndex >= this.problems.length
    },

    remainRomanTextHead () {
      return this.remainRomanText[0]
    },

    remainRomanTextTail () {
      return this.remainRomanText.slice(1)
    },

    acceptedChars () {
      return this.acceptedRomanText.split('')
    },

    romanText () {
      return this.acceptedRomanText + this.remainRomanText
    },

    displayTextStyle () {
      return {
        fontSize: 100.0 / this.problem.displayText.length * 0.8 + 'vw'
      }
    },

    romanTextStyle () {
      return {
        fontSize: 100.0 / this.romanText.length * 1.5 + 'vw'
      }
    }
  },

  created () {
    this._parser = new RomanParser(table)
    this.setProblem(this.problem)
    this.$watch('problem', problem => this.setProblem(problem))

    this._audioContext = new AudioContext()
    this.loadSounds({
      keyType: '/static/keytype.mp3',
      missType: '/static/butukaru.mp3'
    }, this._audioContext)
  },

  mounted () {
    document.addEventListener('keyup', this.onKeyUp.bind(this))
  },

  destroyed () {
    document.removeEventListener('keyup', this.onKeyUp)
  },

  methods: {
    onKeyUp (e) {
      if (/^[a-zA-Z0-9!?\-,. ]$/.test(e.key)) this.input(e.key)
    },

    loadSound (url, context, cb) {
      const req = new XMLHttpRequest()

      req.open('GET', url, true)
      req.responseType = 'arraybuffer'

      req.onload = () => {
        context.decodeAudioData(req.response, cb)
      }

      req.send()
    },

    loadSounds (sources, context) {
      this._sounds = this._sounds || {}

      for (let name in sources) {
        const url = sources[name]

        this.loadSound(url, context, (buffer) => {
          this._sounds[name] = buffer
        })
      }
    },

    playSound (name) {
      const source = this._audioContext.createBufferSource()

      source.buffer = this._sounds[name]
      source.connect(this._audioContext.destination)
      source.start(0)
    },

    setProblem (problem) {
      if (!problem) return

      this._parser.problem = problem
      this.remainRomanText = this._parser.remainRomanText
      this.acceptedRomanText = this._parser.acceptedRomanText
    },

    input (char) {
      this.playSound('keyType')

      if (this._parser.input(char)) {
        // console.log('ok', this._parser.remainRomanText)
        this.acceptedRomanText = this._parser.acceptedRomanText
        this.remainRomanText = this._parser.remainRomanText

        if (this._parser.finished) {
          this.problemIndex++
        }

        if (this.finished) this.problemIndex = 0
      } else {
        console.log('ng', char)
        this.playSound('missType')
      }
    }
  }
}
</script>

<style scoped>
@keyframes fade {
  0% {
    opacity: 1;
    top: 0;
  }

  100% {
    opacity: 0;
    top: 300px;
  }
}

@keyframes blink {
  0% {
    color: #888;
    text-shadow: 0 0 2px #000;
  }

  100% {
    color: #ecfff7;
    text-shadow: 0 0 8px #ecfff7;
  }
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.problem {
  text-align: center;
  font-size: 7vw;
  font-smoothing: antialiased;
}

.display-text {
  padding-bottom: 4px;
  border-bottom: 1px solid #3a3a3a;
  font-size: 0.8em;
  color: #ecfff7;
  text-shadow: 0 0 8px #ecfff7;
}

.roman-text {
  padding-top: 0px;
  font-family: 'Avenir Next', sans-serif;
  font-size: 0.8em;
  font-weight: 100;
}

.accepted-char {
  display: inline-block;
  position: relative;
  animation-name: fade;
  animation-duration: 0.5s;
  animation-delay: 0s;
  animation-timing-function: ease;
  animation-fill-mode: forwards;
}

.remain {
  &.head {
    display: inline-block;
    position: relative;
    animation-name: blink;
    animation-duration: 0.5s;
    animation-delay: 1s;
    animation-timing-function: ease;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }

  &.tail {
    color: #3a3a3a;
  }
}
</style>
