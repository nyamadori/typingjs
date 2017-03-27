<template>
  <div>
    <div v-if="!finished" class="problem">
      <div class="display-text">{{ problem.displayText }}</div>
      <div class="roman-text"><span class="accepted">{{ acceptedRomanText }}</span><span class="remain">{{ remainRomanText }}</span></div>
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
        { displayText: '62円の値打ちしかないの', kanaText: '62えんのねうちしかないの' },
        { displayText: '僕のラブレター', kanaText: 'ぼくのらぶれたー' },
        { displayText: '読んだのなら返事くらいくれてもいいのに', kanaText: 'よんだのならへんじくらいくれてもいいのに' },
        { displayText: '何気なく歩道歩けば', kanaText: 'なにげなくほどうあるけば' },
        { displayText: '壁の破れた', kanaText: 'かべのやぶれた' },
        { displayText: '映画のポスター君を誘って断られたっけ', kanaText: 'えいがのぽすたーきみをさそってことわられたっけ' },
        { displayText: 'んにゃ', kanaText: 'んにゃ' },
        { displayText: '関西電気保安協会', kanaText: 'かんさいでんきほあんきょうかい' }
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

    setProblem (problem) {
      if (!problem) return

      this._parser.problem = problem
      this.remainRomanText = this._parser.remainRomanText
      this.acceptedRomanText = this._parser.acceptedRomanText
    },

    input (char) {
      if (this._parser.input(char)) {
        // console.log('ok', this._parser.remainRomanText)
        this.acceptedRomanText = this._parser.acceptedRomanText
        this.remainRomanText = this._parser.remainRomanText

        if (this._parser.finished) {
          this.problemIndex++
        }
      } else {
        console.log('ng', char)
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

.remain {

}
</style>
