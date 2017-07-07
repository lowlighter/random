class Random extends Distribution {
    /**
     * <pre>
     * Random number between [0;1[ generator.
     *
     * Wichman-Hill random number generator.
     *
     * See [Uniform Distribution]{@link https://en.wikipedia.org/wiki/Uniform_distribution_(continuous)}.
     * </pre>
     * <div class="alert warning">
     * This is the sole Distribution that can takes a <span class="bold">seed</span> argument in its constructor.
     * Other distributions need to be initialized with [Distribution.seed]{@link Distribution#seed} method.
     * </div>
     * @param {?(Number|String)} [seed] - Seed
     * @category distribution
     * @extends Distribution
     */
        constructor(seed) {
            super()
            this.seed(seed)
        }

   /**
    * Create a uniform distribution random number between [0;1[ generator.
    * <div class="alert warning">
    * This method requires <span class="bold">this</span> context to be a {@link Distribution} instance, and this cannot be called directly.
    * </div>
    * @private
    * @return {Generator} Uniform distribution number generator
    */
       static *generator() {
           let a = 30269, b = 30307, c = 30323, seed = this.seed()
           let x = seed%(a-1)+1, y = seed%(b-1)+1, z = seed%(c-1)+1
           while (1) {
               x = (x*171)%a, y = (y*172)%b, z = (z*170)%c
               yield (x/a + y/b + z/c) % 1
           }
       }
}

//Registering
    Distribution.Random = Random
