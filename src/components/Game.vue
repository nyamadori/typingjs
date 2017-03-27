<template>
  <div>
    <div v-if="!finished" class="problem">
      <div class="display-text">{{ problem.displayText }}</div>
      <div class="roman-text">
        <span class="accepted">{{ acceptedRomanText }}</span
        ><span class="remain">{{ remainRomanText }}</span>
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
        { displayText: '東京特許許可局', kanaText: 'とうきょうとっきょきょかきょく' },
        { displayText: '彼はよく柿喰う客だ', kanaText: 'かれはよくかきくうきゃくだ' },
        { displayText: '62円の切手', kanaText: '62えんのきって' }
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
      } else {
        console.log('ng', char)
        this.playSound('missType')
      }
    }
  }
}
</script>

<style>
.problem {
  text-align: center;
}

.display-text {
  font-size: 3rem;
}

.roman-text {
  font-family: 'Avenir';
  font-size: 1.5rem;
}

.accepted {
  color: #aaa;
}

.remain:first-letter {
  text-decoration: underline;
}
</style>
