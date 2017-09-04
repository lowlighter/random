$(function () {
    //Init and params
        let rand = {}, r = null, interval = null
        let param = {
            uniform:{min:0, max:3, step:0.03},
            normal:{center:true},
            lognormal:{min:0, max:5, step:0.05},
            exponential:{min:0, max:5, step:0.05},
            vonMises:{min:-Math.PI, max:2*Math.PI, center:true, step:0.05},
            gamma:{min:0, max:20, step:0.2},
            gauss:{center:true},
            beta:{min:0, max:1, step:0.01},
            pareto:{min:0, max:5, step:0.05},
            weibull:{min:0, max:2.5, step:0.025},
            set:{min:0, max:1, step:1},
            triangular:{min:0, max:3, step:0.03, center:true}
        }

    //Chart creation
        $(`<div class="chart-wrapper" style="width:600px;margin:0;"><canvas class="chart"></canvas></div>`).appendTo(".app-view")
        let chart = new Chart($(`.chart`).get(0).getContext("2d"), {
            type:"bar", data:{labels:[], datasets:[{data:[]}]},
            options:{ animateScale:true, animationEasing:"linear", legend:{display:false},
                title:{ display: false, text:""},
                scales:{
                    xAxes:[{gridLines:{display:false}, categoryPercentage:1, barPercentage:1.0}],
                    yAxes:[{ticks:{beginAtZero:true}, gridLines:{display:false}}]
            } }
        })

    //Demo
        function demo(distribution) {
            //Name update
                let name = distribution.charAt(0).toLocaleUpperCase()+distribution.substr(1)
                chart.options.title.text = `Distribution : ${name}`
                $(".code-distribution").text(name)

            //Parameters displayed updated
                $(`.app table tr, .code .sample`).show()
                $(`.app table tr:not(.all, .${distribution}), .code .sample:not(.all, .${distribution})`).hide()

            //Generator
                if (!rand[distribution]) { rand[distribution] = new Lowlight.Random.Distribution[name]() }
                r = rand[distribution]

            //Parameters
                let o = $.extend(true, {min:-5, max:5, step:0.1, rolls:parseInt($("[name='rolls']").val())||1, label:1, center:false}, param[distribution])
                let min = o.min, max = o.max, step = o.step, rolls = o.rolls, center = o.center, label = o.label
                let sample = Math.floor(1+(max-min)/step)
                let data = (new Array(sample)).fill(0)

            //Labels update
                chart.data.labels = (new Array(sample)).fill(0).map((v, i) => (i == 0)||((i*step)%label == 0)||(i == sample-1) ? (min + i*step).toFixed(-Math.log10(step)) : "")
                chart.data.datasets[0].data = (new Array(sample)).fill(0)
                chart.data.datasets[0].backgroundColor = (new Array(sample)).fill("rgba(0,0,0,1)")
                chart.update()

            //Rolls
                for (let i = 0; i < rolls; i++) {
                    let v = r.next(), j = center ? Math.floor((v-min)/step) : Math.floor(v/step)
                    if ((j >= 0)&&(j < data.length)) { data[j]++ }
                }

            //Data update
                chart.data.datasets[0].data = data
                chart.update()
            //Interval
                clearInterval(interval)
                interval = setInterval(function () { $(".code-next *").text(r.next()) }, 500)
        }

    //Controls
        function controller() {
            //Seed
                $("input[name='seed']").val(Date.now())
            //Parameter change
                $("input[type=number]").on("input", function () {
                    let name = $(this).attr("name"), val = parseInt($(this).val())
                    if (name === "seed") {
                        $(`.code-seed *`).text(val)
                        if ((r.seed() !== val)&&(Number.isFinite(val))) { r.reset().seed(val) }
                    } else if (name === "rolls") {
                        demo($('[name="distribution"]').val())
                    } else if (Number.isFinite(val)) {
                        r[name](val)
                        $(`.code-${name} *`).text(val)
                        demo($('[name="distribution"]').val())
                    }
                })

            //Distribution change
                $('[name="distribution"]').on("change", function () {
                    let distribution = $(this).val()
                    demo(distribution)
                    $(`.app table tr.${distribution} input[type=number]`).each(function () { $(this).val(r[$(this).attr("name")]()) })
                    $(`.code .${distribution} [class^=code]`).each(function () { $(this).find("*").text(r[$(this).attr("class").match(/-(.*)/)[1]]()) })
                }).val("normal")
        }



    //Demo
        demo("normal")
        controller()
})
