    class Triangular extends Distribution {
        /**
         * <pre>
         * Triangular distribution umber generator.
         * Continuous distribution bounded by given lower and upper limits, and having a given mode value in-between.
         * See [Triangular distribution]{@link https://en.wikipedia.org/wiki/Triangular_distribution}.
         * </pre>
         * <div style="text-align:center">
         *      <figure style="display:inline-block">
         *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/4/45/Triangular_distribution_PMF.png">
         *      <figcaption style="text-align:center">Probability density function</figcaption>
         *      </figure>
         *      <figure style="display:inline-block">
         *      <img style="max-height:400px; max-width:400px" src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Triangular_distribution_CMF.png">
         *      <figcaption style="text-align:center">Cumulative distribution function</figcaption>
         *      </figure>
         * </div>
         * @param {Number} [min=0] - Lower bound
         * @param {Number} [max=1] - Upper bound
         * @param {?Number} [mode=null] - Mode (default to midpoint between bounds, ie. symetric distribution)
         * @category distribution
         * @extends Distribution
         */
            constructor(min = 0, max = 1, mode = null) {
                super()
                this.min(min).max(max).mode(mode)
            }

        /**
         * Update lower bound value.
         * @param {Number} [min] - Lower bound
         * @return {Number|Distribution} Return instance in setter mode and value in getter mode
         */
            min(min) { return arguments.length ? (this._min = min, this) : this._min }

        /**
        * Update upper bound value.
        * @param {Number} [max] - Upper bound
        * @return {Number|Distribution} Return instance in setter mode and value in getter mode
         */
            max(max) { return arguments.length ? (this._max = max, this) : this._max }

        /**
        * Update mode value.
        * Must be between lower and upper bounds.
        * @param {Number} [mode] - Mode value
        * @return {?(Number|Distribution)} Return instance in setter mode and value in getter mode
         */
            mode(mode) { return arguments.length ? (this._mode = mode, this) : this._mode }

       /**
        * Create a uniform distribution random number generator.
        * <div class="alert warning">
        * This method requires <span class="bold">this</span> context to be a {@link Distribution} instance, and this cannot be called directly.
        * </div>
        * @private
        * @return {Generator} Uniform distribution number generator
        */
           static *generator() {
               let rand = new Distribution.Random(this.seed()), c, v, swap = false
               while (1) {
                   let min = swap ? this.max() : this.min() , max = swap ? this.min() : this.max()
                   let c = (this.mode() === null) ? 0.5 : (this.mode() - min)/(max - min)
                   if (!Number.isFinite(c)) { yield min } else {
                       let v = rand.next()
                       if (v > c) {
                           v = 1 - v ; c = 1 - c ; swap = !swap
                           yield min + (max - min) * Math.sqrt(v * c)
                       }
                   }
               }
           }
    }

    //Registering
        Distribution.Triangular = Triangular
