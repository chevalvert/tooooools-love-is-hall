import fastRandom from 'fast-random'

let seed = Date.now()
let randomizer = fastRandom(seed)

export default {
  set seed (newSeed) {
    // Seed must be an integer
    seed = newSeed
    randomizer = fastRandom(seed)
  },

  get seed () {
    return seed
  },

  reset: () => {
    randomizer = fastRandom(seed)
  },

  random: () => randomizer.nextFloat(),
  randomOf: arr => arr[Math.floor(randomizer.nextFloat() * arr.length)],
  shuffle: arr => {
    let j, x
    for (let i = arr.length - 1; i > 0; i--) {
      j = Math.floor(randomizer.nextFloat() * (i + 1))
      x = arr[i]
      arr[i] = arr[j]
      arr[j] = x
    }
    return arr
  },
  randomFloat: (min, max) => randomizer.nextFloat() * (max - min) + min,
  randomInt: (min, max) => Math.floor(randomizer.nextFloat() * (max - min) + min)
}
