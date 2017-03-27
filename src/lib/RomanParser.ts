export default class RomanParser {
  private pos: number
  private romanTable: Roman[]
  private pendingRoman: string
  private _acceptedRomanText: string
  private _problem: Problem

  constructor (romanTable: Roman[]) {
    this.romanTable = romanTable
  }

  public get acceptedRomanText () {
    return this._acceptedRomanText
  }

  public get currentKanaText () {
    return this.problem.kanaText.substring(this.pos)
  }

  public get finished () {
    return this.problem.kanaText.length <= this.pos
  }

  public set problem (problem: Problem) {
    this._problem = problem
    this.pos = 0
    this.pendingRoman = ''
    this._acceptedRomanText = ''
  }

  public get problem () {
    return this._problem
  }

  public get remainRomanText () {
    let romanText = ''
    let offset = 0

    while (offset < this.currentKanaText.length) {
      const kanaText = this.currentKanaText.substring(offset)
      const match = this.match(kanaText[0], kanaText, offset === 0 ? this.pendingRoman : '')[0]

      romanText += match.input.substring(0, match.input.length - match.nextInput.length)
      offset += match.output.length
    }

    return romanText.substring(this.pendingRoman.length)
  }

  public match (char: string, kanaText: string, pendingRoman: string): Roman[] {
    if (kanaText.length === 0) return []

    const self = { input: char, output: char, nextInput: '' }
    let matches =
      this.romanTable
        .concat(self)
        .filter((roman) => roman.input.startsWith(pendingRoman) && kanaText.startsWith(roman.output))
        .filter((roman) =>
          roman.nextInput
            ? this.romanTable
              .filter((r) => kanaText.substring(1).startsWith(r.output))
              .some((r) => r.input.startsWith(roman.nextInput))
            : true)

    return matches
  }

  public input (char: string): boolean {
    const newPendingRoman = this.pendingRoman.concat(char)
    const matches = this.match(char, this.problem.kanaText.substring(this.pos), newPendingRoman)

    if (matches.length === 0) return false
    if (matches.length === 1 && matches[0].input === newPendingRoman) {
      this.pendingRoman = matches[0].nextInput || ''
      this.pos += matches[0].output.length
    } else {
      this.pendingRoman = newPendingRoman
    }

    this._acceptedRomanText += char
    return true
  }
}
